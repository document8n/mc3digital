import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./types";

interface MetricsFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function MetricsFields({ form }: MetricsFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="team_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Size</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Budget</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}