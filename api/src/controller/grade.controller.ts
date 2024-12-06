import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { gradeRegistrationSchema } from '../validator/grade.schema';
import BadRequestError from '../errors/bad-request';
import prisma from '../configs/db';
import NotFoundError from '../errors/not-found';

export const registerGrade = async (req: Request, res: Response) => {
  const { error, value } = gradeRegistrationSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`,
    );
  }

  const { id, name, teachers } = value;

  // Check if grade already exists
  const gradeExists = await prisma.grade.findUnique({
    where: { id },
  });

  if (gradeExists) {
    throw new BadRequestError(`Grade with ID ${id} already exists.`);
  }

  // validate teacher IDs
  if (teachers.length > 0) {
    const existingTeachers = await prisma.teacher.findMany({
      where: {
        id: {
          in: teachers,
        },
      },
    });

    const existingTeacherIds = existingTeachers.map((teacher) => teacher.id);

    // Check for missing teacher IDs
    const missingTeacherIds = teachers.filter(
      (teacherId: string) => !existingTeacherIds.includes(teacherId),
    );

    if (missingTeacherIds.length > 0) {
      throw new BadRequestError(
        `The following teacher IDs do not exist: ${missingTeacherIds.join(
          ', ',
        )}`,
      );
    }
  }

  const grade = await prisma.grade.create({
    data: {
      id,
      name,
      teachers: {
        connect: teachers.map((teacherId: string) => ({ id: teacherId })),
      },
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Grade registered successfully',
    grade,
  });
};

export const getSingleGrade = async (req: Request, res: Response) => {
  const { id } = req.params;

  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
    include: {
      teachers: true,
    },
  });
  if (!grade) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `grade with student id  ${id} doesn't exist `,
    });
  }
  const sanitizedTeachers = grade?.teachers.map(
    ({ password, ...teacher }) => teacher,
  );
  res.status(StatusCodes.OK).json({
    grade: {
      ...grade,
      teachers: sanitizedTeachers,
    },
  });
};

export const deleteGrade = async (req: Request, res: Response) => {
  const { id } = req.params;

  const grade = await prisma.grade.findUnique({
    where: {
      id,
    },
  });

  if (!grade) {
    throw new NotFoundError(`Grade with ID ${id} does not exist.`);
  }

  await prisma.grade.delete({
    where: {
      id,
    },
  });
  res.sendStatus(StatusCodes.NO_CONTENT);
};
