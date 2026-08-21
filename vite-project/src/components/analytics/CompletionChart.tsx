import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getCompletionTrend } from "../../utils/analytics";
import type { Task } from "../../types/task";

export default function CompletionChart({ tasks }: { tasks: Task[] }) {
    const data = getCompletionTrend(tasks);

    return (
        <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Completion Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}