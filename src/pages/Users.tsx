import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Users() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      console.log("Fetching profiles...");
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      // Fetch auth users data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw authError;
      }

      // Combine profiles with auth data
      const enrichedProfiles = profiles.map(profile => ({
        ...profile,
        user: authUsers.users.find(user => user.id === profile.id)
      }));

      return enrichedProfiles;
    },
  });

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
                <TableHead className="text-gray-300">Phone</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile: any) => (
                <TableRow key={profile.id} className="hover:bg-white/10">
                  <TableCell className="text-gray-200">
                    {profile.username || "No username set"}
                  </TableCell>
                  <TableCell className="text-gray-200">
                    {profile.user?.email || "No email set"}
                  </TableCell>
                  <TableCell className="text-gray-200">
                    {profile.user?.phone || "No phone set"}
                  </TableCell>
                  <TableCell className="text-gray-200">{profile.role}</TableCell>
                  <TableCell className="text-gray-200">
                    {new Date(profile.created_at).toLocaleDateString()}
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