import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface NavItem {
    to: string;
    label: string;
    icon: ReactNode;
}

const links: NavItem[] = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6a2.25 2.25 0 0 1 2.25-2.25h4.5A2.25 2.25 0 0 1 12.75 6v4.5a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 3.75 10.5V6ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25h4.5A2.25 2.25 0 0 1 22.5 6v1.5a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 13.5 7.5V6ZM3.75 15.75a2.25 2.25 0 0 1 2.25-2.25h4.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-4.5a2.25 2.25 0 0 1-2.25-2.25v-1.5ZM13.5 13.5a2.25 2.25 0 0 1 2.25-2.25h4.5a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 13.5 18v-4.5Z" />
            </svg>
        ),
    },
    {
        to: "/board",
        label: "Sprint Board",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15M4.5 4.5h15A.75.75 0 0 1 20.25 5v14a.75.75 0 0 1-.75.75h-15A.75.75 0 0 1 3.75 19V5a.75.75 0 0 1 .75-.5Z" />
            </svg>
        ),
    },
    {
        to: "/analytics",
        label: "Analytics",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17V10m5 7V6m5 11v-4" />
            </svg>
        ),
    },
];

interface SidebarProps {
    onNavigate?: () => void;
    onClose?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
    return (
        <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 px-6 py-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
                    S
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-white">SprintDesk</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-3">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive
                                ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}>
                                    {link.icon}
                                </span>
                                {link.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400 dark:border-slate-800">
                SprintDesk v1.0
            </div>
        </aside>
    );
}