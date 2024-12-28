import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

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
        const date = field.value ? new Date(field.value) : null;
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Due Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}