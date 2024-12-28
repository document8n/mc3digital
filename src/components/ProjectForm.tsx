import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFields } from "./project-form/BasicInfoFields";
import { DateStatusFields } from "./project-form/DateStatusFields";
import { MetricsFields } from "./project-form/MetricsFields";
import { SettingsFields } from "./project-form/SettingsFields";
import { ClientField } from "./project-form/ClientField";
import { ProjectFormProps, ProjectFormValues } from "./project-form/types";
import { format } from "date-fns";

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      status: initialData?.status || "Planning",
      team_size: initialData?.team_size || 1,
      budget: initialData?.budget || 0,
      is_active: initialData?.is_active ?? true,
      is_portfolio: initialData?.is_portfolio ?? false,
      notes: initialData?.notes || "",
      url: initialData?.url || "",
      image: initialData?.image || "",
      client_id: initialData?.client_id || "null",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      const projectData = {
        name: values.name,
        start_date: format(values.start_date, 'yyyy-MM-dd'),
        status: values.status,
        team_size: values.team_size,
        budget: values.budget,
        is_active: values.is_active,
        is_portfolio: values.is_portfolio,
        notes: values.notes,
        url: values.url,
        image: values.image,
        client_id: values.client_id === "null" ? null : values.client_id,
        user_id: userData.user.id,
      };

      if (initialData) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/projects");
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <BasicInfoFields form={form} />
          <ClientField form={form} />
          <DateStatusFields form={form} />
          <MetricsFields form={form} />
          <SettingsFields form={form} />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/projects")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}