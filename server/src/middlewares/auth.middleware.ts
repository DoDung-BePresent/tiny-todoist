/**
 * Express
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Libs
 */
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { UnauthorizedError } from '@/lib/error';

/**
 * Configs
 */
import config from '@/config/env.config';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Authentication token is required'));
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token, config.JWT_ACCESS_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return next(new UnauthorizedError('User not found for this token'));
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token has expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(error);
  }
};
