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
      
      // First check if we have an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        toast({
          title: "Error",
          description: "There was an issue checking your session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!session) {
        console.log("No active session found, redirecting to login...");
        navigate('/login');
        return;
      }

      // Perform the signOut operation without any scope parameter
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        toast({
          title: "Warning",
          description: "There was an issue during logout. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Logout successful, redirecting to login...");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/login');
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