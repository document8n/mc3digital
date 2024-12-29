import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminMenu from "@/components/AdminMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

const ClientDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['client-projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['client-invoices', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', id)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['client-tasks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, projects!inner(*)')
        .eq('projects.client_id', id)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingClient) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pt-16" : "ml-64"
      )}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Client Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-indigo-500" />
                {client.business_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Contact Information</h3>
                  <p className="text-lg font-medium">{client.contact_name}</p>
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-400" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-400" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Address</h3>
                  {client.address_line1 && (
                    <p>{client.address_line1}</p>
                  )}
                  {client.address_line2 && (
                    <p>{client.address_line2}</p>
                  )}
                  {(client.city || client.state || client.postal_code) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-400" />
                      <span>
                        {[
                          client.city,
                          client.state,
                          client.postal_code
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <p>Loading projects...</p>
              ) : projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-medium mb-2">{project.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>Status: {project.status}</p>
                          <p>Start Date: {format(new Date(project.start_date), 'MMM dd, yyyy')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No projects found</p>
              )}
            </CardContent>
          </Card>

          {/* Invoices Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvoices ? (
                <p>Loading invoices...</p>
              ) : invoices && invoices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {invoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Invoice #{invoice.invoice_number}</h3>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            invoice.status === 'paid' ? "bg-green-100 text-green-800" :
                            invoice.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{Number(invoice.amount).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No invoices found</p>
              )}
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTasks ? (
                <p>Loading tasks...</p>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-medium mb-2">{task.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>Project: {task.projects?.name}</p>
                          <p>Status: {task.status}</p>
                          {task.due_date && (
                            <p>Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No tasks found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;