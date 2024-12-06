import { Request, Response, NextFunction } from 'express';
import { isTokenValid } from '../utils/jwt';
import UnauthenticatedError from '../errors/unauthenticated';

interface UserPayload {
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
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  try {
    const payload = isTokenValid({ token });
    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};
