import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

export function useProjectTasks(projectId: string | undefined) {
  const { toast } = useToast();

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
    enabled: !!projectId
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [projectId, refetch]);

  return { tasks, fetchTasks: refetch };
}