import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { TaskColumns } from "./TaskColumns";
import { useTaskBoardOperations } from "@/hooks/use-task-board";
import { DragOverlay } from "@/components/tasks/DragOverlay";
import { useState } from "react";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { handleDragEnd } = useTaskBoardOperations({
    items: tasks,
    onUpdate,
  });

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEndWrapper = async (event: DragEndEvent) => {
    setActiveTask(null);
    await handleDragEnd(event);
    console.log("TaskBoard: Drag ended, triggering update...");
    onUpdate();
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWrapper}
    >
      <TaskColumns items={tasks} onUpdate={onUpdate} />
      <DragOverlay activeTask={activeTask} />
    </DndContext>
  );
}