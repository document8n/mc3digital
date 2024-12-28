import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvoiceForm } from "@/components/InvoiceForm";
import { ArrowLeft, Printer, PenLine } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface InvoiceActionsProps {
  invoice: any;
  onUpdate: () => void;
  onPrint: () => void;
}

export function InvoiceActions({ invoice, onUpdate, onPrint }: InvoiceActionsProps) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    onUpdate();
  };

  return (
    <div className="flex justify-between items-center mb-8 print:hidden">
      <Button
        variant="outline"
        onClick={() => navigate('/invoice')}
        className="text-gray-900 bg-white hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Invoices
      </Button>
      <div className="flex gap-2">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <PenLine className="h-4 w-4 mr-2" />
              Edit Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm 
              initialData={invoice} 
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
        <Button onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
      </div>
    </div>
  );
}