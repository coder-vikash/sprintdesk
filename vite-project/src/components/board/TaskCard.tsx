import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo } from "react";
import type { Task } from "../../types/task";

const priorityColor: Record<Task["priority"], string> = {
  low: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className="cursor-grab rounded-md border border-slate-200 bg-white p-3 text-sm shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-none"
    >
      <p className="font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={`rounded px-2 py-0.5 ${priorityColor[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-slate-400 dark:text-slate-500">{task.dueDate}</span>
      </div>
    </div>
  );
}

export default memo(TaskCard);