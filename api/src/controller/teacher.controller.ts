import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Gender, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import {
  teacherLoginSchema,
  teacherRegistrationSchema,
  teacherUpdateSchema,
} from '../validator/teacher.schema';
import BadRequestError from '../errors/bad-request';
import prisma from '../configs/db';
import UnauthenticatedError from '../errors/unauthenticated';
import { createToken } from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import NotFoundError from '../errors/not-found';

export const register = async (req: Request, res: Response) => {
  const { value, error } = teacherRegistrationSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`,
    );
  }

  const {
    id,
    firstName,
    lastName,
    password,
    role,
    courses,
    gender,
    age,
    grades,
  } = value;

  // const check if teacher already exist
  const teacherExist = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });
  if (teacherExist) {
    throw new BadRequestError(`Teacher with id ${id} already exist`);
  }

  const existingCourses = await prisma.course.findMany({
    where: {
      courseCode: { in: courses },
    },
  });

  if (existingCourses.length !== courses.length) {
    const existingCourseCodes = existingCourses.map(
      (course) => course.courseCode,
    );
    const missingCourses = courses.filter(
      (courseCode: any) => !existingCourseCodes.includes(courseCode),
    );
    throw new BadRequestError(
      `The following courses do not exist: ${missingCourses.join(', ')}`,
    );
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const teacher = await prisma.teacher.create({
    data: {
      id,
      firstName,
      lastName,
      password: hashedPassword,
      age,
      gender,
      // grades: grades || [],
      role: role || 'TEACHER',
      courses: {
        connect: courses.map((course: { courseCode: string }) => ({
          courseCode: course,
        })),
      },
    },
  });

  // Exclude password from the response
  const { password: _, ...teacherWithoutPassword } = teacher;
  res.status(StatusCodes.CREATED).json({ teacher: teacherWithoutPassword });
};

// Student login
export const login = async (req: Request, res: Response) => {
  const { error, value } = teacherLoginSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new BadRequestError(`Validation error: ${errorMessage}`);
  }

  const { id, password } = value;

  // Check if teacher exists
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, teacher.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  // Generate Token
  const tokenUser = createToken(teacher);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// update teacher
export const updateTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const { error, value } = teacherUpdateSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new BadRequestError(`Validation error: ${errorMessage}`);
  }

  // Check if teacher exists
  const teacher = await prisma.teacher.findUnique({
    where: { id },
  });
  if (!teacher) {
    throw new NotFoundError(`Teacher with ID ${id} not found`);
  }
  const { firstName, lastName, password, age, grades, gender, role, courses } =
    value;

  // hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Proceed with the update
  const updateTeacher = await prisma.teacher.update({
    where: { id },
    data: {
      id,
      firstName,
      lastName,
      password: hashedPassword,
      age,
      grades,
      gender,
      role,
      courses: {
        connect: courses.map((course: { courseCode: string }) => ({
          courseCode: course,
        })),
      },
    },
  });
  const { password: _, ...teacherWithoutPassword } = updateTeacher;
  if (password) {
    const tokenUser = createToken(teacherWithoutPassword);
    attachCookiesToResponse({ res, user: tokenUser }); // Attach the new token to the response cookie
  }
  res.status(StatusCodes.OK).json({
    msg: 'Teacher updated successfully',
    teacher: teacherWithoutPassword,
  });
};

// Get single teacher
export const getSingleTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      courses: true,
      grades: true,
    },
  });
  if (!teacher) {
    throw new BadRequestError(`Teacher with id ${id} doesn't exist`);
  }

  const { password, ...teacherWtihoutPassowrd } = teacher;
  res.status(StatusCodes.OK).json({
    teacher: teacherWtihoutPassowrd,
  });
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) {
    throw new BadRequestError(`Teacher with ID ${id} does not exist.`);
  }

  await prisma.teacher.delete({
    where: { id },
  });

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res.sendStatus(StatusCodes.NO_CONTENT);
};
