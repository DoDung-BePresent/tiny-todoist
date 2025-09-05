/**
 * Node modules
 */
import z from 'zod';

export const commentValidation = {
  getCommentsSchema: z.object({
    params: z.object({
      taskId: z.cuid({ message: 'Invalid task ID' }),
    }),
  }),
  createCommentSchema: z.object({
    params: z.object({
      taskId: z.cuid({ message: 'Invalid task ID' }),
    }),
    body: z.object({
      content: z.string().trim().min(1),
    }),
  }),
};
