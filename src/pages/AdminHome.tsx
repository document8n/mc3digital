import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, CheckSquare, XSquare, PlusSquare, Calendar } from "lucide-react";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pl-0" : "pl-64"
      )}>
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>
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
                  {tasks?.slice(0, 5).map((task) => (
                    <Card key={task.id} className="bg-muted">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium">{task.title}</h3>
                            {task.project && (
                              <p className="text-sm text-muted-foreground">
                                Project: {task.project.name}
                              </p>
                            )}
                          </div>
                          <span className={cn(
                            "text-sm font-medium",
                            getStatusColor(task.status)
                          )}>
                            {task.status}
                          </span>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
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