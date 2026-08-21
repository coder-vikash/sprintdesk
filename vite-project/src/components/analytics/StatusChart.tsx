import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getStatusDistribution } from "../../utils/analytics";
import type { Task } from "../../types/task";

const COLORS = ["#94a3b8", "#f59e0b", "#3b82f6", "#22c55e"];

export default function StatusChart({ tasks }: { tasks: Task[] }) {
    const data = getStatusDistribution(tasks);

    return (
        <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}