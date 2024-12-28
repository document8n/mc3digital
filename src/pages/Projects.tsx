import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Users, DollarSign } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      client: "Tech Solutions Inc",
      startDate: "2024-01-15",
      status: "In Progress",
      team: 5,
      budget: 45000
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "Startup Co",
      startDate: "2024-02-01",
      status: "Planning",
      team: 3,
      budget: 28000
    },
    {
      id: 3,
      name: "Website Redesign",
      client: "Retail Group",
      startDate: "2024-01-01",
      status: "In Progress",
      team: 4,
      budget: 32000
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <Button className="hover:scale-105 transition-transform">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{projects.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {projects.reduce((sum, project) => sum + project.team, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${projects.reduce((sum, project) => sum + project.budget, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm space-y-2">
                      <p className="font-medium text-foreground">{project.client}</p>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                        <span>Started: {project.startDate}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 text-green-400" />
                        <span>Team Size: {project.team}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-1 text-amber-400" />
                        <span>${project.budget.toLocaleString()}</span>
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