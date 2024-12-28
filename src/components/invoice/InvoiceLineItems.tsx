import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface InvoiceLineItemsProps {
  form: UseFormReturn<any>;
}

export function InvoiceLineItems({ form }: InvoiceLineItemsProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>(
    form.getValues("line_items") || []
  );

  const addLineItem = () => {
    const newLineItems = [
      ...lineItems,
      { description: "", quantity: 1, price: 0, amount: 0 },
    ];
    setLineItems(newLineItems);
    form.setValue("line_items", newLineItems);
    updateTotalAmount(newLineItems);
  };

  const removeLineItem = (index: number) => {
    const newLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newLineItems);
    form.setValue("line_items", newLineItems);
    updateTotalAmount(newLineItems);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newLineItems = [...lineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value,
    };

    // Calculate amount
    if (field === "quantity" || field === "price") {
      newLineItems[index].amount =
        Number(newLineItems[index].quantity) * Number(newLineItems[index].price);
    }

    setLineItems(newLineItems);
    form.setValue("line_items", newLineItems);
    updateTotalAmount(newLineItems);
  };

  const updateTotalAmount = (items: LineItem[]) => {
    const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
    form.setValue("amount", total);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Line Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLineItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {lineItems.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-4 items-center border p-4 rounded-lg"
        >
          <div className="col-span-4">
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                updateLineItem(index, "description", e.target.value)
              }
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                updateLineItem(index, "quantity", parseFloat(e.target.value))
              }
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                updateLineItem(index, "price", parseFloat(e.target.value))
              }
            />
          </div>
          <div className="col-span-3">
            <Input
              type="number"
              value={item.amount}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="col-span-1 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLineItem(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}