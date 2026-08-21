import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "../stores/notificationStore";

describe("useToast (via notificationStore)", () => {
  beforeEach(() => {
    useNotificationStore.setState({ toasts: [] });
  });

  it("pushes a success toast", () => {
    useNotificationStore.getState().pushToast("Task created", "success");
    const toasts = useNotificationStore.getState().toasts;

    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Task created");
    expect(toasts[0].type).toBe("success");
  });

  it("removes a toast by id", () => {
    useNotificationStore.getState().pushToast("Test", "info");
    const id = useNotificationStore.getState().toasts[0].id;

    useNotificationStore.getState().removeToast(id);
    expect(useNotificationStore.getState().toasts).toHaveLength(0);
  });
});
