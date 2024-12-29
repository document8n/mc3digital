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
  due_date?: string;
  status: string;
  team_size?: number;
  notes: string | null;
  url: string | null;
  image: string | null;
  is_active: boolean;
  is_portfolio: boolean;
  client_id: string | null;
  display_order: number;
  team_members: string | null;
  created_at?: string;
  updated_at?: string;
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
          <div className="flex gap-2 items-center mb-2 flex-wrap">
            <Badge variant="secondary">
              Start Date: {format(new Date(project.start_date), "PPP")}
            </Badge>
            {project.due_date && (
              <Badge variant="secondary">
                Due Date: {format(new Date(project.due_date), "PPP")}
              </Badge>
            )}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Column 1 - Project Details */}
        <div className="space-y-4">
          {project.team_members && (
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="font-medium">{project.team_members}</p>
            </div>
          )}
          {project.url && (
            <div>
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
          <div>
            <p className="text-sm text-gray-600">Display Order</p>
            <p className="font-medium">{project.display_order}</p>
          </div>
        </div>

        {/* Column 2 - Additional Info */}
        <div className="space-y-4">
          {project.notes && (
            <div>
              <p className="text-sm text-gray-600">Notes</p>
              <p className="whitespace-pre-wrap">{project.notes}</p>
            </div>
          )}
          {project.created_at && (
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-medium">{format(new Date(project.created_at), "PPP")}</p>
            </div>
          )}
          {project.updated_at && (
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">{format(new Date(project.updated_at), "PPP")}</p>
            </div>
          )}
        </div>

        {/* Column 3 - Project Image */}
        {project.image && (
          <div>
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