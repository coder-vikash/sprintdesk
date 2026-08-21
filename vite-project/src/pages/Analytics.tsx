import { useBoardStore } from "../stores/boardStore";
import { useSprints } from "../hooks/useSprints";
import VelocityChart from "../components/analytics/VelocityChart";
import StatusChart from "../components/analytics/StatusChart";
import PriorityChart from "../components/analytics/PriorityChart";
import CompletionChart from "../components/analytics/CompletionChart";
import Skeleton from "../components/ui/Skeleton";

export default function Analytics() {
    const tasks = useBoardStore((s) => s.tasks);
    const { data: sprints, isLoading } = useSprints();

    if (isLoading || !sprints) {
        return <Skeleton className="h-64 w-full" />;
    }

    return (
        <div>
            <h1 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">Analytics</h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VelocityChart tasks={tasks} sprints={sprints} />
                <StatusChart tasks={tasks} />
                <PriorityChart tasks={tasks} />
                <CompletionChart tasks={tasks} />
            </div>
        </div>
    );
}