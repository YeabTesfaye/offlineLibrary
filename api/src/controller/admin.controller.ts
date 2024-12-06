import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { adminRegistrationSchema } from '../validator/admin.schema';
import BadRequestError from '../errors/bad-request';
import prisma from '../configs/db';
import { StatusCodes } from 'http-status-codes';
import { createToken } from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { value, error } = adminRegistrationSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`,
    );
  }

  const { id, password, firstName, lastName, Role } = value;

  const adminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (adminExist) {
    throw new BadRequestError(`Admin with id ${id} already exist`);
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // save to database
  const admin = await prisma.admin.create({
    data: {
      firstName,
      lastName,
      id,
      password: hashedPassword,
    },
  });

  const { password: _, ...adminWithoutPassword } = admin;
  res.status(StatusCodes.OK).json({
    admin: adminWithoutPassword,
  });
};

export const login = async (req: Request, res: Response) => {
  const { id, password } = req.body;

  // Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!admin) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Invalid credentials',
    });
    return;
  }

  // Compare the password
  const isPasswordCorrect = await bcrypt.compare(password, admin.password);
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Invalid credentials',
    });
  }

  const tokenUser = createToken(admin);
  attachCookiesToResponse({ res, user: tokenUser });
  const { age: _, ...tokenUserWithOutAge } = tokenUser;
  res.status(StatusCodes.OK).json({
    tokenUser: tokenUserWithOutAge,
  });
};

export const getAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Admin with id ${id} does not exist`,
    });
    return;
  }

  const { password, ...adminWithoutPassword } = admin;

  res.status(StatusCodes.OK).json({
    admin: adminWithoutPassword,
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
    .json({ msg: 'admin has been logged out successfully !!' });
};
export const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Admin with id ${id} does not exist`,
    });
    return;
  }

  // Delete the admin
  await prisma.admin.delete({
    where: { id },
  });

  res.status(StatusCodes.OK).json({
    message: `Admin with id ${id} has been deleted successfully`,
  });
};
