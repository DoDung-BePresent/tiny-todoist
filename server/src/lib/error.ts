/**
 * Custom modules
 */
import {
  ERROR_CODE_ENUM,
  ErrorCodeEnumType,
  STATUS_CODE,
  StatusCodeType,
} from '@/constants/error.constant';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(
    message: string,
    statusCode: StatusCodeType = STATUS_CODE.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCodeEnumType = ERROR_CODE_ENUM.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(message, STATUS_CODE.BAD_REQUEST, ERROR_CODE_ENUM.VALIDATION_ERROR);
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(
      message,
      STATUS_CODE.UNAUTHORIZED,
      ERROR_CODE_ENUM.ACCESS_UNAUTHORIZED,
    );
  }
}

// 403 - Forbidden
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden permissions') {
    super(message, STATUS_CODE.FORBIDDEN, ERROR_CODE_ENUM.ACCESS_FORBIDDEN);
  }
}

// 404 - Not Found
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, STATUS_CODE.NOT_FOUND, ERROR_CODE_ENUM.RESOURCE_NOT_FOUND);
  }
}

// 409 - Conflict
export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict') {
    super(message, STATUS_CODE.CONFLICT, ERROR_CODE_ENUM.RESOURCE_CONFLICT);
  }
}

// 500 - Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(
      message,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      ERROR_CODE_ENUM.INTERNAL_SERVER_ERROR,
    );
  }
}
