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
      content: z.string().trim().optional(),
    }),
  }),
  updateCommentSchema: z.object({
    params: z.object({
      taskId: z.cuid({ message: 'Invalid task ID' }),
      commentId: z.cuid({ message: 'Invalid comment ID' }),
    }),
    body: z.object({
      content: z.string().trim().optional(),
      fileUrl: z.null().optional(),
    }).refine((data) => data.content !== undefined || data.fileUrl !== undefined, {
      message: "Update payload cannot be empty."
    })
  }),
  deleteCommentSchema: z.object({
    params: z.object({
      taskId: z.cuid({ message: 'Invalid task ID' }),
      commentId: z.cuid({ message: 'Invalid comment ID' }),
    }),
  }),
};
