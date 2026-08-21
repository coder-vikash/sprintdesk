import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { getPriorityBreakdown } from "../../utils/analytics";
import type { Task } from "../../types/task";

export default function PriorityChart({ tasks }: { tasks: Task[] }) {
    const data = getPriorityBreakdown(tasks);

    return (
        <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Priority Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="low" stackId="a" fill="#94a3b8" />
                    <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="high" stackId="a" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}