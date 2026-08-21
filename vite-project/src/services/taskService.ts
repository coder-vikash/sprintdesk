import { loadMockData } from "./apiClient";
import type { Task, Comment } from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const data = await loadMockData();
  return data.tasks.slice(0, 30);
}

export async function getTaskComments(taskId: number): Promise<Comment[]> {
  const data = await loadMockData();
  return data.comments.filter((c: Comment) => c.taskId === taskId);
}
