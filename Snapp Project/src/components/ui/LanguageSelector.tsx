import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="relative group">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Globe className="w-5 h-5" />
      </button>
      
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map(({ code, name }) => (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
              i18n.language === code ? 'text-indigo-600 font-medium' : 'text-gray-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}