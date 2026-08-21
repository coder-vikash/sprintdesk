const DUMMYJSON_URL = "https://dummyjson.com";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  image: string;
}

export async function loginRequest(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${DUMMYJSON_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  return res.json();
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("sprintdesk_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const res = await fetch(`${DUMMYJSON_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.accessToken;
}
