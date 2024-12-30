import { Link, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const UserActions = ({ onActionClick }: { onActionClick?: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // First try to get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session found, redirecting to login...");
        navigate('/login');
        return;
      }

      // Clear browser storage first
      console.log("Clearing browser storage...");
      await supabase.auth.clearSession();
      
      // Then attempt to sign out
      console.log("Attempting to sign out...");
      const { error } = await supabase.auth.signOut({
        scope: 'local'
      });
      
      if (error) {
        console.error("Error during sign out:", error);
        // Even if there's an error, we'll redirect to login
        navigate('/login');
        toast({
          title: "Warning",
          description: "There might have been an issue during logout. Please check your login status.",
          variant: "destructive",
        });
        return;
      }

      console.log("Logout successful, redirecting to home...");
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      navigate('/login');
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