import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';

export default function UserResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const rationNumber = formData.get('rationNumber') as string;

    const storedUser = localStorage.getItem(`user_${rationNumber}`);

    if (!storedUser) {
      setError('No account found with this ration card number');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const userData = JSON.parse(storedUser);

    if (userData.headName !== name && userData.username !== name) {
      setError('Name does not match our records');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setVerifiedData(userData);
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setTimeout(() => setError(''), 3000);
      return;
    }

    verifiedData.password = newPassword;
    localStorage.setItem(`user_${verifiedData.rationNumber}`, JSON.stringify(verifiedData));

    setSuccess(true);
    setTimeout(() => {
      navigate('/user/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => navigate('/user/login')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back to Login</span>
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-5 shadow-lg">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-indigo-900 mb-2">Reset Password</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {step === 1 ? 'Verify your identity' : 'Create a new password'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Name / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name or username"
                    required
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rationNumber" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Ration Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  <input
                    type="text"
                    id="rationNumber"
                    name="rationNumber"
                    placeholder="e.g., KA29AB1234567890"
                    required
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-lg sm:rounded-xl text-center shadow-sm">
                  <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
              >
                Verify Identity
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-lg sm:rounded-xl text-center shadow-sm">
                  <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg sm:rounded-xl text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <p className="text-sm sm:text-base">Password reset successful! Redirecting...</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={success}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
