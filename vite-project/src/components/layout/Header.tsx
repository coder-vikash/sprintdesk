import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import NotificationBell from "../notifications/NotificationBell";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
            <div />
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="text-sm text-slate-500 hover:text-slate-800"
                >
                    {theme === "light" ? "🌙" : "☀️"}
                </button>

                <NotificationBell />

                {user && <span className="text-sm text-slate-600">{user.username}</span>}

                <Button variant="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </header>
    );
}