import { DragOverlay as DndDragOverlay } from "@dnd-kit/core";
import { ProjectCard } from "./ProjectCard";
import { Project } from "@/types/project";

interface DragOverlayProps {
  activeProject: Project | null;
}

export function DragOverlay({ activeProject }: DragOverlayProps) {
  if (!activeProject) return null;
  
  return (
    <DndDragOverlay>
      <div className="transform-none">
        <ProjectCard
          project={activeProject}
          onClick={() => {}}
          isDragging
        />
      </div>
    </DndDragOverlay>
  );
}