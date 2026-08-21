import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useBoardStore } from "../../stores/boardStore";
import { useUsers } from "../../hooks/useUsers";
import type { TaskPriority } from "../../types/task";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
    const addTask = useBoardStore((s) => s.addTask);
    const tasks = useBoardStore((s) => s.tasks);
    const { data: users } = useUsers();

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [assigneeId, setAssigneeId] = useState("");
    const [dueDate, setDueDate] = useState("");

    function resetForm() {
        setTitle("");
        setPriority("medium");
        setAssigneeId("");
        setDueDate("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim() || !assigneeId) return;

        const newId = Math.max(...tasks.map((t) => t.id), 0) + 1;

        addTask({
            id: newId,
            title,
            description: "",
            status: "backlog",
            priority,
            assigneeId: Number(assigneeId),
            dueDate,
            sprintId: 3,
            order: tasks.filter((t) => t.status === "backlog").length + 1,
            createdAt: new Date().toISOString(),
            completedAt: null,
            updatedAt: new Date().toISOString(),
        });

        resetForm();
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Task">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                    label="Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <Select
                    label="Priority"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    options={[
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" },
                    ]}
                />

                <Select
                    label="Assignee"
                    id="assignee"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    options={[
                        { label: "Select assignee", value: "" },
                        ...(users?.map((u) => ({ label: u.name, value: String(u.id) })) ?? []),
                    ]}
                />

                <Input
                    label="Due Date"
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />

                <Button type="submit" className="mt-2">
                    Create Task
                </Button>
            </form>
        </Modal>
    );
}