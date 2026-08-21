import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNotification } from "../types/notification";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NotificationState {
  notifications: AppNotification[];
  toasts: ToastItem[];

  setNotifications: (list: AppNotification[]) => void;
  addNotification: (item: AppNotification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  unreadCount: () => number;

  pushToast: (message: string, type?: ToastItem["type"]) => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      toasts: [],

      setNotifications: (list) => set({ notifications: list }),

      addNotification: (item) =>
        set((state) => ({ notifications: [item, ...state.notifications] })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      pushToast: (message, type = "info") =>
        set((state) => ({
          toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "sprintdesk-notifications",
      // toasts ko persist karne ki zaroorat nahi, wo temporary hote hain
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);
