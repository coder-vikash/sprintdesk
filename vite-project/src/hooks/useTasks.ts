import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../services/taskService";

// server-state layer - loads the initial 30 tasks
// after this, all board interactions (move/add/delete) are handled by boardStore
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}
