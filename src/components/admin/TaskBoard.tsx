import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { TaskColumns } from "./TaskColumns";
import { useTaskBoardOperations } from "@/hooks/use-task-board";
import { DragOverlay } from "@/components/tasks/DragOverlay";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const { handleDragEnd } = useTaskBoardOperations({
    items: tasks,
    onUpdate,
  });

  const handleDragEndWrapper = async (event: DragEndEvent) => {
    await handleDragEnd(event);
    console.log("TaskBoard: Drag ended, triggering update...");
    onUpdate();
  };

  return (
    <DndContext onDragEnd={handleDragEndWrapper}>
      <TaskColumns items={tasks} onUpdate={onUpdate} />
      <DragOverlay />
    </DndContext>
  );
}