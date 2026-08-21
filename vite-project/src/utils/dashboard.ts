import type { Task } from "../types/task";
import type { Sprint } from "../types/sprint";

export function getActiveSprint(sprints: Sprint[]): Sprint | undefined {
  const today = new Date();
  return sprints.find(
    (s) => new Date(s.startDate) <= today && today <= new Date(s.endDate),
  );
}

export function getTaskCounts(tasks: Task[]) {
  return {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter(
      (t) => t.status !== "done" && new Date(t.dueDate) < new Date(),
    ).length,
  };
}

export function getSprintProgress(tasks: Task[], sprintId: number): number {
  const sprintTasks = tasks.filter((t) => t.sprintId === sprintId);
  if (sprintTasks.length === 0) return 0;

  const doneCount = sprintTasks.filter((t) => t.status === "done").length;
  return Math.round((doneCount / sprintTasks.length) * 100);
}

export function getRecentlyUpdatedTasks(tasks: Task[], limit = 5): Task[] {
  return [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}
