import { loadMockData } from "./mockClient";
import type { Sprint } from "../types/sprint";

export async function getSprints(): Promise<Sprint[]> {
  const data = await loadMockData();
  return data.sprints;
}
