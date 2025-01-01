import { XSquare, PlusSquare, CheckSquare } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { TaskColumn } from "./TaskColumn";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const { toast } = useToast();

  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status === "Todo").sort((a, b) => a.display_order - b.display_order) || [],
    inProgress: tasks?.filter((task) => task.status === "In Progress").sort((a, b) => a.display_order - b.display_order) || [],
    completed: tasks?.filter((task) => task.status === "Completed").sort((a, b) => a.display_order - b.display_order) || [],
  };

  const columns = [
    {
      id: "todo",
      title: "Todo",
      icon: XSquare,
      tasks: tasksByStatus.todo
    },
    {
      id: "inProgress",
      title: "In Progress",
      icon: PlusSquare,
      tasks: tasksByStatus.inProgress
    },
    {
      id: "completed",
      title: "Completed",
      icon: CheckSquare,
      tasks: tasksByStatus.completed
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <TaskColumn
          key={column.id}
          id={column.id}
          title={column.title}
          icon={column.icon}
          tasks={column.tasks}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}