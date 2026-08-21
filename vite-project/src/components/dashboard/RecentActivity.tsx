import { Link } from "react-router-dom";
import type { Task } from "../../types/task";

const statusStyles: Record<Task["status"], string> = {
    backlog: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    review: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    done: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
};

function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
}

export default function RecentActivity({ tasks }: { tasks: Task[] }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Recent Activity
                </h3>
                <Link to="/board" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                    View board →
                </Link>
            </div>

            {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500">No activity yet.</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                                    {task.title}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    {timeAgo(task.updatedAt)}
                                </p>
                            </div>
                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusStyles[task.status]}`}
                            >
                                {task.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}