import { useNavigate } from 'react-router-dom';
import { UserCircle, Store, Shield, Wheat } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl mb-5 sm:mb-6 shadow-2xl">
            <Wheat className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>
          <h1 className="text-indigo-900 mb-3 text-2xl sm:text-3xl md:text-4xl">Smart Anna Bhagya</h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-2">Digital Ration Distribution System</p>
          <p className="text-sm text-muted-foreground">Government of Karnataka Initiative</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <button
            onClick={() => navigate('/user/login')}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100 border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              <h3 className="text-indigo-900 mb-3">Ration Card Holder</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Book your ration slot online</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/distributor/login')}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100 border-2 border-transparent hover:border-green-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              </div>
              <h3 className="text-indigo-900 mb-3">Distributor</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Manage ration distribution</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100 border-2 border-transparent hover:border-purple-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
              </div>
              <h3 className="text-indigo-900 mb-3">Admin</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Monitor & manage system</p>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">New to the system?</p>
          <button
            onClick={() => navigate('/user/register')}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
          >
            Register for Ration Card
          </button>
        </div>
      </div>
    </div>
  );
}
