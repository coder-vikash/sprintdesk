import { describe, it, expect, beforeEach } from "vitest";
import { useBoardStore } from "../stores/boardStore";
import type { Task } from "../types/task";

const sampleTask: Task = {
  id: 999,
  title: "Test task",
  description: "",
  status: "backlog",
  priority: "low",
  assigneeId: 1,
  dueDate: "2026-09-01",
  sprintId: 3,
  order: 1,
  createdAt: "2026-08-20T00:00:00Z",
  completedAt: null,
  updatedAt: "2026-08-20T00:00:00Z",
};

describe("boardStore", () => {
  beforeEach(() => {
    useBoardStore.setState({ tasks: [] });
  });

  it("adds a task", () => {
    useBoardStore.getState().addTask(sampleTask);
    expect(useBoardStore.getState().tasks).toHaveLength(1);
  });

  it("moves a task to a new status", () => {
    useBoardStore.getState().addTask(sampleTask);
    useBoardStore.getState().moveTask(999, "in-progress", 1);
    expect(useBoardStore.getState().tasks[0].status).toBe("in-progress");
  });

  it("deletes a task", () => {
    useBoardStore.getState().addTask(sampleTask);
    useBoardStore.getState().deleteTask(999);
    expect(useBoardStore.getState().tasks).toHaveLength(0);
  });
});
