import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ProjectFormProps, ProjectFormValues } from "@/components/project-form/types";
import { ProjectNameField } from "@/components/project-form/ProjectNameField";
import { ClientField } from "@/components/project-form/ClientField";
import { DateStatusFields } from "@/components/project-form/DateStatusFields";
import { ProjectNotesField } from "@/components/project-form/ProjectNotesField";
import { SettingsFields } from "@/components/project-form/SettingsFields";
import { TeamMembersField } from "@/components/project-form/TeamMembersField";
import { ProjectFormSubmit } from "@/components/project-form/ProjectFormSubmit";

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const userData = useUser();

  console.log("Initial form data:", initialData);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      client_id: initialData?.client_id || "",
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      due_date: initialData?.due_date ? new Date(initialData.due_date) : undefined,
      status: initialData?.status || "Planning",
      notes: initialData?.notes || "",
      url: initialData?.url || "",
      image: initialData?.image || "",
      is_active: initialData?.is_active ?? true,
      is_portfolio: initialData?.is_portfolio ?? false,
      team_members: initialData?.team_members || "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      console.log("Submitting form with data:", data);

      if (!userData?.id) {
        throw new Error("No user ID found");
      }

      const formattedData = {
        name: data.name,
        client_id: data.client_id || null,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        due_date: data.due_date ? format(data.due_date, "yyyy-MM-dd") : null,
        status: data.status,
        notes: data.notes || null,
        url: data.url || null,
        image: data.image || null,
        is_active: data.is_active,
        is_portfolio: data.is_portfolio,
        team_members: data.team_members || null,
        user_id: userData.id,
      };

      console.log("Formatted data for submission:", formattedData);

      let result;
      
      if (initialData?.id) {
        console.log("Updating existing project:", initialData.id);
        result = await supabase
          .from("projects")
          .update(formattedData)
          .eq("id", initialData.id)
          .select()
          .single();
      } else {
        console.log("Creating new project");
        result = await supabase
          .from("projects")
          .insert(formattedData)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      console.log("Project saved successfully:", result.data);

      toast({
        title: "Success",
        description: `Project ${initialData ? "updated" : "created"} successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProjectNameField form={form} />
        <ClientField form={form} />
        <DateStatusFields form={form} />
        <ProjectNotesField form={form} />
        <TeamMembersField form={form} />
        <SettingsFields form={form} />
        <ProjectFormSubmit isEditing={!!initialData} />
      </form>
    </Form>
  );
}