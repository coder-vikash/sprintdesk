import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getStatusDistribution } from "../../utils/analytics";
import type { Task } from "../../types/task";
import { useThemeStore } from "../../stores/themeStore";

const COLORS = ["#94a3b8", "#f59e0b", "#3b82f6", "#22c55e"];

export default function StatusChart({ tasks }: { tasks: Task[] }) {
    const data = getStatusDistribution(tasks);
    const isDark = useThemeStore((s) => s.theme === "dark");

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Task Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label={{ fill: isDark ? "#e2e8f0" : "#334155", fontSize: 12 }}
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? "#1e293b" : "#ffffff",
                            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                            borderRadius: "8px",
                            color: isDark ? "#f1f5f9" : "#0f172a",
                        }}
                    />
                    <Legend wrapperStyle={{ color: isDark ? "#cbd5e1" : "#475569", fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}