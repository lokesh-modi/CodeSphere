import { Code2, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  languageName?: string;
}

export default function Header({ theme, onThemeToggle, languageName }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <a href="/" className="flex items-center space-x-2 group">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} group-hover:scale-110 transition-transform`}>
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              CodeSphere
            </span>
            {languageName && (
              <>
                <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>—</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {languageName} Compiler
                </span>
              </>
            )}
          </a>

          <nav className="flex items-center space-x-6">
            <a href="/#" className={`hover:${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Home
            </a>
            <a href="/#languages" className={`hover:${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Compilers
            </a>
            
            

            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
