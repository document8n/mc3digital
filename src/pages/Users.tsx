import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import AdminMenu from "@/components/AdminMenu";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Users() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      console.log("Fetching profiles...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <AdminMenu />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50 px-6 py-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium text-gray-500">Username</div>
                  <div className="font-medium text-gray-500">Role</div>
                  <div className="font-medium text-gray-500">Created</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 bg-white">
                {profiles?.map((profile) => (
                  <div key={profile.id} className="px-6 py-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm text-gray-900">
                        {profile.username || "No username set"}
                      </div>
                      <div className="text-sm text-gray-900">
                        {profile.role}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}