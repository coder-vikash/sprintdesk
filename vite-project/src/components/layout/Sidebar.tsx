import { NavLink } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, BarChart3, X } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const links: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/board", label: "Sprint Board", icon: KanbanSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

interface SidebarProps {
  onNavigate?: () => void;
  onClose?: () => void;
}

export default function Sidebar({ onNavigate, onClose }: SidebarProps) {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white lg:w-64 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between px-5 py-5 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
            S
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white">SprintDesk</span>
        </div>

        {/* close button - only shown when Layout passes onClose (mobile overlay mode) */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
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
                <link.icon
                  className={`h-5 w-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                    }`}
                />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        SprintDesk v1.0
      </div>
    </aside>
  );
}