import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building, Mail, Phone, DollarSign } from "lucide-react";

const Projects = () => {
  const clients = [
    {
      id: 1,
      name: "Tech Solutions Inc",
      contact: "John Smith",
      email: "john@techsolutions.com",
      phone: "+1 (555) 123-4567",
      totalValue: 45000
    },
    {
      id: 2,
      name: "Startup Co",
      contact: "Sarah Johnson",
      email: "sarah@startupco.com",
      phone: "+1 (555) 234-5678",
      totalValue: 28000
    },
    {
      id: 3,
      name: "Retail Group",
      contact: "Michael Brown",
      email: "michael@retailgroup.com",
      phone: "+1 (555) 345-6789",
      totalValue: 62000
    }
  ];

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
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{clients.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{clients.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${clients.reduce((sum, client) => sum + client.totalValue, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <span>{client.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{client.contact}</p>
                      <div className="flex items-center mt-2">
                        <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Phone className="h-4 w-4 mr-2 text-green-400" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-1 text-amber-400" />
                        <span>${client.totalValue.toLocaleString()}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;