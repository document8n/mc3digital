import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectHeader } from "@/components/project-details/ProjectHeader";
import { ProjectTasks } from "@/components/project-details/ProjectTasks";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <ProjectHeader project={project} />
          <ProjectTasks projectId={project.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}