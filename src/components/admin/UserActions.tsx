import { Link, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const UserActions = ({ onActionClick }: { onActionClick?: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First clear any local session state
      await supabase.auth.signOut({ scope: 'local' });
      
      console.log("Local session cleared, redirecting to home...");
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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