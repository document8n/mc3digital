import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getProjectStatusColor } from "@/utils/projectUtils";

interface ProjectMetadataProps {
  startDate: string;
  status: string;
  isPortfolio: boolean;
  isActive: boolean;
  url?: string | null;
}

export function ProjectMetadata({ 
  startDate, 
  status, 
  isPortfolio, 
  isActive, 
  url 
}: ProjectMetadataProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <Badge variant="secondary">
          Start Date: {format(new Date(startDate), "PPP")}
        </Badge>
        <Badge className={getProjectStatusColor(status)}>{status}</Badge>
        {isPortfolio && (
          <Badge variant="outline">Portfolio Project</Badge>
        )}
        {!isActive && (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>

      {url && (
        <div>
          <p className="text-sm text-gray-600 mb-1">Project URL</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}