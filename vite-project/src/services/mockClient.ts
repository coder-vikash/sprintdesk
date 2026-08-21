import type { Task, Comment } from "../types/task";
import type { User } from "../types/user";
import type { Sprint } from "../types/sprint";
import type { AppNotification } from "../types/notification";

interface MockData {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: AppNotification[];
}

let cachedData: MockData | null = null;

export async function loadMockData(): Promise<MockData> {
  if (cachedData) return cachedData;

  const res = await fetch("/mock-data.json");
  if (!res.ok) {
    throw new Error("could not load mock data");
  }

  const json = (await res.json()) as MockData;
  cachedData = json;
  return json; // json use karo, cachedData nahi - TS ko pata rehta hai ye null nahi hai
}
