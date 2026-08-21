import { useState } from "react";
import type { Task, Comment } from "../../types/task";
import { useComments } from "../../hooks/useComments";
import { useUsers } from "../../hooks/useUsers";
import { useBoardStore } from "../../stores/boardStore";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface TaskDrawerProps {
    task: Task;
    onClose: () => void;
}

export default function TaskDrawer({ task, onClose }: TaskDrawerProps) {
    const { data: fetchedComments, isLoading: commentsLoading } = useComments(task.id);
    const { data: users } = useUsers();
    const deleteTask = useBoardStore((s) => s.deleteTask);
    const currentUser = useAuthStore((s) => s.user);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [localComments, setLocalComments] = useState<Comment[]>([]);

    const assignee = users?.find((u) => u.id === task.assigneeId);
    const allComments = [...(fetchedComments ?? []), ...localComments];

    function handleDelete() {
        deleteTask(task.id);
        setConfirmOpen(false);
        onClose();
    }

    function handleAddComment(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now(),
            taskId: task.id,
            authorId: currentUser?.id ?? 0,
            message: newComment.trim(),
            createdAt: new Date().toISOString(),
        };

        setLocalComments((prev) => [...prev, comment]);
        setNewComment("");
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
                    {!commentsLoading && allComments.length === 0 && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">No comments yet.</p>
                    )}

                    <div className="space-y-2">
                        {allComments.map((c) => {
                            const author = users?.find((u) => u.id === c.authorId);
                            return (
                                <div key={c.id} className="rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-800">
                                    <p className="font-medium text-slate-800 dark:text-white">
                                        {author?.name ?? currentUser?.username ?? "You"}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400">{c.message}</p>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
                        <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" variant="secondary">
                            Add
                        </Button>
                    </form>
                </div>
            </aside>

            <DeleteConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
        </div>
    );
}