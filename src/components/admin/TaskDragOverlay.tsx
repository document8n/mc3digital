import { DragOverlay } from "@dnd-kit/core";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Task } from "@/types/task";
import { createPortal } from "react-dom";

interface TaskDragOverlayProps {
  activeTask: Task | null;
  onUpdate: () => void;
}

export function TaskDragOverlay({ activeTask, onUpdate }: TaskDragOverlayProps) {
  return createPortal(
    <DragOverlay>
      {activeTask ? (
        <TaskCard
          task={activeTask}
          onUpdate={onUpdate}
          showProject={true}
        />
      ) : null}
    </DragOverlay>,
    document.body
  );
}