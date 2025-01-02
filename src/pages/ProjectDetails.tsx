import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "@/components/AdminMenu";
import { ProjectHeader } from "@/components/project-details/ProjectHeader";
import { ProjectTasks } from "@/components/project-details/ProjectTasks";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, PencilIcon } from "lucide-react";
import { ProjectFormModal } from "@/components/project/ProjectFormModal";
import { useProject } from "@/hooks/use-project";
import { useProjectTasks } from "@/hooks/use-project-tasks";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { project, fetchProject } = useProject(id);
  const { tasks, fetchTasks } = useProjectTasks(id);

  useEffect(() => {
    if (id) {
      fetchProject().then(result => {
        if (!result) {
          navigate('/projects');
        }
      });
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
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end items-center mb-6 gap-4">
            <button 
              onClick={() => navigate('/projects')}
              className="mr-auto flex items-center text-white hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="admin-action-button"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Project
            </button>
          </div>
          
          <div className="space-y-6">
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