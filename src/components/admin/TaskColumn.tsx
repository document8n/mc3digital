import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Task } from "@/types/task";
import { LucideIcon, PlusCircle } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";

interface TaskColumnProps {
  id: string;
  title: string;
  icon: LucideIcon;
  tasks: Task[];
  onUpdate: () => void;
  projectId: string;
}

export function TaskColumn({ id, title, icon: Icon, tasks, onUpdate, projectId }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [showTaskForm, setShowTaskForm] = useState(false);

  const iconColor = {
    todo: "text-yellow-500",
    inProgress: "text-blue-500",
    completed: "text-green-500",
  }[id];

  const handleTaskSuccess = async () => {
    console.log("Task operation successful, refreshing tasks...");
    try {
      await onUpdate();
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-[calc(100vh-12rem)]",
        isOver && "bg-primary/5 rounded-lg"
      )}
    >
      <div className="rounded-t-lg p-3 bg-gradient-to-r from-gray-800 to-gray-700 mb-4">
        <div className="flex items-center gap-2 text-white">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="font-medium">{title}</span>
          <span className="text-white/70 text-sm">({tasks.length})</span>
        </div>
      </div>
      <div 
        className={cn(
          "flex-1 space-y-4 px-2 relative min-h-[100px] overflow-y-auto",
          "before:absolute before:inset-0 before:rounded-md before:border-2 before:border-dashed before:border-primary/50 before:opacity-0 before:pointer-events-none",
          isOver && "before:opacity-100"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              showProject={true}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No {title.toLowerCase()} tasks
          </p>
        )}
        <Button 
          onClick={() => setShowTaskForm(true)}
          variant="ghost" 
          className="w-full border-2 border-dashed border-gray-700 hover:border-primary hover:bg-primary/5 mt-4 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2 text-white" />
          Add Task
        </Button>
      </div>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <TaskForm
            projectId={projectId}
            initialData={{
              status: title,
              project_id: projectId,
              id: '',
              title: '',
              description: '',
              due_date: null,
              display_order: 0
            }}
            onSuccess={handleTaskSuccess}
            onCancel={() => setShowTaskForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}