import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { TaskBoard } from "@/components/admin/TaskBoard";
import { supabase } from "@/integrations/supabase/client";

interface TaskListProps {
  onUpdate?: () => void;
}

export function TaskList({ onUpdate }: TaskListProps) {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log("Fetching tasks...");
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      console.log("Tasks fetched:", data);
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="text-center py-4 text-white">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading tasks</div>;
  }

  if (!tasks?.length) {
    return <div className="text-center py-4 text-muted-foreground">No tasks found</div>;
  }

  return <TaskBoard tasks={tasks} onUpdate={onUpdate} />;
}