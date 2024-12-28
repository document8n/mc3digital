import { Link, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const UserActions = ({ onActionClick }: { onActionClick?: () => void }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "There was a problem logging out",
        variant: "destructive",
      });
      return;
    }
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <div className="mt-auto">
      <button
        onClick={() => {
          handleLogout();
          onActionClick?.();
        }}
        className="flex items-center space-x-2 px-3 py-2 mb-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-sidebar-accent w-full"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>

      <Link
        to="/"
        onClick={onActionClick}
        className="flex items-center space-x-2 px-3 py-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-sidebar-accent"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Site</span>
      </Link>
    </div>
  );
};