import type { TaskStatus } from "../types/task";

export const BOARD_COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "backlog", title: "Backlog" },
  { status: "in-progress", title: "In Progress" },
  { status: "review", title: "Review" },
  { status: "done", title: "Done" },
];
