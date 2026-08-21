export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: "task" | "review";
  read: boolean;
  createdAt: string;
}
