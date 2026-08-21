import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { getPriorityBreakdown } from "../../utils/analytics";
import type { Task } from "../../types/task";
import { useThemeStore } from "../../stores/themeStore";

export default function PriorityChart({ tasks }: { tasks: Task[] }) {
    const data = getPriorityBreakdown(tasks);
    const isDark = useThemeStore((s) => s.theme === "dark");

    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const textColor = isDark ? "#94a3b8" : "#64748b";

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Priority Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="status" fontSize={12} stroke={textColor} tick={{ fill: textColor }} />
                    <YAxis allowDecimals={false} fontSize={12} stroke={textColor} tick={{ fill: textColor }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? "#1e293b" : "#ffffff",
                            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                            borderRadius: "8px",
                            color: isDark ? "#f1f5f9" : "#0f172a",
                        }}
                    />
                    <Legend wrapperStyle={{ color: isDark ? "#cbd5e1" : "#475569", fontSize: 12 }} />
                    <Bar dataKey="low" stackId="a" fill="#94a3b8" />
                    <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="high" stackId="a" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}