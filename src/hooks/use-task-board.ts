import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { DragEndEvent } from "@dnd-kit/core";

interface UseTaskBoardProps {
  items: Task[];
  onUpdate: () => void;
}

export function useTaskBoardOperations({ items, onUpdate }: UseTaskBoardProps) {
  const { toast } = useToast();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = items.find(t => t.id === active.id);
    if (!activeTask) return;

    try {
      const statusMap: { [key: string]: string } = {
        todo: "Todo",
        inProgress: "In Progress",
        completed: "Completed"
      };

      if (over.id in statusMap) {
        const newStatus = statusMap[over.id as string];
        const { error } = await supabase
          .from('tasks')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString(),
            display_order: items.filter(t => t.status === newStatus).length
          })
          .eq('id', activeTask.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Task moved to ${newStatus}`,
        });
      } else {
        const tasksInColumn = items.filter(t => t.status === activeTask.status);
        const updates = tasksInColumn.map(task => ({
          id: task.id,
          project_id: task.project_id,
          status: task.status,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          display_order: task.display_order,
          updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('tasks')
          .upsert(updates);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task order updated",
        });
      }

      onUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  return { handleDragEnd };
}