/**
 * Types
 */
import type { Task, UpdateTaskPayload } from '@/types/task';

export const findTaskById = (tasks: Task[], id: string): Task | undefined => {
  for (const task of tasks) {
    if (task.id === id) return task;
    if (task.subtasks) {
      const found = findTaskById(task.subtasks, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const updateTaskInTree = (
  tasks: Task[],
  taskId: string,
  payload: UpdateTaskPayload,
): Task[] => {
  return tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        ...payload,
        dueDate: payload.dueDate
          ? payload.dueDate.toISOString()
          : payload.dueDate === null
            ? null
            : task.dueDate,
      };
    }

    if (task.subtasks && task.subtasks.length > 0) {
      const newSubtasks = updateTaskInTree(task.subtasks, taskId, payload);
      if (newSubtasks !== task.subtasks) {
        return { ...task, subtasks: newSubtasks };
      }
    }

    return task;
  });
};
