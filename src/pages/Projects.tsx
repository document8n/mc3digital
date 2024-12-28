import { useState, useEffect } from "react";
import AdminMenu from "@/components/AdminMenu";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { ProjectDetailsModal } from "@/components/project/ProjectDetailsModal";
import { ProjectStats } from "@/components/project/ProjectStats";
import { ProjectCard } from "@/components/project/ProjectCard";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  team_size: number;
  budget: number;
  is_active: boolean;
  is_portfolio: boolean;
  display_order: number;
  user_id: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('display_order', { ascending: true });

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
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    try {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Prepare updates with all required fields
      const updates = newProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
        // Include required fields from the original project
        start_date: project.start_date,
        status: project.status,
        user_id: project.user_id,
      }));

      const { error } = await supabase
        .from('projects')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project order updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating project order:', error);
      toast({
        title: "Error",
        description: "Failed to update project order",
        variant: "destructive",
      });
      // Revert the local state on error
      fetchProjects();
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

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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