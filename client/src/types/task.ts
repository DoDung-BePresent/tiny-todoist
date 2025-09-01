export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  priority: Priority;
  userId: string;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority?: Priority;
  projectId?: string | null;
};

export type UpdateTaskPayload = Partial<
  CreateTaskPayload & { completed: boolean }
>;
