import { format } from "date-fns";

interface InvoiceHeaderProps {
  invoice: any;
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  return (
    <>
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
    </>
  );
}