import AdminMenu from "@/components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, Clock, Users } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      client: "Tech Solutions Inc",
      deadline: "2024-04-15",
      team: 4,
      status: "In Progress"
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "Startup Co",
      deadline: "2024-05-01",
      team: 6,
      status: "Planning"
    },
    {
      id: 3,
      name: "E-commerce Platform",
      client: "Retail Group",
      deadline: "2024-04-30",
      team: 5,
      status: "In Progress"
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
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Completed Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">45</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">18</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Folder className="h-5 w-5 text-blue-500" />
                    <span>{project.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{project.client}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-orange-400" />
                          <span>{project.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-blue-400" />
                          <span>{project.team} members</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.status}
                      </span>
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