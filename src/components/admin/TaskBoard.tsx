import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { XSquare, PlusSquare, CheckSquare } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";

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

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries({
          todo: {
            title: "Todo",
            icon: <XSquare className="h-4 w-4 text-yellow-500" />,
            tasks: tasksByStatus.todo
          },
          inProgress: {
            title: "In Progress",
            icon: <PlusSquare className="h-4 w-4 text-blue-500" />,
            tasks: tasksByStatus.inProgress
          },
          completed: {
            title: "Completed",
            icon: <CheckSquare className="h-4 w-4 text-green-500" />,
            tasks: tasksByStatus.completed
          }
        }).map(([key, { title, icon, tasks }]) => (
          <div key={key} id={key} className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {icon}
                  {title}
                  <span className="text-muted-foreground">({tasks.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SortableContext
                  items={tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                  id={key}
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
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onUpdate={onUpdate}
              showProject={true}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
