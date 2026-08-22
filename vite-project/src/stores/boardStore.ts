import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types/task";

interface BoardState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  reorderTask: (
    taskId: number,
    newStatus: TaskStatus,
    newIndex: number,
  ) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

      setTasks: (tasks) => set({ tasks }),

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

      // handles both moving a task to a different column AND reordering it
      // inside the same column - both cases work the same way, we just
      // remove the task and put it back at the right spot
      reorderTask: (taskId, newStatus, newIndex) =>
        set((state) => {
          const draggedTask = state.tasks.find((t) => t.id === taskId);
          if (!draggedTask) return state;

          // take the dragged task out of the list first
          const withoutDragged = state.tasks.filter((t) => t.id !== taskId);

          // split remaining tasks: ones in the target column vs everything else
          const columnTasks = withoutDragged.filter(
            (t) => t.status === newStatus,
          );
          const otherTasks = withoutDragged.filter(
            (t) => t.status !== newStatus,
          );

          const updatedTask: Task = {
            ...draggedTask,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };

          // put the task back at the correct position in its column
          columnTasks.splice(newIndex, 0, updatedTask);

          return { tasks: [...otherTasks, ...columnTasks] };
        }),
    }),
    { name: "sprintdesk-board" },
  ),
);
