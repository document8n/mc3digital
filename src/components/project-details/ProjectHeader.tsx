import { useNavigate } from "react-router-dom";
import { Calendar, Users, DollarSign, Link as LinkIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    start_date: string;
    status: string;
    team_size: number;
    budget: number;
    notes?: string | null;
    url?: string | null;
    image?: string | null;
    is_active: boolean;
    is_portfolio: boolean;
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const navigate = useNavigate();

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={project.is_active ? "default" : "secondary"}>
              {project.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
              {project.status}
            </Badge>
            {project.is_portfolio && (
              <Badge variant="outline">Portfolio Project</Badge>
            )}
          </div>
        </div>
        <Button
          onClick={() => navigate(`/projects/edit/${project.id}`)}
          variant="outline"
          size="icon"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-4 w-4 text-green-400" />
            <span>Team Size: {project.team_size}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-amber-400" />
            <span>Budget: ${Number(project.budget).toLocaleString()}</span>
          </div>
        </div>
        
        {project.notes && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">{project.notes}</p>
          </div>
        )}
        
        {project.url && (
          <div className="mt-4 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-blue-400" />
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Project URL
            </a>
          </div>
        )}
        
        {project.image && (
          <div className="mt-4">
            <img 
              src={project.image} 
              alt={project.name}
              className="rounded-lg max-h-48 object-cover w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}