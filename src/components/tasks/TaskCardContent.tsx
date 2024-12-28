import { Calendar, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TaskCardContentProps {
  title: string;
  description: string | null;
  dueDate: string | null;
  projectName?: string;
  showProject?: boolean;
  isCompleted?: boolean;
  onEdit: () => void;
  onComplete: () => void;
}

export function TaskCardContent({
  title,
  description,
  dueDate,
  projectName,
  showProject = false,
  isCompleted = false,
  onEdit,
  onComplete,
}: TaskCardContentProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          {showProject && projectName && (
            <p className="text-sm text-muted-foreground">
              Project: {projectName}
            </p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {!isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onComplete}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {dueDate && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Due: {format(new Date(dueDate), 'PPP')}</span>
        </div>
      )}
    </div>
  );
}