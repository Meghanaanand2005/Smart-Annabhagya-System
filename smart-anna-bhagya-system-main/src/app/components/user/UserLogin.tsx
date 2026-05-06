import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, CreditCard, ArrowLeft, LogIn } from 'lucide-react';
import { AuthContextType } from '../../App';

interface Props {
  authContext: AuthContextType;
}

export default function UserLogin({ authContext }: Props) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const rationNumber = formData.get('rationNumber') as string;

    // Mock API call - retrieve from localStorage
    const storedUser = localStorage.getItem(`user_${rationNumber}`);

    if (!storedUser) {
      setError('Invalid ration card number. Please register first.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const userData = JSON.parse(storedUser);

    if (userData.password !== password) {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // ✅ CLEAN BOTH VALUES
const cleanInput = name.trim().toLowerCase();
const cleanHead = userData.headName?.trim().toLowerCase();
const cleanUsername = userData.username?.trim().toLowerCase();

// ✅ COMPARE PROPERLY
if (cleanInput !== cleanHead && cleanInput !== cleanUsername) {
  setError('Name does not match our records');
  setTimeout(() => setError(''), 3000);
  return;
}

    // Login successful
    authContext.login('user', userData);
    navigate('/user/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-5 shadow-lg">
              <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-indigo-900 mb-2">User Login</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Access your ration card account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                Name (Head or Family Member)
              </label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name or username"
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rationNumber" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                Ration Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <input
                  type="text"
                  id="rationNumber"
                  name="rationNumber"
                  placeholder="e.g., KA29AB1234567890"
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/user/reset-password')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-lg sm:rounded-xl text-center shadow-sm">
                <p className="text-red-700 text-sm sm:text-base">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
            >
              Login to Dashboard
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/user/register')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
