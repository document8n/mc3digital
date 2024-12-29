import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "@/components/AdminMenu";
import { ProjectHeader } from "@/components/project-details/ProjectHeader";
import { ProjectTasks } from "@/components/project-details/ProjectTasks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";

export default function ProjectDetails() {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const fetchProject = async () => {
    try {
      // Validate that we have a valid UUID before making the request
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        console.error('Invalid project ID:', id);
        toast({
          title: "Error",
          description: "Invalid project ID",
          variant: "destructive",
        });
        navigate('/projects');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive",
        });
        navigate('/projects');
        return;
      }

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
      // Only fetch tasks if we have a valid project ID
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return;
      }

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
    } else {
      navigate('/projects');
    }
  }, [id]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchProject();
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={`${isMobile ? 'pt-20' : 'pl-64'}`}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/projects')}
              className="flex items-center text-white hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Edit Project
            </button>
          </div>
          
          <div className="space-y-6 bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <ProjectHeader project={project} hideEditButton />
            <ProjectTasks 
              projectId={project.id} 
              tasks={tasks}
              refetchTasks={fetchTasks}
            />
          </div>
        </div>
      </div>

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}