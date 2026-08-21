import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../../types/task";

const priorityColor: Record<Task["priority"], string> = {
    low: "bg-slate-200 text-slate-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
};

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            opacity: isDragging ? 0.5 : 1,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className="cursor-grab rounded-md border bg-white p-3 text-sm shadow-sm hover:shadow-md"
        >
            <p className="font-medium">{task.title}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`rounded px-2 py-0.5 ${priorityColor[task.priority]}`}>
                    {task.priority}
                </span>
                <span className="text-slate-400">{task.dueDate}</span>
            </div>
        </div>
    );
}