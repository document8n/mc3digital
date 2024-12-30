import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { AuthChangeEvent, ThemeMinimal } from '@supabase/auth-ui-shared';
import { ViewType } from '@supabase/auth-ui-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<ViewType>('sign_in');
  const [isCodeValid, setIsCodeValid] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User is already logged in, redirecting to admin...");
        navigate('/admin');
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_UP' && session) {
        console.log("User signed up, showing success message");
        toast({
          title: "Account created successfully!",
          description: "Welcome to MC3digital",
        });
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to admin...");
        navigate('/admin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Welcome Back
          </h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeMinimal,
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
            view={view}
            showLinks={view === 'sign_in' || isCodeValid}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;