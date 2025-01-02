import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProject(projectId: string | undefined) {
  const [project, setProject] = useState<any>(null);
  const { toast } = useToast();

  const fetchProject = async () => {
    try {
      if (!projectId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
        console.error('Invalid project ID:', projectId);
        toast({
          title: "Error",
          description: "Invalid project ID",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive",
        });
        return null;
      }

      setProject(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
      return null;
    }
  };

  return { project, fetchProject };
}