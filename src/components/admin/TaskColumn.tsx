import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import { LucideIcon } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  id: string;
  title: string;
  icon: LucideIcon;
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskColumn({ id, title, icon: Icon, tasks, onUpdate }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const iconColor = {
    todo: "text-yellow-500",
    inProgress: "text-blue-500",
    completed: "text-green-500",
  }[id];

  return (
    <div ref={setNodeRef} className="space-y-4 transition-all duration-200">
      <div className="rounded-t-lg p-3 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex items-center gap-2 text-white">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="font-medium">{title}</span>
          <span className="text-white/70 text-sm">({tasks.length})</span>
        </div>
      </div>
      <div className="space-y-4 px-2 relative min-h-[100px]">
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
        {isOver && (
          <div 
            className="absolute inset-x-0 border-2 border-primary/50 border-dashed rounded-lg bg-primary/5 pointer-events-none z-10"
            style={{
              height: '88px', // Match task card height
              top: tasks.length * (88 + 16), // card height (88px) + gap (16px)
              transition: 'all 200ms ease'
            }}
          />
        )}
      </div>
    </div>
  );
}