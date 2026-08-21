import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getSprintVelocity } from "../../utils/analytics";
import type { Task } from "../../types/task";
import type { Sprint } from "../../types/sprint";
import { useThemeStore } from "../../stores/themeStore";

interface VelocityChartProps {
    tasks: Task[];
    sprints: Sprint[];
}

export default function VelocityChart({ tasks, sprints }: VelocityChartProps) {
    const data = getSprintVelocity(tasks, sprints);
    const isDark = useThemeStore((s) => s.theme === "dark");

    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const textColor = isDark ? "#94a3b8" : "#64748b";

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sprint Velocity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="sprint" fontSize={12} stroke={textColor} tick={{ fill: textColor }} />
                    <YAxis allowDecimals={false} fontSize={12} stroke={textColor} tick={{ fill: textColor }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? "#1e293b" : "#ffffff",
                            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                            borderRadius: "8px",
                            color: isDark ? "#f1f5f9" : "#0f172a",
                        }}
                    />
                    <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}