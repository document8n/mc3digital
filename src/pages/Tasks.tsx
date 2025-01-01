import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { Task } from "@/types/task";

const Tasks = () => {
  const isMobile = useIsMobile();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const { data: tasks, isLoading, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          project:project_id (
            name
          )
        `)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
  });

  const handleTaskSuccess = () => {
    setIsTaskFormOpen(false);
    refetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pl-0" : "pl-64"
      )}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
          <TaskHeader
            title="Task Management"
            isFormOpen={isTaskFormOpen}
            onFormOpenChange={setIsTaskFormOpen}
            onTaskSuccess={handleTaskSuccess}
          />
          <TaskList
            tasks={tasks}
            onUpdate={refetchTasks}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;