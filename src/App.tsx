import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import CompilerPage from './components/CompilerPage';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'compiler'>('home');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const updateViewFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      const codeParam = params.get('code');

      if (langParam) {
        setSelectedLanguage(langParam);
        setCurrentView('compiler');
      } else {
        setCurrentView('home');
      }

      if (codeParam) {
        try {
          const decodedCode = decodeURIComponent(codeParam);
          localStorage.setItem(`code-${langParam}`, decodedCode);
        } catch (error) {
          console.error('Failed to decode shared code:', error);
        }
      }
    };

    updateViewFromURL();

    const handlePopState = () => {
      updateViewFromURL();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    setCurrentView('compiler');
    window.history.pushState({}, '', `?lang=${languageId}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {currentView === 'home' ? (
        <HomePage
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onLanguageSelect={handleLanguageSelect}
        />
      ) : (
        <CompilerPage
          languageId={selectedLanguage}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onLanguageChange={handleLanguageSelect}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
