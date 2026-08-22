import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../services/apiClient";
import { useAuthStore } from "../stores/authStore";

// mock the refresh call so we control exactly what it returns
vi.mock("../services/authService", () => ({
  refreshAccessToken: vi.fn(),
}));

import { refreshAccessToken } from "../services/authService";

describe("apiClient auth interceptor", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
    useAuthStore.setState({
      user: null,
      accessToken: "old-token",
      isAuthenticated: true,
    });
    vi.clearAllMocks();
  });

  it("retries the original request after a successful token refresh", async () => {
   
    mock
      .onGet("/some-endpoint")
      .replyOnce(401)
      .onGet("/some-endpoint")
      .reply(200, { data: "success" });

    (refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue("new-token");

    const response = await apiClient.get("/some-endpoint");

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(response.data).toEqual({ data: "success" });
    expect(useAuthStore.getState().accessToken).toBe("new-token");
  });

  it("logs the user out if refresh also fails", async () => {
    mock.onGet("/some-endpoint").reply(401);

    (refreshAccessToken as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("refresh token expired")
    );

    await expect(apiClient.get("/some-endpoint")).rejects.toThrow();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});