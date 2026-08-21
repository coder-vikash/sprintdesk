import type { Task } from "../types/task";
import type { Sprint } from "../types/sprint";

// tasks completed per sprint
export function getSprintVelocity(tasks: Task[], sprints: Sprint[]) {
  return sprints.map((sprint) => {
    const completedCount = tasks.filter(
      (t) => t.sprintId === sprint.id && t.status === "done",
    ).length;

    return { sprint: sprint.name, completed: completedCount };
  });
}

// task count per status column
export function getStatusDistribution(tasks: Task[]) {
  const statusLabels: Record<Task["status"], string> = {
    backlog: "Backlog",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  };

  return Object.entries(statusLabels).map(([status, label]) => ({
    name: label,
    value: tasks.filter((t) => t.status === status).length,
  }));
}

// priority breakdown per column
export function getPriorityBreakdown(tasks: Task[]) {
  const statuses: Task["status"][] = [
    "backlog",
    "in-progress",
    "review",
    "done",
  ];

  return statuses.map((status) => {
    const tasksInStatus = tasks.filter((t) => t.status === status);
    return {
      status,
      low: tasksInStatus.filter((t) => t.priority === "low").length,
      medium: tasksInStatus.filter((t) => t.priority === "medium").length,
      high: tasksInStatus.filter((t) => t.priority === "high").length,
    };
  });
}

// completion trend - tasks completed grouped by date
export function getCompletionTrend(tasks: Task[]) {
  const completed = tasks.filter((t) => t.completedAt);

  const grouped: Record<string, number> = {};
  completed.forEach((t) => {
    const date = t.completedAt!.split("T")[0]; // just the date part
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}
