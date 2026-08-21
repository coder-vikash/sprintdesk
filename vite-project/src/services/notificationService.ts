import { loadMockData } from "./apiClient";
import type { AppNotification } from "../types/notification";

const JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com";

export async function getInitialNotifications(): Promise<AppNotification[]> {
  const data = await loadMockData();
  return data.notifications;
}

export async function pollLatestPosts() {
  const res = await fetch(`${JSONPLACEHOLDER_URL}/posts?_limit=5`);
  if (!res.ok) throw new Error("polling request failed");
  return res.json() as Promise<{ id: number; title: string; body: string }[]>;
}
