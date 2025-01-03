import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/TaskForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Task } from "@/types/task";
import { TaskBoard } from "@/components/admin/TaskBoard";

interface ProjectTasksProps {
  projectId: string;
  tasks: Task[];
  refetchTasks: () => Promise<void>;
}

export function ProjectTasks({ projectId, tasks, refetchTasks }: ProjectTasksProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskSuccess = async () => {
    console.log("Task operation successful, refreshing tasks...");
    try {
      await refetchTasks();
      setShowTaskForm(false);
      setEditingTask(null);
      console.log("Tasks refreshed successfully");
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Project Tasks</h2>
        <Button 
          onClick={() => setShowTaskForm(true)} 
          className="admin-action-button"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <TaskForm
            projectId={projectId}
            initialData={editingTask || {
              id: '',
              title: '',
              description: '',
              status: 'todo',
              due_date: null,
              project_id: projectId,
              display_order: 0
            }}
            onSuccess={handleTaskSuccess}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {tasks?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found for this project.
        </div>
      ) : (
        <TaskBoard tasks={tasks} onUpdate={refetchTasks} projectId={projectId} />
      )}
    </div>
  );
}