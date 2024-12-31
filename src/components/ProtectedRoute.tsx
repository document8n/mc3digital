import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            toast({
              title: "Authentication Error",
              description: "Please try logging in again",
              variant: "destructive",
            });
            navigate('/login');
          }
          return;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            navigate('/login');
          }
          return;
        }

        try {
          console.log("Checking user approval status...");
          const { data: privateData, error: privateError } = await supabase
            .from('user_private')
            .select('approved, role')
            .eq('id', session.user.id)
            .limit(1)
            .maybeSingle();

          if (privateError) {
            console.error("Error fetching user private data:", privateError);
            if (mounted) {
              toast({
                title: "Error",
                description: "Unable to verify account status",
                variant: "destructive",
              });
              await supabase.auth.signOut();
              navigate('/login');
            }
            return;
          }

          if (!privateData || !privateData.approved) {
            console.log("User not approved or data not found");
            if (mounted) {
              toast({
                title: "Access Denied",
                description: "Your account is pending approval",
                variant: "destructive",
              });
              await supabase.auth.signOut();
              navigate('/login');
            }
            return;
          }

          console.log("User approved, allowing access");
          if (mounted) {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error in approval check:", error);
          if (mounted) {
            toast({
              title: "Error",
              description: "An error occurred while checking your account status",
              variant: "destructive",
            });
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) {
          navigate('/login');
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
        return;
      }
      if (event === 'SIGNED_IN') {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;