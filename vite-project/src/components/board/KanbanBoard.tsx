import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useBoardStore } from "../../stores/boardStore";
import { useTasks } from "../../hooks/useTasks";
import { BOARD_COLUMNS } from "../../utils/constants";
import type { Task, TaskStatus } from "../../types/task";
import KanbanColumn from "./KanbanColumn";
import TaskDrawer from "./TaskDrawer";
import AddTaskModal from "./AddTaskModal";
import Skeleton from "../ui/Skeleton";
import Button from "../ui/Button";

export default function KanbanBoard() {
    const { data: fetchedTasks, isLoading } = useTasks();
    const tasks = useBoardStore((s) => s.tasks);
    const setTasks = useBoardStore((s) => s.setTasks);
    const moveTask = useBoardStore((s) => s.moveTask);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // require a small drag distance before dnd-kit treats it as a drag
    // otherwise a plain click on the card gets swallowed and onClick never fires
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    useEffect(() => {
        if (fetchedTasks && tasks.length === 0) {
            setTasks(fetchedTasks);
        }
    }, [fetchedTasks, tasks.length, setTasks]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const taskId = Number(active.id);
        const newStatus = over.id as TaskStatus;

        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.status === newStatus) return;

        const tasksInNewColumn = tasks.filter((t) => t.status === newStatus);
        moveTask(taskId, newStatus, tasksInNewColumn.length + 1);
    }

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex gap-4">
                {BOARD_COLUMNS.map((col) => (
                    <div key={col.status} className="w-72 space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex justify-end">
                <Button onClick={() => setAddModalOpen(true)}>+ Add Task</Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {BOARD_COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.status}
                            status={col.status}
                            title={col.title}
                            tasks={tasks.filter((t) => t.status === col.status)}
                            onTaskClick={setSelectedTask}
                        />
                    ))}
                </div>
            </DndContext>

            {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}

            <AddTaskModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
        </>
    );
}