/**
 * Node modules
 */
import z from 'zod';

/**
 * Register Schema Validation
 */
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .email('Please enter a valid email address.')
    .max(50, 'Maximum 50 characters'),
  password: z
    .string()
    .trim()
    .nonempty('Password is required')
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters'),
});
