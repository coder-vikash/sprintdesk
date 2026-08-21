import { NavLink } from "react-router-dom";

const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/board", label: "Sprint Board" },
    { to: "/analytics", label: "Analytics" },
];

export default function Sidebar() {
    return (
        <aside className="w-56 border-r bg-white p-4">
            <div className="mb-6 px-2 text-lg font-bold text-indigo-600">SprintDesk</div>
            <nav className="flex flex-col gap-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `rounded-md px-3 py-2 text-sm ${isActive
                                ? "bg-indigo-50 font-medium text-indigo-700"
                                : "text-slate-600 hover:bg-slate-100"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}