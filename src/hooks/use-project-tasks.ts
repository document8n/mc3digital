import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProjectTasks(projectId: string | undefined) {
  const [tasks, setTasks] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      if (!projectId) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
  };

  return { tasks, fetchTasks };
}