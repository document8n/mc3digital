import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
}

interface Project {
  id: string;
  name: string;
  client: string;
  start_date: string;
  status: string;
  team_size: number;
  budget: number;
  notes: string | null;
  url: string | null;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      console.log("Fetching project details for ID:", id);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

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

  const { data: tasks } = useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      console.log("Fetching tasks for project ID:", id);
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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-green-400" />
                  <span>Team Size: {project.team_size}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  <span>Budget: ${Number(project.budget).toLocaleString()}</span>
                </div>
              </div>
              {project.notes && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{project.notes}</p>
                </div>
              )}
              {project.url && (
                <div className="mt-4">
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Project URL →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Project Tasks</h2>
            {tasks?.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">No tasks found for this project.</p>
                </CardContent>
              </Card>
            ) : (
              tasks?.map((task) => (
                <Card key={task.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{task.title}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-muted">
                          {task.status}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      {task.due_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;