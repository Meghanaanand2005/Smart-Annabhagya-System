import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft, Store } from 'lucide-react';
import { AuthContextType } from '../../App';

interface Props {
  authContext: AuthContextType;
}

// Mock distributor credentials
const mockDistributors = {
  'dist001': { username: 'dist001', password: 'admin123', name: 'Bangalore Central', district: 'Bangalore Urban' },
  'dist002': { username: 'dist002', password: 'admin123', name: 'Mysore Main', district: 'Mysore' },
};

export default function DistributorLogin({ authContext }: Props) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const distributor = mockDistributors[username as keyof typeof mockDistributors];

    if (!distributor) {
      setError('Invalid distributor ID');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (distributor.password !== password) {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000);
      return;
    }

    authContext.login('distributor', distributor);
    navigate('/distributor/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-5 shadow-lg">
              <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-indigo-900 mb-2">Distributor Login</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Access your distribution center dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                Distributor ID
              </label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter distributor ID (e.g., dist001)"
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-green-50 rounded-lg sm:rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-green-50 rounded-lg sm:rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>ID: dist001 | Password: admin123</p>
              <p>ID: dist002 | Password: admin123</p>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-lg sm:rounded-xl text-center shadow-sm">
                <p className="text-red-700 text-sm sm:text-base">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
