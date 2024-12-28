import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";
import { InvoiceFormFields } from "./invoice/InvoiceFormFields";

interface InvoiceFormProps {
  initialData?: any;
  clientId?: string;
  onSuccess?: () => void;
}

interface InvoiceFormValues {
  invoice_number: string;
  client_id: string;
  amount: number;
  status: string;
  due_date: Date;
  notes?: string;
  is_recurring: boolean;
  recurring_interval?: string;
  recurring_start_date?: Date;
  recurring_end_date?: Date;
  line_items: Array<{
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }>;
}

export function InvoiceForm({ initialData, clientId, onSuccess }: InvoiceFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  console.log("Initial form data:", initialData);

  const form = useForm<InvoiceFormValues>({
    defaultValues: {
      invoice_number: initialData?.invoice_number || "",
      client_id: initialData?.client_id || clientId || "",
      amount: initialData?.amount || 0,
      status: initialData?.status || "pending",
      due_date: initialData?.due_date ? new Date(initialData.due_date) : addDays(new Date(), 30),
      notes: initialData?.notes || "",
      is_recurring: initialData?.is_recurring || false,
      recurring_interval: initialData?.recurring_interval || "",
      recurring_start_date: initialData?.recurring_start_date ? new Date(initialData.recurring_start_date) : undefined,
      recurring_end_date: initialData?.recurring_end_date ? new Date(initialData.recurring_end_date) : undefined,
      line_items: initialData?.line_items || [],
    },
  });

  // Fetch clients when component mounts
  useState(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, business_name");
        
        if (error) {
          console.error("Error fetching clients:", error);
          toast({
            title: "Error",
            description: "Failed to fetch clients",
            variant: "destructive",
          });
          return;
        }
        
        setClients(data || []);
      } catch (error) {
        console.error("Error in fetchClients:", error);
      }
    };

    fetchClients();
  });

  const onSubmit = async (values: InvoiceFormValues) => {
    try {
      console.log("Submitting form with values:", values);
      setIsLoading(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const invoiceData = {
        invoice_number: values.invoice_number,
        client_id: values.client_id,
        amount: values.amount,
        status: values.status,
        due_date: format(values.due_date, 'yyyy-MM-dd'),
        notes: values.notes,
        user_id: userData.user.id,
        line_items: values.line_items,
        is_recurring: values.is_recurring,
        recurring_interval: values.recurring_interval,
        recurring_start_date: values.recurring_start_date ? format(values.recurring_start_date, 'yyyy-MM-dd') : null,
        recurring_end_date: values.recurring_end_date ? format(values.recurring_end_date, 'yyyy-MM-dd') : null,
      };

      console.log("Prepared invoice data:", invoiceData);

      let error;
      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('invoices')
          .insert([invoiceData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: initialData ? "Invoice updated successfully" : "Invoice created successfully",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/invoice");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InvoiceFormFields form={form} clients={clients} />
        
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Invoice" : "Create Invoice"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/invoice")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}