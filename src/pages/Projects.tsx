import { useState, useEffect } from "react";
import AdminMenu from "@/components/AdminMenu";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { ProjectDetailsModal } from "@/components/project/ProjectDetailsModal";
import { ProjectStats } from "@/components/project/ProjectStats";
import { ProjectCard } from "@/components/project/ProjectCard";

interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  team_size: number;
  budget: number;
  is_active: boolean;
  is_portfolio: boolean;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProjects();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const handleFormClose = () => {
    setSelectedProject(null);
    setIsFormOpen(false);
  };

  const handleDetailsClose = () => {
    setSelectedProject(null);
    setIsDetailsOpen(false);
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => project.is_active).length;
  const portfolioProjects = projects.filter(project => project.is_portfolio).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={`${isMobile ? 'pt-20' : 'pl-64'}`}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <button 
              className="admin-action-button"
              onClick={() => setIsFormOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </button>
          </div>

          <ProjectStats
            totalProjects={totalProjects}
            activeProjects={activeProjects}
            portfolioProjects={portfolioProjects}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>
      </div>

      <ProjectFormModal 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        project={selectedProject}
        onSuccess={fetchProjects}
      />

      {selectedProject && (
        <ProjectDetailsModal
          isOpen={isDetailsOpen}
          onClose={handleDetailsClose}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default Projects;
