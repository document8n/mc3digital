import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthChangeEvent } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }
        
        if (session) {
          console.log("Active session found, checking user status...");
          const { data: privateData, error: privateError } = await supabase
            .from('user_private')
            .select('approved, role')
            .eq('id', session.user.id)
            .limit(1)
            .maybeSingle();

          if (privateError) {
            console.error("Error fetching user private data:", privateError);
            return;
          }

          if (!privateData || !privateData.approved) {
            console.log("User not approved");
            if (mounted) {
              toast({
                title: "Access Denied",
                description: "Your account is pending approval",
                variant: "destructive",
              });
              await supabase.auth.signOut();
            }
            return;
          }

          console.log("User approved, redirecting to admin...");
          if (mounted) {
            navigate('/admin');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: privateData, error: privateError } = await supabase
            .from('user_private')
            .select('approved, role')
            .eq('id', session.user.id)
            .limit(1)
            .maybeSingle();

          if (privateError) {
            console.error("Error fetching user private data:", privateError);
            return;
          }

          if (!privateData || !privateData.approved) {
            console.log("New user not approved");
            toast({
              title: "Access Denied",
              description: "Your account is pending approval",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            return;
          }

          console.log("User signed in successfully, redirecting to admin...");
          toast({
            title: "Welcome!",
            description: "Successfully signed in",
          });
          navigate('/admin');
        } catch (error) {
          console.error("Error in auth state change:", error);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Welcome to MC3digital
          </h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4F46E5',
                    brandAccent: '#4338CA',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
              },
            }}
            providers={[]}
            showLinks={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;