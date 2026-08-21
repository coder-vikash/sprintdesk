import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types/task";

interface BoardState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: number, newStatus: TaskStatus, newOrder: number) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

      setTasks: (tasks) => set({ tasks }),

      moveTask: (taskId, newStatus, newOrder) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  order: newOrder,
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t,
          ),
        })),
    }),
    { name: "sprintdesk-board" },
  ),
);
