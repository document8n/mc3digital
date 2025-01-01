import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Task } from "@/types/task";
import { TaskEditModal } from "./TaskEditModal";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  showProject?: boolean;
}

export function TaskCard({ task, onUpdate, showProject = false }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <>
      <Card 
        className={cn(
          "hover:bg-accent/50 transition-colors cursor-pointer",
          isTaskOverdue(task.due_date) && task.status !== "Completed" && "border-red-500/50"
        )}
        onClick={() => setIsEditModalOpen(true)}
      >
        <CardContent className="p-4 space-y-2">
          <div>
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
          
          {showProject && task.project?.name && (
            <p className="text-sm text-muted-foreground">
              Project: {task.project.name}
            </p>
          )}
          
          {task.due_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Due: {format(new Date(task.due_date), 'PPP')}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
}