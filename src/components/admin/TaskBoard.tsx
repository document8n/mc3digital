import { useState } from "react";
import { Task } from "@/types/task";
import { DndContext, DragEndEvent, DragStartEvent, DragOverEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { arrayMove } from "@dnd-kit/sortable";
import { useTaskBoardOperations } from "@/hooks/use-task-board";
import { TaskColumns } from "./TaskColumns";
import { DragOverlay } from "../tasks/DragOverlay";
import { useQueryClient } from "@tanstack/react-query";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate?: () => void;
}

export function TaskBoard({ tasks, onUpdate }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [items, setItems] = useState(tasks);
  const queryClient = useQueryClient();

  const { handleDragEnd: handleDragEndOp } = useTaskBoardOperations({ 
    items, 
    onUpdate: () => {
      console.log("Task board operation completed, invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onUpdate?.();
    }
  });

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTask(items.find(t => t.id === active.id) || null);
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = items.find(t => t.id === active.id);
    const overTask = items.find(t => t.id === over.id);
    
    if (!activeTask) return;

    const statusMap: { [key: string]: string } = {
      todo: "Todo",
      inProgress: "In Progress",
      completed: "Completed"
    };

    if (over.id in statusMap) {
      const newStatus = statusMap[over.id as string];
      if (activeTask.status !== newStatus) {
        setItems(prevItems => {
          return prevItems.map(item => {
            if (item.id === active.id) {
              return { ...item, status: newStatus };
            }
            return item;
          });
        });
      }
      return;
    }

    if (overTask && activeTask.status === overTask.status && active.id !== over.id) {
      const oldIndex = items.findIndex(t => t.id === active.id);
      const newIndex = items.findIndex(t => t.id === over.id);
      
      setItems(prevItems => {
        const newItems = arrayMove(prevItems, oldIndex, newIndex);
        const statusItems = newItems.filter(t => t.status === activeTask.status);
        return newItems.map(item => {
          if (item.status === activeTask.status) {
            const newOrder = statusItems.findIndex(t => t.id === item.id);
            return { ...item, display_order: newOrder };
          }
          return item;
        });
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEndOp}
    >
      <TaskColumns items={items} onUpdate={onUpdate} />
      {createPortal(
        <DragOverlay activeTask={activeTask} />,
        document.body
      )}
    </DndContext>
  );
}