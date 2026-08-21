import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
    status: TaskStatus;
    title: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({ status, title, tasks, onTaskClick }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div
            ref={setNodeRef}
            className={`flex w-72 flex-shrink-0 flex-col rounded-lg p-3 ${isOver ? "bg-indigo-50" : "bg-slate-100"
                }`}
        >
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
                    {tasks.length}
                </span>
            </div>

            <div className="flex min-h-[100px] flex-col gap-2">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                ))}
            </div>
        </div>
    );
}