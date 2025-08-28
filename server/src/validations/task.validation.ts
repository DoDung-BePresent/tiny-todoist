import { Priority } from '@prisma/client';
import z from 'zod';

export const taskValidation = {
  createTaskSchema: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty'),
    description: z.string().trim().optional(),
    dueDate: z.coerce.date().optional(), // convert string to Date
    priority: z.enum(Priority).optional(),
  }),
  updateTaskSchema: z
    .object({
      title: z.string().trim().min(1, 'Title cannot be empty'),
      description: z.string().trim().nullable(),
      completed: z.boolean(),
      dueDate: z.coerce.date().nullable(),
      priority: z.nativeEnum(Priority),
    })
    .partial(), // for update
  taskIdSchema: z.object({
    id: z.cuid({ message: 'Invalid task ID' }),
  }),
};
