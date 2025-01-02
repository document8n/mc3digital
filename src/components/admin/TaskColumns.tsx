import { XSquare, PlusSquare, CheckSquare } from "lucide-react";
import { Task } from "@/types/task";
import { TaskColumn } from "./TaskColumn";

interface TaskColumnsProps {
  items: Task[];
  onUpdate: () => void;
}

export function TaskColumns({ items, onUpdate }: TaskColumnsProps) {
  const tasksByStatus = {
    todo: items?.filter((task) => task.status === "Todo").sort((a, b) => a.display_order - b.display_order) || [],
    inProgress: items?.filter((task) => task.status === "In Progress").sort((a, b) => a.display_order - b.display_order) || [],
    completed: items?.filter((task) => task.status === "Completed").sort((a, b) => a.display_order - b.display_order) || [],
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