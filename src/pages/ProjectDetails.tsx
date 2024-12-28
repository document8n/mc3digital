import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminMenu from "@/components/AdminMenu";
import { useToast } from "@/hooks/use-toast";
import { ProjectHeader } from "@/components/project-details/ProjectHeader";
import { ProjectTasks } from "@/components/project-details/ProjectTasks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
        throw error;
      }

      return data as Project;
    },
  });

  const { 
    data: tasks, 
    isLoading: tasksLoading,
    refetch: refetchTasks 
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load project tasks",
          variant: "destructive",
        });
        throw error;
      }

      return data as Task[];
    },
  });

  if (projectLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <AdminMenu />
        <div className={cn(
          "transition-all duration-300",
          isMobile ? "pt-16" : "pl-64"
        )}>
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <AdminMenu />
        <div className={cn(
          "transition-all duration-300",
          isMobile ? "pt-16" : "pl-64"
        )}>
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="text-white">Project not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pt-16" : "pl-64"
      )}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <ProjectHeader project={project} />
          <ProjectTasks 
            projectId={id!} 
            tasks={tasks || []} 
            refetchTasks={refetchTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;