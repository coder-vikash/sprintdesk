import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const logout = useAuthStore((s) => s.logout);

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginRequest(username, password),
    onSuccess: (data) => {
      setSession(
        { id: data.id, username: data.username, email: data.email, image: data.image },
        data.accessToken,
        data.refreshToken
      );
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
}