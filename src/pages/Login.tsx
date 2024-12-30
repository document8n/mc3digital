import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Header } from '@/components/Header';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signupCode, setSignupCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User already logged in, redirecting to admin");
        navigate('/admin');
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_UP') {
        // Verify signup code when user attempts to sign up
        const { data: settings } = await supabase
          .from('site_settings')
          .select('value')
          .eq('name', 'signup_code')
          .single();

        if (settings?.value !== signupCode) {
          // Invalid code, delete the user and show error
          if (session?.user) {
            await supabase.auth.admin.deleteUser(session.user.id);
          }
          toast({
            title: "Invalid Signup Code",
            description: "Please enter the correct signup code to register.",
            variant: "destructive",
          });
          return;
        }
      }

      if (session) {
        navigate('/admin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, signupCode, toast]);

  // Function to verify signup code
  const verifyCode = async (code: string) => {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('value')
      .eq('name', 'signup_code')
      .single();

    setIsCodeValid(settings?.value === code);
    setSignupCode(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <div className="pt-16 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Customer Portal</h2>
          {!isCodeValid && (
            <div className="mb-6">
              <label htmlFor="signupCode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Signup Code
              </label>
              <input
                type="text"
                id="signupCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => verifyCode(e.target.value)}
                placeholder="Enter code to register"
              />
            </div>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1A1F2C',
                    brandAccent: '#2A2F3C'
                  }
                }
              }
            }}
            providers={[]}
            view="sign_in"
            showLinks={isCodeValid}
            redirectTo={`${window.location.origin}/admin`}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;