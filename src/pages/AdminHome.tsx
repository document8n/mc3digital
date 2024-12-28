import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  CheckSquare, 
  XSquare, 
  PlusSquare, 
  Calendar,
  Plus,
  Pencil,
  Check,
  AlertCircle
} from "lucide-react";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { data: tasks, isLoading } = useQuery({
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
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast({
      title: "Success",
      description: editingTask ? "Task updated successfully" : "Task created successfully",
    });
  };

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: `Task marked as ${newStatus.toLowerCase()}`,
      });
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-500";
      case "in progress":
        return "text-blue-500";
      default:
        return "text-yellow-500";
    }
  };

  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status.toLowerCase() === "todo") || [],
    inProgress: tasks?.filter((task) => task.status.toLowerCase() === "in progress") || [],
    completed: tasks?.filter((task) => task.status.toLowerCase() === "completed") || [],
  };

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <XSquare className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasksByStatus.todo.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <PlusSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasksByStatus.inProgress.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasksByStatus.completed.length}</div>
              </CardContent>
            </Card>
          </div>

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
                    <Card key={task.id} className={cn(
                      "bg-muted hover:bg-accent/50 transition-colors",
                      isTaskOverdue(task.due_date) && task.status !== "Completed" && "border-red-500/50"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{task.title}</h3>
                              {isTaskOverdue(task.due_date) && task.status !== "Completed" && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            {task.project && (
                              <p className="text-sm text-muted-foreground">
                                Project: {task.project.name}
                              </p>
                            )}
                            {task.description && (
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-medium px-2 py-1 rounded-full",
                              task.status === "Completed" ? "bg-green-500/20 text-green-400" :
                              task.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            )}>
                              {task.status}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTask(task);
                                setIsTaskFormOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {task.status !== "Completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(task.id, "Completed")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {format(new Date(task.due_date), 'PPP')}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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