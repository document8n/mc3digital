import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [activeTasks, setActiveTasks] = useState(0);

  useEffect(() => {
    const fetchActiveTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', project.id)
        .eq('status', 'active');

      if (!error) {
        setActiveTasks(data?.length || 0);
      } else {
        console.error('Error fetching active tasks:', error);
      }
    };

    fetchActiveTasks();
  }, [project.id]);

  return (
    <Card 
      className="hover:scale-102 transition-transform duration-200 cursor-pointer bg-gray-800/50 backdrop-blur-sm border-gray-700"
      onClick={onClick}
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
          <div className="flex items-center pt-2 border-t border-gray-700">
            <div className="flex items-center text-sm text-gray-300">
              <CheckSquare className="h-4 w-4 mr-2 text-amber-400" />
              <span>Active Tasks: {activeTasks}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}