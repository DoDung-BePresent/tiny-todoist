export const STATUS_CODE = {
  // Success responses
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCodeType = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

export const ERROR_CODE_ENUM = {
  // General
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  ACCESS_UNAUTHORIZED: 'ACCESS_UNAUTHORIZED',
  ACCESS_FORBIDDEN: 'ACCESS_FORBIDDEN',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',

  // Authentication
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Todoist specific
  WORKSPACE_NOT_FOUND: 'WORKSPACE_NOT_FOUND',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
} as const;

export type ErrorCodeEnumType =
  (typeof ERROR_CODE_ENUM)[keyof typeof ERROR_CODE_ENUM];

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

  // Validation
  VALIDATION_ERROR: 'Validation failed',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 8 characters',

  // Resources
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  WORKSPACE_NOT_FOUND: 'Workspace not found',
  PROJECT_NOT_FOUND: 'Project not found',
  TASK_NOT_FOUND: 'Task not found',

  // Generic
  INTERNAL_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  RESOURCE_NOT_FOUND: 'Resource not found',
} as const;
