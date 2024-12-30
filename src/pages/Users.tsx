import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import AdminMenu from "@/components/AdminMenu";
import { useToast } from "@/hooks/use-toast";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Users() {
  const { toast } = useToast();

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      console.log("Fetching profiles...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Profiles fetched:", data);
      return data as Profile[];
    },
  });

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="min-h-screen">
        <AdminMenu />
        <div className="container mx-auto py-10">
          <div className="text-red-500">Failed to load users. Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminMenu />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.username || "No username set"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={profile.role === "admin" ? "destructive" : "default"}
                      >
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}