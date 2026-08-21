import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../stores/authStore";

describe("auth store (interceptor dependency)", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
    localStorage.clear();
  });

  it("sets session and stores refresh token", () => {
    useAuthStore
      .getState()
      .setSession(
        { id: 1, username: "test", email: "a@a.com", image: "" },
        "access123",
        "refresh123",
      );

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe("access123");
    expect(localStorage.getItem("sprintdesk_refresh_token")).toBe("refresh123");
  });

  it("updates access token after refresh", () => {
    useAuthStore.getState().setAccessToken("newToken456");
    expect(useAuthStore.getState().accessToken).toBe("newToken456");
  });

  it("clears session on logout", () => {
    useAuthStore
      .getState()
      .setSession(
        { id: 1, username: "test", email: "a@a.com", image: "" },
        "access123",
        "refresh123",
      );

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("sprintdesk_refresh_token")).toBeNull();
  });
});
