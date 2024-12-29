import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskBoard } from "@/components/admin/TaskBoard";
import { Task } from "@/types/task";

const Tasks = () => {
  const isMobile = useIsMobile();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { data: tasks, isLoading, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      console.log("Fetching tasks...");
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          project:project_id (
            name
          )
        `)
        .order("due_date", { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      console.log("Tasks fetched:", data);
      return data as Task[];
    },
  });

  const handleTaskSuccess = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-white">Task Management</h1>
            <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTask(null)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? "Edit Task" : "Add Task"}
                  </DialogTitle>
                </DialogHeader>
                <TaskForm
                  projectId=""
                  initialData={editingTask || undefined}
                  onSuccess={handleTaskSuccess}
                  onCancel={() => {
                    setIsTaskFormOpen(false);
                    setEditingTask(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-white">Loading tasks...</div>
          ) : tasks?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No tasks found</div>
          ) : (
            <TaskBoard tasks={tasks} onUpdate={refetchTasks} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;