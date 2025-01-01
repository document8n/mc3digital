import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Task } from "@/types/task";
import { TaskEditModal } from "./TaskEditModal";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  showProject?: boolean;
  isDragging?: boolean;
}

export function TaskCard({ task, onUpdate, showProject = false, isDragging = false }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners}
        className={cn(
          "transition-all duration-200",
          isDragging && "opacity-50",
          isSortableDragging && "z-50"
        )}
      >
        <Card 
          className={cn(
            "cursor-move border border-border/40",
            isTaskOverdue(task.due_date) && task.status !== "Completed" && "border-red-500/50",
            isDragging && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            "animate-in fade-in-50 duration-200"
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
      </div>

      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
}