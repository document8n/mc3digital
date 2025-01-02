import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { TaskBoard } from "@/components/admin/TaskBoard";
import { supabase } from "@/integrations/supabase/client";

interface TaskListProps {
  onUpdate?: () => void;
}

export function TaskList({ onUpdate }: TaskListProps) {
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log("Fetching tasks...");
      const { data, error } = await supabase
        .from('tasks')
        .select('*, project:projects(name)')
        .order('display_order', { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      console.log("Tasks fetched:", data);
      return data as Task[];
    },
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  if (isLoading) {
    return <div className="text-center py-4 text-white">Loading tasks...</div>;
  }

  if (error) {
    console.error("Error in TaskList:", error);
    return <div className="text-center py-4 text-red-500">Error loading tasks</div>;
  }

  if (!tasks?.length) {
    return <div className="text-center py-4 text-muted-foreground">No tasks found</div>;
  }

  const handleUpdate = async () => {
    console.log("TaskList: Handling update...");
    await refetch();
    onUpdate?.();
  };

  return <TaskBoard tasks={tasks} onUpdate={handleUpdate} />;
}