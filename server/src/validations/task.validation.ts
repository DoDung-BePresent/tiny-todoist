import { Priority } from '@prisma/client';
import z from 'zod';

export const taskValidation = {
  createTaskSchema: z.object({
    body: z.object({
      title: z.string().trim().min(1, 'Title cannot be empty'),
      description: z.string().trim().optional(),
      dueDate: z.coerce.date().optional(), // convert string to Date
      priority: z.enum(Priority).optional(),
      projectId: z.cuid().optional(),
    }),
  }),
  updateTaskSchema: z.object({
    body: z
      .object({
        title: z.string().trim().min(1, 'Title cannot be empty'),
        description: z.string().trim().nullable(),
        completed: z.boolean(),
        dueDate: z.coerce.date().nullable(),
        priority: z.enum(Priority),
        projectId: z.cuid().nullable(), // Allow null to move task back to Inbox
      })
      .partial(),
    params: z.object({
      id: z.cuid({ message: 'Invalid task ID' }),
    }),
  }),
  taskIdSchema: z.object({
    params: z.object({
      id: z.cuid({ message: 'Invalid task ID' }),
    }),
  }),
};
