import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users } from "lucide-react";

interface Project {
  id: string;
  name: string;
  start_date: string;
  status: string;
  team_size: number;
  budget: number;
  is_active: boolean;
  is_portfolio: boolean;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="hover:scale-102 transition-transform duration-200 cursor-pointer bg-gray-800/50 backdrop-blur-sm border-gray-700"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-4 w-4 mr-2 text-green-400" />
              <span>Team Size: {project.team_size}</span>
            </div>
          </div>
          <div className="flex items-center pt-2 border-t border-gray-700">
            <div className="flex items-center text-sm text-gray-300">
              <DollarSign className="h-4 w-4 mr-1 text-amber-400" />
              <span>${Number(project.budget).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}