import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { refreshAccessToken } from "./authService";

// ---- existing mock data loader (as-is) ----
let cachedData: any = null;

export async function loadMockData() {
  if (cachedData) return cachedData;

  const res = await fetch("/mock-data.json");
  if (!res.ok) {
    throw new Error("could not load mock data");
  }

  cachedData = await res.json();
  return cachedData;
}

// ---- axios instance for authenticated calls ----
export const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
});

// attach access token on every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if a request fails with 401, refresh the token once and retry it
let isRefreshing = false;
let pendingQueue: (() => void)[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(apiClient(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        useAuthStore.getState().setAccessToken(newToken);

        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];

        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
