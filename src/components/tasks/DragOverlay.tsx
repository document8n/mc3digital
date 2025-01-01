import { DragOverlay as DndDragOverlay } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types/task";

interface DragOverlayProps {
  activeTask: Task | null;
}

export function DragOverlay({ activeTask }: DragOverlayProps) {
  if (!activeTask) return null;
  
  return (
    <DndDragOverlay>
      <div className="transform-none">
        <TaskCard
          task={activeTask}
          onUpdate={() => {}}
          isDragging
        />
      </div>
    </DndDragOverlay>
  );
}