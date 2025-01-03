import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    status: string;
    start_date: string;
  };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const [recentTask, setRecentTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchRecentTask = async () => {
      console.log('Fetching recent task for project:', project.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching recent task:', error);
      } else {
        console.log('Recent task fetched:', data);
        setRecentTask(data);
      }
    };

    fetchRecentTask();
  }, [project.id]);

  return (
    <Card 
      key={project.id} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardContent className="pt-6">
        <h3 className="font-medium mb-2">{project.name}</h3>
        <div className="text-sm text-muted-foreground">
          <p>Status: {project.status}</p>
          <p>Start Date: {format(new Date(project.start_date), 'MMM dd, yyyy')}</p>
          {recentTask && (
            <div className="mt-2 p-2 bg-muted/50 rounded-sm">
              <p className="text-xs font-medium">Latest Task:</p>
              <p className="text-xs truncate">{recentTask.title}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};