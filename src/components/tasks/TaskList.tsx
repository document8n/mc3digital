import { Task } from "@/types/task";
import { TaskBoard } from "@/components/admin/TaskBoard";

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
  isLoading?: boolean;
}

export function TaskList({ tasks, onUpdate, isLoading = false }: TaskListProps) {
  if (isLoading) {
    return <div className="text-center py-4 text-white">Loading tasks...</div>;
  }

  if (!tasks?.length) {
    return <div className="text-center py-4 text-muted-foreground">No tasks found</div>;
  }

  return <TaskBoard tasks={tasks} onUpdate={onUpdate} />;
}