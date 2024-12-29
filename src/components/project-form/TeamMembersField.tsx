import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./types";

interface TeamMembersFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function TeamMembersField({ form }: TeamMembersFieldProps) {
  return (
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
  );
}