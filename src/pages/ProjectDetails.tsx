import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "@/components/AdminMenu";
import { ProjectHeader } from "@/components/project-details/ProjectHeader";
import { ProjectTasks } from "@/components/project-details/ProjectTasks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetails() {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
      navigate('/projects');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchTasks();
    }
  }, [id]);

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={`${isMobile ? 'pt-20' : 'pl-64'}`}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center text-white hover:text-gray-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
          
          <div className="space-y-6 bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <ProjectHeader project={project} />
            <ProjectTasks 
              projectId={project.id} 
              tasks={tasks}
              refetchTasks={fetchTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}