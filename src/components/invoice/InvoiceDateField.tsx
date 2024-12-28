import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";

interface InvoiceDateFieldProps {
  form: UseFormReturn<any>;
}

export function InvoiceDateField({ form }: InvoiceDateFieldProps) {
  console.log("Rendering InvoiceDateField with value:", form.getValues("due_date"));
  
  return (
    <FormField
      control={form.control}
      name="due_date"
      render={({ field }) => {
        console.log("Field value in render:", field.value);
        // Ensure we have a valid date object
        const date = field.value ? new Date(field.value) : new Date();
        const formattedDate = format(date, "yyyy-MM-dd");
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={formattedDate}
                onChange={(e) => {
                  console.log("Date changed to:", e.target.value);
                  const newDate = new Date(e.target.value);
                  field.onChange(newDate);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}