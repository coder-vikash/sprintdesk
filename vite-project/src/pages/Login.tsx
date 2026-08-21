import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoggingIn, loginError } = useAuth();
    const navigate = useNavigate();

    // agar user pehle se login hai, use login page dikhane ki zaroorat nahi
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        login(
            { username, password },
            { onSuccess: () => navigate("/dashboard") }
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
                <h1 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                    Sign in to SprintDesk
                </h1>

                <div className="flex flex-col gap-3">
                    <Input
                        label="Username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {loginError && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {loginError instanceof Error ? loginError.message : "Invalid username or password"}
                        </p>
                    )}

                    <Button type="submit" isLoading={isLoggingIn} className="mt-2">
                        Login
                    </Button>
                </div>

                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    Test credentials: username <strong>emilys</strong>, password <strong>emilyspass</strong>
                </p>
            </form>
        </div>
    );
}