import { useState } from 'react';
import { Globe } from 'lucide-react';
import { languageNames, setCurrentLanguage } from '../utils/translations';

interface Props {
  onLanguageSelected: () => void;
}

export default function LanguageSelector({ onLanguageSelected }: Props) {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleContinue = () => {
    setCurrentLanguage(selectedLang);
    onLanguageSelected();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl mb-6 shadow-2xl">
            <Globe className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-indigo-900 mb-3">Select Your Language</h1>
          <p className="text-lg text-indigo-900 mb-1">अपनी भाषा चुनें</p>
          <p className="text-lg text-indigo-900">ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => setSelectedLang(code)}
              className={`p-4 sm:p-5 rounded-xl transition-all duration-200 ${
                selectedLang === code
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <p className="text-base sm:text-lg font-medium text-center">{name}</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-lg"
        >
          Continue / जारी रखें / ಮುಂದುವರಿಸಿ
        </button>
      </div>
    </div>
  );
}
