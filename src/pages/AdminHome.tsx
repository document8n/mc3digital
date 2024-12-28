import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskStats } from "@/components/admin/TaskStats";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  project: {
    name: string;
  } | null;
}

const AdminHome = () => {
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

  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status.toLowerCase() === "todo") || [],
    inProgress: tasks?.filter((task) => task.status.toLowerCase() === "in progress") || [],
    completed: tasks?.filter((task) => task.status.toLowerCase() === "completed") || [],
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

          <TaskStats tasksByStatus={tasksByStatus} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading tasks...</div>
              ) : tasks?.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No tasks found</div>
              ) : (
                <div className="space-y-4">
                  {tasks?.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={refetchTasks}
                      showProject={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;