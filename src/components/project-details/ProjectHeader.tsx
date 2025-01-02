import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectMetadata } from "./ProjectMetadata";
import { ProjectNotes } from "./ProjectNotes";

interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  notes: string | null;
  url: string | null;
  image: string | null;
  is_active: boolean;
  is_portfolio: boolean;
  client_id: string | null;
}

interface ProjectHeaderProps {
  project: Project;
  hideEditButton?: boolean;
}

export function ProjectHeader({ project, hideEditButton }: ProjectHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["project", project.id] });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <ProjectMetadata
            startDate={project.start_date}
            status={project.status}
            isPortfolio={project.is_portfolio}
            isActive={project.is_active}
            url={project.url}
          />
        </div>

        {project.image && (
          <div className="flex-shrink-0">
            <div className="relative w-[200px] aspect-video rounded-lg overflow-hidden">
              <img
                src={project.image}
                alt="Project preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-2">
          {!hideEditButton && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Project
            </Button>
          )}
        </div>
        <ProjectNotes 
          projectId={project.id}
          initialContent={project.notes || ''}
        />
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <ProjectForm 
              initialData={project} 
              onSuccess={handleEditSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}