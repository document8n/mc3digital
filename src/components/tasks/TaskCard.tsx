import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaskCardContent } from "./TaskCardContent";
import { TaskCardEdit } from "./TaskCardEdit";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  showProject?: boolean;
}

export function TaskCard({ task, onUpdate, showProject = false }: TaskCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.due_date);
  const [isSaving, setIsSaving] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.due_date);
  }, [task]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          description: description || null,
          due_date: dueDate,
        })
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      onUpdate();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Task marked as ${newStatus.toLowerCase()}`,
      });
      onUpdate();
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const isTaskOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`hover:bg-accent/50 transition-colors cursor-move ${
        isDragging ? "opacity-50" : ""
      } ${isTaskOverdue(dueDate) && task.status !== "Completed" && "border-red-500/50"}`}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <TaskCardEdit
            title={title}
            description={description}
            dueDate={dueDate}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onDueDateChange={setDueDate}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            isSaving={isSaving}
          />
        ) : (
          <TaskCardContent
            title={title}
            description={task.description}
            dueDate={dueDate}
            projectName={task.project?.name}
            showProject={showProject}
            isCompleted={task.status === "Completed"}
            onEdit={() => setIsEditing(true)}
            onComplete={() => handleStatusUpdate("Completed")}
          />
        )}
      </CardContent>
    </Card>
  );
}