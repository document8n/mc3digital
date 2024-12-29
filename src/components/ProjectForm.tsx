import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClientField } from "./project-form/ClientField";
import { DateStatusFields } from "./project-form/DateStatusFields";
import { SettingsFields } from "./project-form/SettingsFields";
import { ProjectFormProps, ProjectFormValues } from "./project-form/types";
import { format } from "date-fns";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  
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

  useEffect(() => {
    console.log("Form values updated:", form.getValues());
  }, [form.watch()]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      console.log("Submitting form with data:", data);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const formattedData = {
        ...data,
        // Convert empty string client_id to null
        client_id: data.client_id || null,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        due_date: data.due_date ? format(data.due_date, "yyyy-MM-dd") : null,
        user_id: userData.user.id,
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

      if (result.error) {
        console.error("Database operation failed:", result.error);
        throw result.error;
      }

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
        description: `Failed to ${initialData ? "update" : "create"} project. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter project notes..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ClientField form={form} />

          <FormField
            control={form.control}
            name="team_members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Members</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team members" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DateStatusFields form={form} />
          </div>

          <div className="space-y-4">
            <SettingsFields form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="submit">
            {initialData ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}