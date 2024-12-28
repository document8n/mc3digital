interface LineItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface InvoiceLineItemsProps {
  lineItems: LineItem[];
  totalAmount: number;
}

export function InvoiceLineItems({ lineItems = [], totalAmount }: InvoiceLineItemsProps) {
  return (
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
          {lineItems.map((item, index) => (
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
              ${Number(totalAmount).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}