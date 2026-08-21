import { Link } from "react-router-dom";
import { useBoardStore } from "../stores/boardStore";
import { useSprints } from "../hooks/useSprints";
import { useAuthStore } from "../stores/authStore";
import {
    getActiveSprint,
    getTaskCounts,
    getSprintProgress,
    getRecentlyUpdatedTasks,
} from "../utils/dashboard";
import StatCard from "../components/dashboard/StatCard";
import SprintProgress from "../components/dashboard/SprintProgress";
import RecentActivity from "../components/dashboard/RecentActivity";
import Skeleton from "../components/ui/Skeleton";

export default function Dashboard() {
    const tasks = useBoardStore((s) => s.tasks);
    const { data: sprints, isLoading } = useSprints();
    const user = useAuthStore((s) => s.user);

    if (isLoading || !sprints) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    const counts = getTaskCounts(tasks);
    const activeSprint = getActiveSprint(sprints);
    const progress = activeSprint ? getSprintProgress(tasks, activeSprint.id) : 0;
    const recentTasks = getRecentlyUpdatedTasks(tasks);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Welcome back{user?.username ? `, ${user.username}` : ""}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Here's what's happening with your sprint.
                    </p>
                </div>
                <Link
                    to="/board"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Go to Board
                </Link>
            </div>

            {/* stat cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Total Tasks"
                    value={counts.total}
                    accentClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15M4.5 4.5h15A.75.75 0 0 1 20.25 5v14a.75.75 0 0 1-.75.75h-15A.75.75 0 0 1 3.75 19V5a.75.75 0 0 1 .75-.5Z" />
                        </svg>
                    }
                />
                <StatCard
                    label="In Progress"
                    value={counts.inProgress}
                    accentClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
                        </svg>
                    }
                />
                <StatCard
                    label="Completed"
                    value={counts.done}
                    accentClass="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    }
                />
                <StatCard
                    label="Overdue"
                    value={counts.overdue}
                    accentClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    }
                />
            </div>

            {/* sprint progress + recent activity */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SprintProgress sprint={activeSprint} progress={progress} />
                <RecentActivity tasks={recentTasks} />
            </div>
        </div>
    );
}