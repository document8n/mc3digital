import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/TaskForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Task } from "@/types/task";

interface ProjectTasksProps {
  projectId: string;
  tasks: Task[];
  refetchTasks: () => void;
}

export function ProjectTasks({ projectId, tasks, refetchTasks }: ProjectTasksProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskSuccess = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    refetchTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Project Tasks</h2>
        <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <TaskForm
            projectId={projectId}
            initialData={editingTask || undefined}
            onSuccess={handleTaskSuccess}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {tasks?.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No tasks found for this project.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={refetchTasks}
            />
          ))}
        </div>
      )}
    </div>
  );
}