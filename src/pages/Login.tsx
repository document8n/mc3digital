import { Header } from '@/components/Header';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Welcome to MC3digital
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white"
                placeholder="Enter your password"
              />
            </div>
            <button
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
            <div className="text-center space-y-2">
              <button className="text-sm text-gray-300 hover:text-white">
                Forgot Password?
              </button>
              <div className="text-sm text-gray-300">
                Don't have an account?{' '}
                <button className="text-indigo-400 hover:text-indigo-300">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;