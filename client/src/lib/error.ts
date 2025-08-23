/**
 * Constants
 */
import { ERROR_MESSAGES, type ErrorCodeType } from '@/constants/errors';

/**
 * Get user-friendly error message from errorCode
 */
export const getErrorMessage = (errorCode?: string): string => {
  if (!errorCode) return 'An unexpected error occurred';

  return (
    ERROR_MESSAGES[errorCode as ErrorCodeType] || 'An unexpected error occurred'
  );
};

/**
 * Extract error details from API error response
 */
export const extractErrorDetails = (error: any) => {
  if (error?.response?.data) {
    const { message, errorCode, errors } = error.response.data;
    return {
      message: getErrorMessage(errorCode),
      originalMessage: message,
      errorCode,
      validationErrors: errors, // For validation errors
    };
  }

  // Handle network or other errors
  if (error?.message) {
    return {
      message: 'Network error. Please check your connection and try again',
      originalMessage: error.message,
      errorCode: null,
      validationErrors: null,
    };
  }

  return {
    message: 'An unexpected error occurred',
    originalMessage: 'Unknown error',
    errorCode: null,
    validationErrors: null,
  };
};
