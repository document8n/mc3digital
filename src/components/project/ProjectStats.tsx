import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FolderOpen, Star } from "lucide-react";

interface ProjectStatsProps {
  totalProjects: number;
  activeProjects: number;
  portfolioProjects: number;
}

export function ProjectStats({ totalProjects, activeProjects, portfolioProjects }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Total Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalProjects}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{activeProjects}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Portfolio Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{portfolioProjects}</p>
        </CardContent>
      </Card>
    </div>
  );
}