import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Task } from "@/types/task";
import { LucideIcon } from "lucide-react";

interface TaskColumnProps {
  id: string;
  title: string;
  icon: LucideIcon;
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskColumn({ id, title, icon: Icon, tasks, onUpdate }: TaskColumnProps) {
  const iconColor = {
    todo: "text-yellow-500",
    inProgress: "text-blue-500",
    completed: "text-green-500",
  }[id];

  return (
    <div className="space-y-4">
      <div className="rounded-t-lg p-3 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex items-center gap-2 text-white">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="font-medium">{title}</span>
          <span className="text-white/70 text-sm">({tasks.length})</span>
        </div>
      </div>
      <div className="space-y-4 px-2 relative min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            showProject={true}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No {title.toLowerCase()} tasks
          </p>
        )}
      </div>
    </div>
  );
}