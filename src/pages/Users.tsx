import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useToast } from "@/hooks/use-toast";
import { UserPublic, UserPrivate } from "@/types/user";

interface EnrichedUser extends UserPublic, UserPrivate {
  email?: string;
}

export default function Users() {
  const { toast } = useToast();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users data...");
      
      // Fetch public data
      const { data: publicData, error: publicError } = await supabase
        .from("user_public")
        .select("*")
        .order("created_at", { ascending: false });

      if (publicError) {
        console.error("Error fetching public user data:", publicError);
        throw publicError;
      }

      // Fetch private data
      const { data: privateData, error: privateError } = await supabase
        .from("user_private")
        .select("*");

      if (privateError) {
        console.error("Error fetching private user data:", privateError);
        throw privateError;
      }

      // Fetch auth data for emails
      const { data: { users: authUsers }, error: userError } = await supabase.functions.invoke(
        'get-users-data',
        {
          method: 'POST',
          body: {},
        }
      );
      
      if (userError) {
        console.error("Error fetching auth user data:", userError);
        throw userError;
      }

      // Combine all data
      const enrichedUsers: EnrichedUser[] = publicData.map(pub => ({
        ...pub,
        ...privateData.find(priv => priv.id === pub.id),
        email: authUsers.find((auth: any) => auth.id === pub.id)?.email
      }));

      console.log("Enriched users data:", enrichedUsers);
      return enrichedUsers;
    },
  });

  const handleApprovalToggle = async (userId: string, currentApproval: boolean) => {
    try {
      console.log(`Updating approval status for user ${userId} to ${!currentApproval}`);
      
      const { data, error } = await supabase
        .from('user_private')
        .update({ 
          approved: !currentApproval,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating user approval:', error);
        throw error;
      }

      if (!data) {
        throw new Error('User not found');
      }

      console.log('Update successful:', data);

      toast({
        title: "Success",
        description: `User ${!currentApproval ? 'approved' : 'unapproved'} successfully`,
      });

      // Refetch the data to update the UI
      await refetch();
    } catch (error) {
      console.error('Error updating user approval:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user approval status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
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
              {users?.map((user) => (
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
                      onCheckedChange={() => handleApprovalToggle(user.id, user.approved)}
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
      )}
    </AdminLayout>
  );
}