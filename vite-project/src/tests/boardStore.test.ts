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

const sampleTask2: Task = {
  ...sampleTask,
  id: 998,
  title: "Second test task",
};

describe("boardStore", () => {
  beforeEach(() => {
    useBoardStore.setState({ tasks: [] });
  });

  it("adds a task", () => {
    useBoardStore.getState().addTask(sampleTask);
    expect(useBoardStore.getState().tasks).toHaveLength(1);
  });

  it("moves a task to a different column", () => {
    useBoardStore.getState().addTask(sampleTask);
    useBoardStore.getState().reorderTask(999, "in-progress", 0);

    const updatedTask = useBoardStore
      .getState()
      .tasks.find((t) => t.id === 999);
    expect(updatedTask?.status).toBe("in-progress");
  });

  it("reorders tasks within the same column", () => {
    useBoardStore.getState().addTask(sampleTask); // id 999, backlog
    useBoardStore.getState().addTask(sampleTask2); // id 998, backlog

    // move task 998 to index 0 (before task 999) inside the same "backlog" column
    useBoardStore.getState().reorderTask(998, "backlog", 0);

    const tasks = useBoardStore
      .getState()
      .tasks.filter((t) => t.status === "backlog");
    expect(tasks[0].id).toBe(998);
    expect(tasks[1].id).toBe(999);
  });

  it("deletes a task", () => {
    useBoardStore.getState().addTask(sampleTask);
    useBoardStore.getState().deleteTask(999);
    expect(useBoardStore.getState().tasks).toHaveLength(0);
  });

  it("updates task fields", () => {
    useBoardStore.getState().addTask(sampleTask);
    useBoardStore
      .getState()
      .updateTask(999, { title: "Updated title", priority: "high" });

    const updatedTask = useBoardStore
      .getState()
      .tasks.find((t) => t.id === 999);
    expect(updatedTask?.title).toBe("Updated title");
    expect(updatedTask?.priority).toBe("high");
  });
});
