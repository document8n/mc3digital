import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { useQueryClient } from "@tanstack/react-query";

interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  team_size: number;
  budget: number;
  notes: string | null;
  url: string | null;
  image: string | null;
  is_active: boolean;
  is_portfolio: boolean;
  client_id: string | null;
}

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "On Hold":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["project", project.id] });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <div className="flex gap-2 items-center mb-2">
            <Badge variant="secondary">
              Start Date: {format(new Date(project.start_date), "PPP")}
            </Badge>
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            {project.is_portfolio && (
              <Badge variant="outline">Portfolio Project</Badge>
            )}
            {!project.is_active && (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>Edit Project</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-600">Team Size</p>
          <p className="font-medium">{project.team_size} members</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Budget</p>
          <p className="font-medium">${project.budget.toLocaleString()}</p>
        </div>
        {project.url && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Project URL</p>
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {project.url}
            </a>
          </div>
        )}
        {project.notes && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Notes</p>
            <p className="whitespace-pre-wrap">{project.notes}</p>
          </div>
        )}
        {project.image && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600 mb-2">Project Image</p>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={project.image}
                alt="Project preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
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