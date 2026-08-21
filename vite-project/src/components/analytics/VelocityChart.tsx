import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getSprintVelocity } from "../../utils/analytics";
import type { Task } from "../../types/task";
import type { Sprint } from "../../types/sprint";

interface VelocityChartProps {
    tasks: Task[];
    sprints: Sprint[];
}

export default function VelocityChart({ tasks, sprints }: VelocityChartProps) {
    const data = getSprintVelocity(tasks, sprints);

    return (
        <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Sprint Velocity</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sprint" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}