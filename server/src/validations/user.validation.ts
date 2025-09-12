import { z } from 'zod';

export const userValidation = {
  updateProfileSchema: z.object({
    body: z.object({
      name: z.string().trim().min(1, 'Name cannot be empty.').optional(),
      removeAvatar: z.enum(['true']).optional(),
    }),
  }),

  updatePasswordSchema: z.object({
    body: z
      .object({
        currentPassword: z.string(),
        newPassword: z
          .string()
          .min(8, 'Password must be at least 8 characters long.'),
        confirmPassword: z.string(),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords don't match.",
        path: ['confirmPassword'],
      }),
  }),
};
