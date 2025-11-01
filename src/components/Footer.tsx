interface FooterProps {
  theme: 'dark' | 'light';
}

export default function Footer({ theme }: FooterProps) {
  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-t transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              CodeSphere
            </h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Run code instantly in your favorite programming language
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  Home
                </a>
              </li>
              <li>
                <a href="/#languages" className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  Compilers
                </a>
              </li>
             
              
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Compilers
            </h4>
            <div className="flex flex-col ">
              <a
                href="https://github.com"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                Python
              </a>
              <a
                href="https://linkedin.com"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                JavaScript
              </a>
              <a
                href="https://twitter.com"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                TypeScript
              </a>
               <a
                href="https://twitter.com"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                Java
              </a>
               <a
                href="https://twitter.com"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                C
              </a>
               <a
                href="https://twitter.com"
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                C++
              </a>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>&copy; 2025 CodeSphere. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
}
