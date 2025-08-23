export const ERROR_MESSAGES = {
  // General
  VALIDATION_ERROR: 'Please check your input and try again',
  ACCESS_UNAUTHORIZED: 'You are not authorized to access this resource',
  ACCESS_FORBIDDEN: 'You do not have permission to perform this action',
  RESOURCE_NOT_FOUND: 'The requested resource was not found',
  RESOURCE_CONFLICT: 'This resource already exists',
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later',
  ROUTE_NOT_FOUND: 'The requested page was not found',
  DATABASE_ERROR: 'Database error occurred. Please try again',

  // Authentication
  USER_ALREADY_EXISTS:
    'This email is already registered. Please use a different email or try logging in',
  INVALID_CREDENTIALS:
    'Invalid email or password. Please check your credentials',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again',
  INVALID_TOKEN: 'Invalid authentication token. Please log in again',
  USER_NOT_FOUND: 'No account found with this email address',

  // Todoist specific
  WORKSPACE_NOT_FOUND: 'Workspace not found',
  PROJECT_NOT_FOUND: 'Project not found',
  TASK_NOT_FOUND: 'Task not found',
} as const;

export type ErrorCodeType = keyof typeof ERROR_MESSAGES;
