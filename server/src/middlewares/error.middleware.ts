/**
 * Node modules
 */
import { z, ZodError } from 'zod';
import { Response, NextFunction, Request } from 'express';

/**
 * Libs
 */
import logger from '@/lib/logger';
import { ApiError } from '@/lib/error';

/**
 * Constants
 */
import { ERROR_CODE_ENUM, STATUS_CODE } from '@/constants/error.constant';

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  logger.warn('Validation error occurred', {
    path: res.req?.path,
    errors: errors,
  });

  return res.status(STATUS_CODE.BAD_REQUEST).json({
    message: 'Validation failed',
    errors: errors,
    errorCode: ERROR_CODE_ENUM.VALIDATION_ERROR,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message = `Route ${req.originalUrl} not found`;
  res.status(STATUS_CODE.NOT_FOUND).json({
    message,
    errorCode: ERROR_CODE_ENUM.RESOURCE_NOT_FOUND,
  });
};

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  console.error(`Error Occurred on PATH: ${req.path} `, error);

  if (error instanceof SyntaxError) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      message: 'Invalid JSON format. Please check your request body.',
      errorCode: ERROR_CODE_ENUM.VALIDATION_ERROR,
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  logger.error('Unexpected error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
  });

  return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    errorCode: ERROR_CODE_ENUM.INTERNAL_SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && {
      error: error?.message || 'Unknown error occurred',
    }),
  });
};
