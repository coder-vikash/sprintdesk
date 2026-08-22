import { useCallback, useEffect, useState } from "react";
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
  const reorderTask = useBoardStore((s) => s.reorderTask);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

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


  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = Number(active.id);
      const overId = String(over.id);

      // dropped on the empty area of a column (id looks like "col-backlog")
      if (overId.startsWith("col-")) {
        const newStatus = overId.replace("col-", "") as TaskStatus;
        const columnTasks = tasks.filter((t) => t.status === newStatus && t.id !== taskId);
        reorderTask(taskId, newStatus, columnTasks.length);
        return;
      }

      // dropped on top of another task card
      const overTask = tasks.find((t) => t.id === Number(over.id));
      if (!overTask) return;

      const newStatus = overTask.status;
      const columnTasks = tasks.filter((t) => t.status === newStatus && t.id !== taskId);
      const newIndex = columnTasks.findIndex((t) => t.id === overTask.id);

      reorderTask(taskId, newStatus, newIndex);
    },
    [tasks, reorderTask]
  );

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {BOARD_COLUMNS.map((col) => (
          <div
            key={col.status}
            className="w-72 flex-shrink-0 space-y-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-900"
          >
            <Skeleton className="h-5 w-24" />
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