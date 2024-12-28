import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

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
  isDragging?: boolean;
}

export function ProjectCard({ project, onClick, isDragging }: ProjectCardProps) {
  const [activeTasks, setActiveTasks] = useState(0);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    const fetchActiveTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', project.id)
        .neq('status', 'Completed');

      if (!error) {
        setActiveTasks(data?.length || 0);
      } else {
        console.error('Error fetching active tasks:', error);
      }
    };

    fetchActiveTasks();
  }, [project.id]);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        "transition-all duration-200",
        isDragging && "opacity-50",
        isSortableDragging && "z-50 scale-105"
      )}
    >
      <Card 
        className={cn(
          "hover:scale-102 transition-transform duration-200 cursor-move bg-gray-800/50 backdrop-blur-sm border-gray-700",
          isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          !isDragging && "hover:ring-1 hover:ring-primary/50"
        )}
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
    </div>
  );
}