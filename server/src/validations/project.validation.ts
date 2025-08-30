import z from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const projectValidation = {
  createProjectSchema: z.object({
    body: z.object({
      name: z.string().trim().min(1, 'Project name cannot be empty'),
      color: z.string().regex(hexColorRegex, 'Invalid color format'),
      isFavorite: z.boolean().optional(),
    }),
  }),
  updateProjectSchema: z.object({
    body: z
      .object({
        name: z.string().trim().min(1, 'Project name cannot be empty'),
        color: z.string().regex(hexColorRegex, 'Invalid color format'),
        isFavorite: z.boolean(),
      })
      .partial(),
    params: z.object({
      id: z.cuid({ message: 'Invalid project ID' }),
    }),
  }),
  projectIdSchema: z.object({
    params: z.object({
      id: z.cuid({ message: 'Invalid project ID' }),
    }),
  }),
};
