import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          navigate('/login');
          return;
        }
        
        if (!session) {
          console.log("No active session found, redirecting to login");
          toast({
            title: "Access Denied",
            description: "Please log in to access this area",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Check if user is approved
        const { data: privateData, error: privateError } = await supabase
          .from('user_private')
          .select('approved, role')
          .eq('id', session.user.id)
          .single();

        if (privateError) {
          console.error("Error fetching user private data:", privateError);
          navigate('/login');
          return;
        }

        if (!privateData.approved) {
          console.log("User not approved, redirecting to login");
          toast({
            title: "Account Pending Approval",
            description: "Your account is pending approval by an administrator.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        console.log("Valid session found and user approved, allowing access");
        setIsLoading(false);
      } catch (error) {
        console.error("Session check failed:", error);
        navigate('/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in ProtectedRoute:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session lost, redirecting to login");
        navigate('/login');
        return;
      }
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, checking approval status");
        checkAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;