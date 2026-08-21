import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoggingIn, loginError } = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        login(
            { username, password },
            {
                onSuccess: () => navigate("/dashboard"),
            }
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm"
            >
                <h1 className="mb-4 text-xl font-semibold">Sign in to SprintDesk</h1>

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
                        <p className="text-sm text-red-600">Invalid username or password</p>
                    )}

                    <Button type="submit" isLoading={isLoggingIn} className="mt-2">
                        Login
                    </Button>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                    Test credentials: username <strong>emilys</strong>, password <strong>emilyspass</strong>
                </p>
            </form>
        </div>
    );
}