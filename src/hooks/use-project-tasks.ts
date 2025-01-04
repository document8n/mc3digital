import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/types/task';

export function useProjectTasks(projectId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['projectTasks', projectId],
    queryFn: async () => {
      console.log('Fetching tasks for project:', projectId);
      if (!projectId) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
        return [];
      }
      
      console.log('Tasks fetched:', data);
      return data || [];
    },
    enabled: !!projectId,
    staleTime: 1000, // Add a small stale time to prevent immediate refetches
  });

  // Set up real-time subscription for tasks
  useEffect(() => {
    if (!projectId) return;

    console.log('Setting up real-time subscription for tasks...');
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          queryClient.invalidateQueries({ queryKey: ['projectTasks', projectId] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  const fetchTasks = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refetching tasks:', error);
    }
  };

  return { tasks, fetchTasks };
}