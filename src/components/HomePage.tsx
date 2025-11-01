import { LANGUAGES } from '../types';
import Header from './Header';
import Footer from './Footer';

interface HomePageProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onLanguageSelect: (languageId: string) => void;
}

export default function HomePage({ theme, onThemeToggle, onLanguageSelect }: HomePageProps) {
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} transition-colors`}>
      <Header theme={theme} onThemeToggle={onThemeToggle} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6">
           
            <img className={`w-10 h-10 `}src="/compiler.png" alt="" />
            <h1 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Code, Compile, and Execute — Instantly.
            </h1>
            <img className={`w-10 h-10 `}src="/compiler.png" alt="" />
            
          </div>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Build, test, and share your code seamlessly in 15+ programming languages — no setup needed.
          </p>
        </div>

        <div id="languages" className="scroll-mt-20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Start Coding in Your Language
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {LANGUAGES.map((language) => (
              <button
              key={language.id}
              onClick={() => onLanguageSelect(language.id)}
              className={`group relative p-6 rounded-2xl border-4 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 hover:from-purple-900 hover:to-blue-900 border-gray-700 hover:border-purple-500 text-white'
                  : 'bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 border-gray-200 hover:border-blue-400 text-gray-900'
              } transform animate-fadeInUp`}
              style={{
                animationDelay: `${Number(language.id) * 0.1}s`, // Staggered entrance for a list of buttons
              }}
              >
              {/* Ripple effect overlay */}
              <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 rounded-2xl transition-opacity duration-200 pointer-events-none"></span>
              
              {/* Icon (now rendered as an image) */}
              <div className="flex items-center justify-center mb-2">
                <img
                  src={language.icon}
                  alt={`${language.name} icon`}
                  className="w-8 h-8 group-hover:animate-bounce"
                />
              </div>
              
              {/* Language Name */}
              <div className="text-center">
                <h3 className="text-lg font-bold tracking-wide drop-shadow-sm group-hover:text-shadow-lg">
                  {language.name}
                </h3>
                <p className="text-sm opacity-70 mt-1 group-hover:opacity-100 transition-opacity">
                  Select this language
                </p>
              </div>
            </button>
            ))}
          </div>
        </div>

        <div className={`mt-16 p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
          <h3 className={`text-2xl flex item-center justify-center  font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <img
                  src="/time.png"
                  alt="Lightning bolt icon for instant execution"
                  className="w-12 h-12 mb-2"
                />
              <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Run Code Instantly
              </h4>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No Setup, No Downloads,<br/> Right from Your Browser.
              </p>
            </div>
            <div>
              <img
                  src="/image.png"
                  alt="Lightning bolt icon for instant execution"
                  className="w-12 h-12 mb-2"
                />
              <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Clean & Intuitive Editor
              </h4>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Get the power of syntax highlighting, auto-formatting, and a modern coding experience.
              </p>
            </div>
            <div>
              <img
                  src="/secure.png"
                  alt="Lightning bolt icon for instant execution"
                  className="w-12 h-12 mb-2"
                />
              <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Secure & Fast
              </h4>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Your code runs securely in an isolated sandbox with lightning-fast execution.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}