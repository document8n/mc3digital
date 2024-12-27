import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminMenu from "@/components/AdminMenu";

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

const Admin = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-001", customer: "John Doe", amount: 1500, date: "2024-03-27", status: "paid" },
    { id: "INV-002", customer: "Jane Smith", amount: 2300, date: "2024-03-26", status: "pending" },
    { id: "INV-003", customer: "Bob Johnson", amount: 800, date: "2024-03-25", status: "overdue" },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    amount: "",
  });

  const handleCreateInvoice = () => {
    const invoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: newInvoice.customer,
      amount: Number(newInvoice.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({ customer: "", amount: "" });
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <AdminMenu />
      <div className="pl-64">
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              Logout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {invoices.filter(inv => inv.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Overdue Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {invoices.filter(inv => inv.status === 'overdue').length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create Invoice</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Customer Name</label>
                      <Input
                        value={newInvoice.customer}
                        onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Amount ($)</label>
                      <Input
                        type="number"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                        placeholder="Enter amount"
                      />
                    </div>
                    <Button onClick={handleCreateInvoice} className="w-full">
                      Create Invoice
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;