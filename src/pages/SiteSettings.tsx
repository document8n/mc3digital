import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminMenu from "@/components/AdminMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SiteSettings() {
  const [newSettingName, setNewSettingName] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");
  const { toast } = useToast();

  const { data: settings, refetch } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      console.log("Fetching site settings...");
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching settings:", error);
        throw error;
      }

      return data;
    },
  });

  const handleAddSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("site_settings")
        .insert([{ name: newSettingName, value: newSettingValue }]);

      if (error) throw error;

      toast({
        title: "Setting Added",
        description: "The new setting has been added successfully.",
      });

      setNewSettingName("");
      setNewSettingValue("");
      refetch();
    } catch (error) {
      console.error("Error adding setting:", error);
      toast({
        title: "Error",
        description: "Failed to add the setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSetting = async (id: string, name: string, value: string) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Setting Updated",
        description: "The setting has been updated successfully.",
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        title: "Error",
        description: "Failed to update the setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <AdminMenu />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

        <div className="grid gap-6">
          {/* Add New Setting Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Add New Setting</h2>
            <form onSubmit={handleAddSetting} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settingName">Setting Name</Label>
                  <Input
                    id="settingName"
                    value={newSettingName}
                    onChange={(e) => setNewSettingName(e.target.value)}
                    placeholder="Enter setting name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settingValue">Setting Value</Label>
                  <Input
                    id="settingValue"
                    value={newSettingValue}
                    onChange={(e) => setNewSettingValue(e.target.value)}
                    placeholder="Enter setting value"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                Add Setting
              </button>
            </form>
          </div>

          {/* Existing Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Existing Settings</h2>
            <div className="space-y-4">
              {settings?.map((setting) => (
                <div
                  key={setting.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded"
                >
                  <div>
                    <Label>Name</Label>
                    <div className="font-medium">{setting.name}</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`value-${setting.id}`}>Value</Label>
                    <Input
                      id={`value-${setting.id}`}
                      defaultValue={setting.value}
                      onBlur={(e) =>
                        handleUpdateSetting(setting.id, setting.name, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
