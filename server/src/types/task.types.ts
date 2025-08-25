import { Priority } from '@prisma/client';

export type CreateTaskPayload = {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: Priority;
};

export type UpdateTaskPayload = Partial<{
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: Date | null;
  priority: Priority;
}>;
