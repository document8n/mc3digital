import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    status: string;
    start_date: string;
  };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      key={project.id} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardContent className="pt-6">
        <h3 className="font-medium mb-2">{project.name}</h3>
        <div className="text-sm text-muted-foreground">
          <p>Status: {project.status}</p>
          <p>Start Date: {format(new Date(project.start_date), 'MMM dd, yyyy')}</p>
        </div>
      </CardContent>
    </Card>
  );
};