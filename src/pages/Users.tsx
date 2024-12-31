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

// Mock data for UI development
const mockUsers = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    approved: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    role: 'admin',
    approved: false,
    created_at: '2024-01-02T00:00:00Z'
  }
];

export default function Users() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Username</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Approved</TableHead>
              <TableHead className="text-gray-300">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-white/10">
                <TableCell className="text-gray-200">
                  {user.username || "No username set"}
                </TableCell>
                <TableCell className="text-gray-200">
                  {user.email || "No email set"}
                </TableCell>
                <TableCell className="text-gray-200">{user.role}</TableCell>
                <TableCell className="text-gray-200">
                  <Switch
                    checked={user.approved}
                    onCheckedChange={() => {
                      console.log('Toggle approval for user:', user.id);
                    }}
                  />
                </TableCell>
                <TableCell className="text-gray-200">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}