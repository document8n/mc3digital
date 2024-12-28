import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InvoiceFormLineItemsProps {
  form: UseFormReturn<any>;
}

export function InvoiceFormLineItems({ form }: InvoiceFormLineItemsProps) {
  const [lineItems, setLineItems] = useState(form.getValues("line_items") || []);

  const addLineItem = () => {
    const newLineItems = [
      ...lineItems,
      { description: "", quantity: 1, price: 0, amount: 0 }
    ];
    setLineItems(newLineItems);
    form.setValue("line_items", newLineItems);
    updateTotal(newLineItems);
  };

  const removeLineItem = (index: number) => {
    const newLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newLineItems);
    form.setValue("line_items", newLineItems);
    updateTotal(newLineItems);
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    const newLineItems = [...lineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value,
      amount: field === "quantity" || field === "price"
        ? Number(field === "quantity" ? value : newLineItems[index].quantity) * 
          Number(field === "price" ? value : newLineItems[index].price)
        : newLineItems[index].amount
    };
    setLineItems(newLineItems);
    form.setValue("line_items", newLineItems);
    updateTotal(newLineItems);
  };

  const updateTotal = (items: any[]) => {
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    form.setValue("amount", total);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Line Items</h3>
        <Button type="button" variant="outline" onClick={addLineItem}>
          Add Item
        </Button>
      </div>
      
      {lineItems.map((item: any, index: number) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-5">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="col-span-2">
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="col-span-2">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateLineItem(index, "price", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="col-span-2">
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={item.amount}
                  disabled
                  className="bg-gray-50"
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="col-span-1 pt-8">
            <Button
              type="button"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={() => removeLineItem(index)}
            >
              ×
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}