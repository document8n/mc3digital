import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/types/task";

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: () => void;
}

export function TaskEditModal({ isOpen, onClose, task, onUpdate }: TaskEditModalProps) {
  const handleSuccess = () => {
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          projectId={task.project_id}
          initialData={task}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}