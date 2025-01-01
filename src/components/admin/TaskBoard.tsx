import { XSquare, PlusSquare, CheckSquare } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { TaskColumn } from "./TaskColumn";
import { DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DragOverlay } from "../tasks/DragOverlay";
import { createPortal } from "react-dom";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const tasksByStatus = {
    todo: tasks?.filter((task) => task.status === "Todo").sort((a, b) => a.display_order - b.display_order) || [],
    inProgress: tasks?.filter((task) => task.status === "In Progress").sort((a, b) => a.display_order - b.display_order) || [],
    completed: tasks?.filter((task) => task.status === "Completed").sort((a, b) => a.display_order - b.display_order) || [],
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveTask(null);
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const statusMap: { [key: string]: string } = {
      todo: "Todo",
      inProgress: "In Progress",
      completed: "Completed"
    };

    const newStatus = statusMap[over.id as string];
    if (!newStatus || activeTask.status === newStatus) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeTask.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Task moved to ${newStatus}`,
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
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
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
      {createPortal(
        <DragOverlay activeTask={activeTask} />,
        document.body
      )}
    </DndContext>
  );
}