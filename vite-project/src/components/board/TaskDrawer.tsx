import { useState } from "react";
import type { Task, Comment, TaskPriority } from "../../types/task";
import { useComments } from "../../hooks/useComments";
import { useUsers } from "../../hooks/useUsers";
import { useBoardStore } from "../../stores/boardStore";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface TaskDrawerProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDrawer({ task, onClose }: TaskDrawerProps) {
  const { data: fetchedComments, isLoading: commentsLoading } = useComments(task.id);
  const { data: users } = useUsers();
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const updateTask = useBoardStore((s) => s.updateTask);
  const currentUser = useAuthStore((s) => s.user);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  // edit mode state - when true we show input fields instead of plain text
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editAssigneeId, setEditAssigneeId] = useState(String(task.assigneeId));
  const [editDueDate, setEditDueDate] = useState(task.dueDate);

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

  function handleSaveEdit() {
    updateTask(task.id, {
      title: editTitle,
      priority: editPriority,
      assigneeId: Number(editAssigneeId),
      dueDate: editDueDate,
    });
    setIsEditing(false);
  }

  function handleCancelEdit() {
    // reset fields back to original values and exit edit mode
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditAssigneeId(String(task.assigneeId));
    setEditDueDate(task.dueDate);
    setIsEditing(false);
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
          <div className="flex gap-2">
            {!isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        {/* view mode vs edit mode */}
        {!isEditing ? (
          <>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{task.title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>

            <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><span className="font-medium text-slate-800 dark:text-white">Assignee:</span> {assignee?.name ?? "Unassigned"}</p>
              <p><span className="font-medium text-slate-800 dark:text-white">Priority:</span> {task.priority}</p>
              <p><span className="font-medium text-slate-800 dark:text-white">Status:</span> {task.status}</p>
              <p><span className="font-medium text-slate-800 dark:text-white">Due:</span> {task.dueDate}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Input
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <Select
              label="Priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
            />

            <Select
              label="Assignee"
              value={editAssigneeId}
              onChange={(e) => setEditAssigneeId(e.target.value)}
              options={users?.map((u) => ({ label: u.name, value: String(u.id) })) ?? []}
            />

            <Input
              label="Due Date"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />

            <div className="mt-2 flex gap-2">
              <Button onClick={handleSaveEdit}>Save</Button>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        )}

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