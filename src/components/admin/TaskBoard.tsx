import { XSquare, PlusSquare, CheckSquare } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { TaskColumn } from "./TaskColumn";
import { TaskDragOverlay } from "./TaskDragOverlay";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status === "Todo").sort((a, b) => a.display_order - b.display_order) || [],
    inProgress: tasks?.filter((task) => task.status === "In Progress").sort((a, b) => a.display_order - b.display_order) || [],
    completed: tasks?.filter((task) => task.status === "Completed").sort((a, b) => a.display_order - b.display_order) || [],
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const activeTask = tasks.find(task => task.id === active.id);
    setActiveId(active.id);
    setActiveTask(activeTask || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id;
    const container = over.id as string;
    
    let newStatus: string;
    switch (container) {
      case "todo":
        newStatus = "Todo";
        break;
      case "inProgress":
        newStatus = "In Progress";
        break;
      case "completed":
        newStatus = "Completed";
        break;
      default:
        return;
    }

    try {
      // Get tasks in the target status to calculate new display order
      const tasksInTargetStatus = tasksByStatus[container as keyof typeof tasksByStatus];
      const newDisplayOrder = tasksInTargetStatus.length;

      console.log('Updating task:', {
        taskId,
        newStatus,
        newDisplayOrder
      });

      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          display_order: newDisplayOrder
        })
        .eq('id', taskId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Task moved to ${newStatus}`,
      });
      
      onUpdate();
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    }

    setActiveId(null);
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTask(null);
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
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
      <TaskDragOverlay activeTask={activeTask} onUpdate={onUpdate} />
    </DndContext>
  );
}