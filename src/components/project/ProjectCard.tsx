import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Archive } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";

interface Project {
  id: string;
  name: string;
  is_active: boolean;
  is_portfolio: boolean;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isDragging?: boolean;
}

export function ProjectCard({ project, onClick, isDragging }: ProjectCardProps) {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  
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
    const fetchRecentTasks = async () => {
      console.log('Fetching recent tasks for project:', project.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', project.id)
        .neq('status', 'Completed')
        .order('updated_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent tasks:', error);
      } else {
        console.log('Recent tasks fetched:', data);
        setRecentTasks(data || []);
      }
    };

    fetchRecentTasks();
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
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-white">{project.name}</CardTitle>
            <div className="flex gap-2">
              <Activity 
                className={cn(
                  "h-5 w-5",
                  project.is_active ? "text-green-400 fill-current" : "text-gray-400"
                )}
              />
              <Archive 
                className={cn(
                  "h-5 w-5",
                  project.is_portfolio ? "text-blue-400 fill-current" : "text-gray-400"
                )}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentTasks.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {recentTasks.map((task) => (
                <li key={task.id} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="line-clamp-1">{task.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No active tasks</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}