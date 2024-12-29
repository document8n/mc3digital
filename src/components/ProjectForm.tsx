import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFields } from "./project-form/BasicInfoFields";
import { MetricsFields } from "./project-form/MetricsFields";
import { SettingsFields } from "./project-form/SettingsFields";
import { ClientField } from "./project-form/ClientField";
import { DateStatusFields } from "./project-form/DateStatusFields";
import { ProjectFormProps, ProjectFormValues } from "./project-form/types";
import { format } from "date-fns";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      client_id: initialData?.client_id || "",
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      status: initialData?.status || "Planning",
      team_size: initialData?.team_size || 1,
      budget: initialData?.budget || 0,
      notes: initialData?.notes || "",
      url: initialData?.url || "",
      image: initialData?.image || "",
      is_active: initialData?.is_active ?? true,
      is_portfolio: initialData?.is_portfolio ?? false,
      industry: initialData?.industry || "",
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
        start_date: format(data.start_date, "yyyy-MM-dd"),
        user_id: userData.user.id,
      };

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <BasicInfoFields form={form} />
          <ClientField form={form} />
          <DateStatusFields form={form} />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Enter industry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <MetricsFields form={form} />
          <SettingsFields form={form} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit">
          {initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}