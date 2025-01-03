import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  status: string;
  start_date: string;
}

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsList = ({ projects, isLoading }: ProjectsListProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p>No projects found</p>
        )}
      </CardContent>
    </Card>
  );
};