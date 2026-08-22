import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";
import NotificationBell from "../notifications/NotificationBell";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
            {/* mobile hamburger */}
            <button
                onClick={onMenuClick}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* keeps right-side controls pinned right on desktop where there's no hamburger */}
            <div className="hidden md:block" />

            <div className="flex items-center gap-1 sm:gap-3">
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                <NotificationBell />

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                            {user?.username?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <span className="hidden text-sm text-slate-600 sm:inline dark:text-slate-300">
                            {user?.username}
                        </span>
                    </button>

                    {menuOpen && (
                        <div
                            onMouseLeave={() => setMenuOpen(false)}
                            className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                        >
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}