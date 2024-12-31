import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Mail, Shield, Clock, Check } from "lucide-react";

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'john@example.com',
    role: 'admin',
    approved: true,
    lastActive: '2024-03-20T10:30:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    role: 'user',
    approved: false,
    lastActive: '2024-03-19T15:45:00Z',
  },
  {
    id: '3',
    email: 'bob@example.com',
    role: 'user',
    approved: true,
    lastActive: '2024-03-21T08:15:00Z',
  },
];

export default function Users() {
  const formatLastActive = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
              </TableHead>
              <TableHead className="text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </span>
              </TableHead>
              <TableHead className="text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Approved
                </span>
              </TableHead>
              <TableHead className="text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Active
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-white/10">
                <TableCell className="text-gray-200">
                  {user.email}
                </TableCell>
                <TableCell className="text-gray-200">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-purple-500/20 text-purple-200' : 'bg-blue-500/20 text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-gray-200">
                  <Switch
                    checked={user.approved}
                    onCheckedChange={() => {}}
                  />
                </TableCell>
                <TableCell className="text-gray-200">
                  {formatLastActive(user.lastActive)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}