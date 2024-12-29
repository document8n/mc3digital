import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProjectFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@/components/ui/combobox";
import { useToast } from "@/hooks/use-toast";

interface IndustryFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function IndustryField({ form }: IndustryFieldProps) {
  const [customIndustry, setCustomIndustry] = useState("");
  const { toast } = useToast();

  const { data: industries = [], isLoading } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industries")
        .select("name")
        .order("name");

      if (error) {
        console.error("Error fetching industries:", error);
        return [];
      }
      
      return data?.map(industry => ({
        value: industry.name,
        label: industry.name,
      })) || [];
    },
  });

  const handleCustomIndustryAdd = async () => {
    if (!customIndustry.trim()) return;

    try {
      const { error } = await supabase
        .from("industries")
        .insert([{ name: customIndustry.trim(), is_custom: true }]);

      if (error) throw error;

      form.setValue("industry", customIndustry.trim());
      setCustomIndustry("");
      toast({
        title: "Success",
        description: "Custom industry added successfully",
      });
    } catch (error: any) {
      console.error("Error adding custom industry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add custom industry",
        variant: "destructive",
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name="industry"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Industry</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Combobox
                options={industries}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder={isLoading ? "Loading industries..." : "Select or type to add new industry"}
              />
              {customIndustry && (
                <div className="flex gap-2">
                  <Input
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="Enter custom industry"
                  />
                  <button
                    type="button"
                    onClick={handleCustomIndustryAdd}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}