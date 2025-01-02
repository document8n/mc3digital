import { useQuery } from "@tanstack/react-query";
import AdminMenu from "@/components/AdminMenu";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ProjectStats } from "@/components/project/ProjectStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, FileText, User } from "lucide-react";

const AdminHome = () => {
  const isMobile = useIsMobile();

  const { data: projectStats } = useQuery({
    queryKey: ["projectStats"],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*");

      if (error) throw error;

      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.is_active).length,
        portfolioProjects: projects.filter(p => p.is_portfolio).length
      };
    }
  });

  const { data: taskStats } = useQuery({
    queryKey: ["taskStats"],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("status");

      if (error) throw error;

      return {
        total: tasks.length,
        todo: tasks.filter(t => t.status === "Todo").length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        completed: tasks.filter(t => t.status === "Completed").length
      };
    }
  });

  const { data: clientCount } = useQuery({
    queryKey: ["clientCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clients")
        .select("*", { count: 'exact', head: true });

      if (error) throw error;
      return count;
    }
  });

  const { data: invoiceStats } = useQuery({
    queryKey: ["invoiceStats"],
    queryFn: async () => {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("status, amount");

      if (error) throw error;

      const total = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const pending = invoices.filter(inv => inv.status === "pending").length;

      return {
        total,
        pending
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pl-0" : "pl-64"
      )}>
        <div className="dashboard-container space-y-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
          
          {projectStats && (
            <ProjectStats
              totalProjects={projectStats.totalProjects}
              activeProjects={projectStats.activeProjects}
              portfolioProjects={projectStats.portfolioProjects}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Tasks Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Total Tasks: {taskStats?.total || 0}</p>
                  <p className="text-sm">Todo: {taskStats?.todo || 0}</p>
                  <p className="text-sm">In Progress: {taskStats?.inProgress || 0}</p>
                  <p className="text-sm">Completed: {taskStats?.completed || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Total Amount: ${invoiceStats?.total.toFixed(2) || '0.00'}</p>
                  <p className="text-sm">Pending Invoices: {invoiceStats?.pending || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Total Clients: {clientCount || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;