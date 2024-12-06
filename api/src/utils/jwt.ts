import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';

export const createJWT = ({ payload }: { payload: Payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const isTokenValid = ({ token }: { token: string }) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};

interface Payload {
  userId: string;       // Corresponds to studentId, teacherId, adminId
  name: string;         // Full name (firstName + lastName)
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';  // Role based on Prisma schema
  age: number;
  gender: 'Male' | 'Female';  // Gender as defined in the schema
}

export const attachCookiesToResponse = ({
  res,
  user,
}: {
  res: Response;
  user: Payload;
}) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    signed: true,  // To ensure the cookie is signed and validated
  });
};
