import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectForm } from "@/components/ProjectForm";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) {
          toast({
            title: "Error",
            description: "Project not found",
            variant: "destructive",
          });
          navigate("/projects");
          return;
        }

        setProject(data);
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load project",
          variant: "destructive",
        });
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <AdminMenu />
        <div className={cn(
          "transition-all duration-300",
          isMobile ? "pt-16" : "pl-64"
        )}>
          <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <div className="text-white">Loading...</div>
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
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Project</h1>
          <div className="bg-card p-4 md:p-6 rounded-lg shadow-lg">
            <ProjectForm initialData={project} />
          </div>
        </div>
      </div>
    </div>
  );
}