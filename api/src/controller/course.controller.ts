import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { courseRegistrationSchema, courseUpdateSchema } from '../validator/course.schema';
import BadRequestError from '../errors/bad-request';
import prisma from '../configs/db';
import { CourseData } from '../interfaces/models';
import { uploadVideo } from '../utils/uploadVideo';

export const register = async (
  req: Request<{}, {}, Omit<CourseData, 'content'>>,
  res: Response,
) => {
  const { error, value } = courseRegistrationSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`,
    );
  }

  const { courseCode, courseName, description, instructorId, contentType } =
    value;

  const content = await uploadVideo(req.files?.content);

  const course = await prisma.course.create({
    data: {
      courseCode,
      courseName,
      description,
      instructorId: instructorId || null,
      contentType,
      content,
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Course created successfully',
    course,
  });
};

export const getAllCourses: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
    },
  });

  if (courses.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: 'No courses found.',
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    message: 'Courses retrieved successfully',
    courses,
  });
};

// Controller to update a course
export const updateCourse: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params; // Get course ID from route parameters
  const { error, value } = courseUpdateSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`,
    );
  }
  const { description, instructorId, courseName, contentType, courseCode } =
    value;

  // Find the course by courseCode (ensure this is unique)
  const course = await prisma.course.findUnique({
    where: { courseCode: id }, // Assuming courseCode is unique
  });

  if (!course) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Course with courseCode ${id} not found.`,
    });
    return;
  }

  const content = await uploadVideo(req.files?.content);

  // Update the course with new data
  const updatedCourse = await prisma.course.update({
    where: { courseCode: id },
    data: {
      courseCode: courseCode || id,
      description,
      instructorId,
      courseName,
      content,
      contentType: contentType || null,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'Course updated successfully',
    course: updatedCourse,
  });
};
export const getCourseByCourseCode = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Find the course by ID
  const course = await prisma.course.findUnique({
    where: { courseCode: id },
  });
  if (!course) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Course with course ID ${id} not found.`,
    });
  }

  res.status(StatusCodes.OK).json({
    message: 'Course updated successfully',
    course,
  });
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Find the course by ID
  const course = await prisma.course.findUnique({
    where: { courseCode: id },
  });
  if (!course) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Course with course ID ${id} not found.`,
    });
  }

  // Delete the course
  await prisma.course.delete({
    where: { courseCode: id },
  });
  res.status(StatusCodes.NO_CONTENT).json(); // No content to return
};
