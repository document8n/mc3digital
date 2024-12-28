import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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
    <div id={id} className="space-y-4">
      <Card className="bg-background/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            {title}
            <span className="text-muted-foreground">({tasks.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SortableContext
            items={tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
            id={id}
          >
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
        </CardContent>
      </Card>
    </div>
  );
}