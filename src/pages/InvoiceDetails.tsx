import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminMenu from "@/components/AdminMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { InvoiceBranding } from "@/components/invoice/InvoiceBranding";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceLineItems } from "@/components/invoice/InvoiceLineItems";

const InvoiceDetails = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const { data: invoice, isLoading, refetch } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      console.log("Fetching invoice details for id:", id);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            business_name,
            contact_name,
            email,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log("Fetched invoice:", data);
      return data;
    },
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  // Parse line_items if it's a string
  const lineItems = typeof invoice.line_items === 'string' 
    ? JSON.parse(invoice.line_items) 
    : invoice.line_items;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 print:bg-white print:min-h-0">
      <div className="print:hidden">
        <AdminMenu />
      </div>
      <div className={cn(
        "transition-all duration-300 print:m-0 print:p-0",
        isMobile ? "pt-16" : "ml-64"
      )}>
        <div className="dashboard-container print:p-0 print:max-w-none">
          <InvoiceActions 
            invoice={invoice} 
            onUpdate={refetch} 
            onPrint={handlePrint}
          />

          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg print:shadow-none print:rounded-none">
            <InvoiceBranding />
            <InvoiceHeader invoice={invoice} />
            <InvoiceLineItems 
              lineItems={lineItems} 
              totalAmount={invoice.amount} 
            />

            {invoice.notes && (
              <div className="border-t border-gray-200 pt-4">
                <div className="text-gray-600 mb-2">Notes</div>
                <div className="text-gray-800">{invoice.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;