import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { useQueryClient } from "@tanstack/react-query";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import debounce from 'lodash/debounce';

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
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: project.notes || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[3em] max-h-[12em] overflow-y-auto w-full',
      },
    },
    onUpdate: debounce(async ({ editor }) => {
      try {
        console.log('Saving notes to database...');
        const { error } = await supabase
          .from('projects')
          .update({ notes: editor.getHTML() })
          .eq('id', project.id);

        if (error) throw error;

        console.log('Notes saved successfully');
        queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      } catch (error: any) {
        console.error('Error updating notes:', error);
        toast({
          title: "Error",
          description: "Failed to save notes",
          variant: "destructive",
        });
      }
    }, 1000),
  });

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
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <div className="flex flex-wrap gap-2 items-center mb-4">
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

          {/* Project URL */}
          {project.url && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Project URL</p>
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
        </div>

        {/* Project Image */}
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

      {/* Notes Editor */}
      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Notes</p>
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
        <div className="border rounded-lg p-4 bg-white">
          <EditorContent editor={editor} />
        </div>
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