/**
 * Node modules
 */
import { create } from 'zustand';

type DialogStore = {
  viewingTaskId: string | null;
  setViewTask: (taskId: string | null) => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  viewingTaskId: null,
  setViewTask: (taskId) => set({ viewingTaskId: taskId }),
}));
