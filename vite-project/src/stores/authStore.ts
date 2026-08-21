import { create } from "zustand";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  image: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;

  setSession: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
  ) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setCheckingSession: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isCheckingSession: true,

  setSession: (user, accessToken, refreshToken) => {
    localStorage.setItem("sprintdesk_refresh_token", refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  logout: () => {
    localStorage.removeItem("sprintdesk_refresh_token");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setCheckingSession: (value) => {
    set({ isCheckingSession: value });
  },
}));
