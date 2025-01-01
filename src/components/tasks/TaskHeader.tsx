import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";

interface TaskHeaderProps {
  title: string;
  isFormOpen: boolean;
  onFormOpenChange: (open: boolean) => void;
  onTaskSuccess: () => void;
}

export function TaskHeader({ 
  title, 
  isFormOpen, 
  onFormOpenChange, 
  onTaskSuccess 
}: TaskHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
      <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
        <DialogTrigger asChild>
          <button className="admin-action-button">
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId=""
            onSuccess={onTaskSuccess}
            onCancel={() => onFormOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}