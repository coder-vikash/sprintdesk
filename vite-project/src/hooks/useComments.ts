import { useQuery } from "@tanstack/react-query";
import { getTaskComments } from "../services/taskService";

export function useComments(taskId: number | null) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getTaskComments(taskId as number),
    enabled: taskId !== null,
  });
}
