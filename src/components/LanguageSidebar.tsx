import { LANGUAGES } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface LanguageSidebarProps {
  theme: 'dark' | 'light';
  currentLanguageId: string;
  onLanguageSelect: (languageId: string) => void;
}

export default function LanguageSidebar({ theme, currentLanguageId, onLanguageSelect }: LanguageSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-r transition-all flex flex-col`}
    >
      <div className={`p-4 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} border-b flex justify-between items-center`}>
        {!isCollapsed && (
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Languages
          </h3>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {LANGUAGES.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect(language.id)}
            className={`w-full p-4 flex items-center space-x-3 transition-colors ${
              currentLanguageId === language.id
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={language.name}
          >
            <img
              src={language.icon}
              alt={`${language.name} icon`}
              className="w-6 h-6"
            />
            {!isCollapsed && (
              <span className="font-medium text-left">{language.name}</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
