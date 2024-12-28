import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";
import AdminMenu from "@/components/AdminMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: invoice, isLoading } = useQuery({
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "pt-16" : "ml-64"
      )}>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/invoice')}
              className="text-gray-900 bg-white hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
            <Button
              onClick={handlePrint}
              className="print:hidden"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>

          {/* Invoice Preview */}
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            {/* Company Branding */}
            <div className="flex items-center mb-8">
              <img 
                src="/mc3digital-logo.png" 
                alt="mc3digital logo" 
                className="h-12 w-auto mr-3"
              />
              <span className="text-xl font-semibold">mc3digital</span>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                <p className="text-gray-600">#{invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{invoice.clients.business_name}</div>
                <div className="text-gray-600">
                  {invoice.clients.address_line1}<br />
                  {invoice.clients.address_line2 && <>{invoice.clients.address_line2}<br /></>}
                  {invoice.clients.city}, {invoice.clients.state} {invoice.clients.postal_code}<br />
                  {invoice.clients.country}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-gray-600 mb-1">Date Issued</div>
                <div>{format(new Date(invoice.created_at), 'MMMM dd, yyyy')}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Due Date</div>
                <div>{format(new Date(invoice.due_date), 'MMMM dd, yyyy')}</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3">Description</th>
                    <th className="text-right py-3">Quantity</th>
                    <th className="text-right py-3">Price</th>
                    <th className="text-right py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">{item.description}</td>
                      <td className="text-right py-3">{item.quantity}</td>
                      <td className="text-right py-3">${item.price.toFixed(2)}</td>
                      <td className="text-right py-3">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-4 font-semibold">Total</td>
                    <td className="text-right py-4 font-semibold">
                      ${Number(invoice.amount).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
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