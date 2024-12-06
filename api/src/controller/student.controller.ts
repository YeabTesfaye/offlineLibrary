import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Gender, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import BadRequestError from '../errors/bad-request';
import prisma from '../configs/db';
import UnauthenticatedError from '../errors/unauthenticated';
import { createToken } from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';

import NotFoundError from '../errors/not-found';
import {
  studentLoginSchema,
  studentRegisterSchema,
  studentUpdateSchema,
} from '../validator/student.schema';

export const register = async (req: Request, res: Response) => {
  // validate request body
  const { error, value } = studentRegisterSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`,
    );
  }
  const { id, firstName, lastName, password, age, grade, gender, role } = value;

  // const check if student already exist
  const studentExist = await prisma.student.findUnique({
    where: {
      id,
    },
  });
  if (studentExist) {
    throw new BadRequestError(`Student with id ${id} already exist`);
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // save to database
  const student = await prisma.student.create({
    data: {
      id,
      firstName,
      lastName,
      password: hashedPassword,
      age,
      grade,
      gender: gender as Gender,
      role: role as Role,
    },
  });
  // Exclude password from the response
  const { password: _, ...studentWithoutPassword } = student;
  res.status(StatusCodes.CREATED).json({ student: studentWithoutPassword });
};

// Student login
export const login = async (req: Request, res: Response) => {
  const { error, value } = studentLoginSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new BadRequestError(`Validation error: ${errorMessage}`);
  }

  const { id, password } = value;

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  if (!student) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, student.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  // Generate Token
  const tokenUser = createToken(student);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// update student
export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const { error, value } = studentUpdateSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(', ');
    throw new BadRequestError(`Validation error: ${errorMessage}`);
  }

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { id },
  });
  if (!student) {
    throw new NotFoundError(`Student with ID ${id} not found`);
  }
  const { firstName, lastName, password, age, grade, gender, role } = value;

  // hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Proceed with the update
  const updatedStudent = await prisma.student.update({
    where: { id },
    data: {
      id,
      firstName,
      lastName,
      password: hashedPassword,
      age,
      grade,
      gender,
      role,
    },
  });
  const { password: _, ...studentWithoutPassword } = updatedStudent;
  if (password) {
    const tokenUser = createToken(studentWithoutPassword);
    attachCookiesToResponse({ res, user: tokenUser }); // Attach the new token to the response cookie
  }
  res.status(StatusCodes.OK).json({
    msg: 'Student updated successfully',
    student: studentWithoutPassword,
  });
};

export const logout = async (_req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Student has been logged out successfully !!' });
};

// Delete student controller
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { id },
  });
  if (!student) {
    throw new NotFoundError(`Student with ID ${id} not found`);
  }

  // Proceed with the delete
  await prisma.student.delete({
    where: { id },
  });

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res.sendStatus(StatusCodes.NO_CONTENT);
};

export const getSingleStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
  });
  if (!student) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Student with student id  ${id} doesn't exist `,
    });
  }

  res.status(StatusCodes.OK).json({
    student,
  });
};

export const getAllStudent = async (req: Request, res: Response) => {
  const studentes = await prisma.student.findMany({});

  if (studentes.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: 'No Student found.',
    });
    return;
  }
  res.status(StatusCodes.OK).json({
    message: 'Courses retrieved successfully',
    studentes,
  });
};
