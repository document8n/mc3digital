import { Link, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const UserActions = ({ onActionClick }: { onActionClick?: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        // If there's an error checking the session, just redirect to login
        navigate('/login');
        return;
      }

      if (!session) {
        console.log("No active session found, redirecting to login...");
        navigate('/login');
        return;
      }

      // We have a valid session, proceed with logout
      console.log("Active session found, proceeding with logout...");
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Error during sign out:", signOutError);
        // Even if there's an error, we'll redirect to login for safety
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
      // For any unexpected errors, redirect to login for safety
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