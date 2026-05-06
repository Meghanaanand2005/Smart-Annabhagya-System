import { useState } from 'react';
import { MessageCircle, X, Minimize2, HelpCircle, Calendar, UserPlus, LayoutDashboard, ChevronRight } from 'lucide-react';
import { getCurrentLanguage, getTranslation } from '../utils/translations';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDisabled, setIsDisabled] = useState(localStorage.getItem('chatbotDisabled') === 'true');
  const lang = getCurrentLanguage();
  const t = (key: string) => getTranslation(key, lang);

  const handleDisable = () => {
    localStorage.setItem('chatbotDisabled', 'true');
    setIsDisabled(true);
    setIsOpen(false);
  };

  if (isDisabled) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 group"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </div>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm">
            {t('needHelp')}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">{t('needHelp')}</h3>
            <p className="text-xs text-white/80">{t('askMe')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-900">{t('howCanIHelp')}</p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => {
                const currentPath = window.location.pathname;
                if (!currentPath.includes('dashboard')) {
                  window.location.href = '/user/login';
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{t('slotBookingHelp')}</p>
                  <p className="text-xs text-gray-500">Click here to book slot</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button
              onClick={() => {
                window.location.href = '/user/register';
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{t('registrationHelp')}</p>
                  <p className="text-xs text-gray-500">Click here to register</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button
              onClick={() => {
                const currentPath = window.location.pathname;
                if (currentPath.includes('user')) {
                  window.location.href = '/user/dashboard';
                } else if (currentPath.includes('distributor')) {
                  window.location.href = '/distributor/dashboard';
                } else if (currentPath.includes('admin')) {
                  window.location.href = '/admin/dashboard';
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{t('dashboardHelp')}</p>
                  <p className="text-xs text-gray-500">View your dashboard</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleDisable}
          className="w-full py-2 text-xs text-red-600 hover:text-red-700 transition-colors"
        >
          Disable Chatbot
        </button>
      </div>
    </div>
  );
}
