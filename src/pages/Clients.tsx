import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, Phone, Building, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Clients = () => {
  console.log("Rendering Clients page");

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log("Fetching clients");
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name');

      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }
      console.log("Fetched clients:", data);
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <Button className="hover:scale-105 transition-transform">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{clients?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{clients?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">New This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {clients?.filter(client => {
                    const createdDate = new Date(client.created_at);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() &&
                           createdDate.getFullYear() === now.getFullYear();
                  }).length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="text-center text-white">Loading clients...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients?.map((client) => (
                <Card key={client.id} className="hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Building className="h-5 w-5 text-indigo-500" />
                      <span>{client.business_name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-foreground">{client.contact_name}</p>
                        {client.email && (
                          <div className="flex items-center text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                            <span>{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2 text-green-400" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.city && (
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2 text-amber-400" />
                            <span>
                              {client.city}
                              {client.state ? `, ${client.state}` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pt-2 border-t">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;