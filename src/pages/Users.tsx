import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  role: 'admin' | 'user';
  approved: boolean;
  created_at: string;
  email: string;
  last_sign_in_at: string | null;
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from admin_users_view...');
      const { data: userData, error } = await supabase
        .from('admin_users_view')
        .select('*');

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }

      console.log('User data:', userData);
      setUsers(userData || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Make sure you have admin privileges.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalToggle = async (userId: string, currentApproval: boolean) => {
    try {
      console.log('Toggling approval for user:', userId);
      const { error } = await supabase
        .from('user_private')
        .update({ approved: !currentApproval })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user approval:', error);
        toast({
          title: "Error",
          description: "Failed to update user approval status",
          variant: "destructive",
        });
        return;
      }

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, approved: !currentApproval }
          : user
      ));

      toast({
        title: "Success",
        description: `User ${!currentApproval ? 'approved' : 'unapproved'} successfully`,
      });
    } catch (error) {
      console.error('Error in handleApprovalToggle:', error);
      toast({
        title: "Error",
        description: "Failed to update user approval status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Approved</TableHead>
                <TableHead className="text-gray-300">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-white/10">
                  <TableCell className="text-gray-200">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-gray-200">{user.role}</TableCell>
                  <TableCell className="text-gray-200">
                    <Switch
                      checked={user.approved}
                      onCheckedChange={() => handleApprovalToggle(user.id, user.approved)}
                    />
                  </TableCell>
                  <TableCell className="text-gray-200">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
