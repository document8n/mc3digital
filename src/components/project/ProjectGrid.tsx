import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { DragOverlay } from "./DragOverlay";
import { createPortal } from "react-dom";

interface ProjectGridProps {
  projects: Project[];
  activeId: string | null;
  activeProject: Project | null;
  onProjectClick: (project: Project) => void;
}

export function ProjectGrid({ projects, activeId, activeProject, onProjectClick }: ProjectGridProps) {
  return (
    <>
      <SortableContext items={projects.map(p => p.id)} strategy={horizontalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick(project)}
              isDragging={activeId === project.id}
            />
          ))}
        </div>
      </SortableContext>
      {createPortal(
        <DragOverlay activeProject={activeProject} />,
        document.body
      )}
    </>
  );
}