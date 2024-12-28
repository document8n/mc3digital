import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
  onSuccess?: () => void;
}

export function ProjectFormModal({ isOpen, onClose, project, onSuccess }: ProjectFormModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create Project'}</DialogTitle>
        </DialogHeader>
        <ProjectForm 
          initialData={project} 
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}