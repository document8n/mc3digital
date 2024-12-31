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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Users() {
  const { toast } = useToast();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users data...');
      
      // Fetch user_private data
      const { data: privateData, error: privateError } = await supabase
        .from('user_private')
        .select('*');

      if (privateError) {
        console.error('Error fetching private user data:', privateError);
        toast({
          title: "Error",
          description: "Could not load users. Please try again later.",
          variant: "destructive",
        });
        throw privateError;
      }

      // Fetch corresponding user_public data
      const { data: publicData, error: publicError } = await supabase
        .from('user_public')
        .select('*');

      if (publicError) {
        console.error('Error fetching public user data:', publicError);
        toast({
          title: "Error",
          description: "Could not load users. Please try again later.",
          variant: "destructive",
        });
        throw publicError;
      }

      // Combine the data
      const combinedData = privateData.map(privateUser => ({
        ...privateUser,
        user_public: publicData.find(publicUser => publicUser.id === privateUser.id)
      }));

      console.log('Users data fetched:', combinedData);
      return combinedData;
    },
  });

  const formatLastActive = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
              </TableHead>
              <TableHead className="text-gray-300">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Role</span>
                </div>
              </TableHead>
              <TableHead className="text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Approved</span>
                </div>
              </TableHead>
              <TableHead className="text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last Active</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="hover:bg-white/10">
                <TableCell className="text-gray-200">
                  {user.user_public?.username}
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
                  {formatLastActive(user.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}