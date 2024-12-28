import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FolderOpen, Star, Briefcase, Calendar, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { toast } = useToast();
  const navigate = useNavigate();
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
            <Button 
              className="hover:scale-105 transition-transform w-full sm:w-auto"
              onClick={() => navigate("/projects/new")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalProjects}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{activeProjects}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Portfolio Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{portfolioProjects}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:scale-102 transition-transform duration-200 cursor-pointer bg-gray-800/50 backdrop-blur-sm border-gray-700"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                        <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-2 text-green-400" />
                        <span>Team Size: {project.team_size}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <div className="flex items-center text-sm text-gray-300">
                        <DollarSign className="h-4 w-4 mr-1 text-amber-400" />
                        <span>${Number(project.budget).toLocaleString()}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${project.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
