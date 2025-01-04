import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./types";

interface ProjectFieldProps {
  form: UseFormReturn<TaskFormValues>;
  projects: Array<{ id: string; name: string }>;
  hideField?: boolean;
}

export function ProjectField({ form, projects, hideField }: ProjectFieldProps) {
  const navigate = useNavigate();

  if (hideField) return null;

  return (
    <FormField
      control={form.control}
      name="project_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project (Optional)</FormLabel>
          <FormControl>
            <select
              {...field}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value) {
                  navigate(`/projects/${e.target.value}`);
                }
              }}
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || 'Unnamed Project'}
                </option>
              ))}
            </select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}