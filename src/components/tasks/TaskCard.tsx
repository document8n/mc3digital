import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Check, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  project?: {
    name: string;
  } | null;
}

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
    <Card className={`hover:bg-accent/50 transition-colors ${
      isTaskOverdue(dueDate) && task.status !== "Completed" && "border-red-500/50"
    }`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
            />
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dueDate || ""}
                onChange={(e) => setDueDate(e.target.value || null)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDueDate(null)}
                disabled={!dueDate}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                size="sm"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium">{title}</h3>
                {showProject && task.project && (
                  <p className="text-sm text-muted-foreground">
                    Project: {task.project.name}
                  </p>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  task.status === "Completed" ? "bg-green-500/20 text-green-400" :
                  task.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {task.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {task.status !== "Completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusUpdate("Completed")}
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
        )}
      </CardContent>
    </Card>
  );
}