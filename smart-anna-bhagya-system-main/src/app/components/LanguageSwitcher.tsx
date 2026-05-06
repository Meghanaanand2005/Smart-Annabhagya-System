import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { languageNames, getCurrentLanguage, setCurrentLanguage } from '../utils/translations';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setCurrentLang(lang);
    setIsOpen(false);
    window.location.reload(); // Reload to apply translations
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="language-switcher relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded-lg hover:bg-white transition-all shadow-sm border border-gray-200"
      >
        <Globe className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-indigo-900">{languageNames[currentLang]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[180px] max-h-[400px] overflow-y-auto">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors ${
                currentLang === code ? 'bg-indigo-100 text-indigo-900 font-medium' : 'text-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
