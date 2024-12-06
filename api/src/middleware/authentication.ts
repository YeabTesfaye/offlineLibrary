import { Request, Response, NextFunction } from 'express';
import { isTokenValid } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';

interface UserPayload {
  name: string;
  userId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.signedCookies.token;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Authentication Invalid: No token provided.',
    });
    return;
  }

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Authentication Invalid: Token verification failed.',
    });
  }
};

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.user);
  if (req.user?.role !== 'ADMIN') {
    res.status(StatusCodes.FORBIDDEN).json({
      message: 'Forbidden',
    });
    return;
  }
  next();
};
