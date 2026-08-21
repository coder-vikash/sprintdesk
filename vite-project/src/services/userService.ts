import { loadMockData } from "./apiClient";
import type { User } from "../types/user";

export async function getUsers(): Promise<User[]> {
  const data = await loadMockData();
  return data.users;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}
