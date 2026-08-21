import { useState } from "react";
import type { Task } from "../../types/task";
import { useComments } from "../../hooks/useComments";
import { useUsers } from "../../hooks/useUsers";
import { useBoardStore } from "../../stores/boardStore";
import Button from "../ui/Button";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface TaskDrawerProps {
    task: Task;
    onClose: () => void;
}

export default function TaskDrawer({ task, onClose }: TaskDrawerProps) {
    const { data: comments, isLoading: commentsLoading } = useComments(task.id);
    const { data: users } = useUsers();
    const deleteTask = useBoardStore((s) => s.deleteTask);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const assignee = users?.find((u) => u.id === task.assigneeId);

    function handleDelete() {
        deleteTask(task.id);
        setConfirmOpen(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
            <aside
                onClick={(e) => e.stopPropagation()}
                className="fixed right-0 top-0 h-full w-96 overflow-y-auto bg-white p-6 shadow-xl dark:bg-slate-900"
            >
                <div className="mb-4 flex items-center justify-between">
                    <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-white">
                        ✕ Close
                    </button>
                    <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                        Delete
                    </Button>
                </div>

                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{task.title}</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>

                <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <p><span className="font-medium text-slate-800 dark:text-white">Assignee:</span> {assignee?.name ?? "Unassigned"}</p>
                    <p><span className="font-medium text-slate-800 dark:text-white">Priority:</span> {task.priority}</p>
                    <p><span className="font-medium text-slate-800 dark:text-white">Status:</span> {task.status}</p>
                    <p><span className="font-medium text-slate-800 dark:text-white">Due:</span> {task.dueDate}</p>
                </div>

                <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-white">Comments</h3>

                    {commentsLoading && <p className="text-xs text-slate-400 dark:text-slate-500">Loading comments...</p>}
                    {!commentsLoading && comments?.length === 0 && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">No comments yet.</p>
                    )}

                    <div className="space-y-2">
                        {comments?.map((c) => {
                            const author = users?.find((u) => u.id === c.authorId);
                            return (
                                <div key={c.id} className="rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-800">
                                    <p className="font-medium text-slate-800 dark:text-white">{author?.name ?? "Unknown"}</p>
                                    <p className="text-slate-600 dark:text-slate-400">{c.message}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>

            <DeleteConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
        </div>
    );
}