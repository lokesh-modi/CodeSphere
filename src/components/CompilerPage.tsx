// src/components/CompilerPage.tsx
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Share2, Settings, Maximize2, Minimize2, Check } from 'lucide-react';
import { LANGUAGES } from '../types';
import Header from './Header';
import LanguageSidebar from './LanguageSidebar';

interface CompilerPageProps {
  languageId: string;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onLanguageChange: (languageId: string) => void;
}

export default function CompilerPage({
  languageId,
  theme,
  onThemeToggle,
  onLanguageChange,
}: CompilerPageProps) {
  const language = LANGUAGES.find((lang) => lang.id === languageId) || LANGUAGES[0];
  const [code, setCode] = useState<string>(language.defaultCode);
  const [output, setOutput] = useState<string>('');
  const [accumulatedStdin, setAccumulatedStdin] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const outputEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // define handleRun before the effect that references it
  const handleRun = async () => {
    setOutput('');
    setAccumulatedStdin([]);
    setCurrentInput('');
    setWaitingForInput(false);
    await executeCode('');
  };

  useEffect(() => {
    const newLanguage = LANGUAGES.find((lang) => lang.id === languageId);
    if (newLanguage) {
      setCode(newLanguage.defaultCode);
      setOutput('');
      setAccumulatedStdin([]);
      setCurrentInput('');
      setWaitingForInput(false);
    }
  }, [languageId]);

  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, waitingForInput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        try {
          localStorage.setItem(`code-${languageId}`, code);
        } catch {
          // ignore storage errors
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, languageId, handleRun]);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${languageId}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [languageId]);

  const executeCode = async (stdinData: string = '') => {
    setIsRunning(true);

    try {
      const response = await fetch('https://code-share-backend-ta0y.onrender.com/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: code,
          language: (language as any).jdoodleCode,
          versionIndex: (language as any).versionIndex,
          stdin: stdinData,
        }),
      });

      const data = (await response.json()) as any;

      // helpers
      const extractPrompt = (text: string): string | null => {
        const lines = text.split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
          const line = lines[i].trim();
          if (/[:?]\s*$/.test(line) || /Enter\s+\w+[\s:]+$/i.test(line)) {
            return line;
          }
        }
        return null;
      };

      const formatOutputWithInputs = (outputText: string, stdinArray: string[]): string => {
        if (stdinArray.length === 0) return outputText;
        const lines = outputText.split('\n');
        const stdinLines = [...stdinArray];
        let stdinIndex = 0;
        const formattedLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          formattedLines.push(line);

          if (/[:?]\s*$/.test(line.trim()) || /Enter\s+\w+[\s:]+$/i.test(line.trim())) {
            if (stdinIndex < stdinLines.length) {
              // append input inline
              formattedLines[formattedLines.length - 1] = line + stdinLines[stdinIndex];
              stdinIndex++;
            }
          }
        }

        return formattedLines.join('\n');
      };

      // handle different returned shapes
      if (data.error && data.output && data.hasOutput) {
        const outputText = String(data.output).trimEnd();
        const isEOFError = String(data.error).includes('EOFError') || String(data.error).includes('EOF when reading');

        if (isEOFError) {
          const lines = outputText.split('\n');
          const tracebackIndex = lines.findIndex((l: string) => l.includes('Traceback'));

          let cleanOutput = outputText;
          if (tracebackIndex >= 0) {
            cleanOutput = lines.slice(0, tracebackIndex).join('\n').trimEnd();
          }

          const formattedOutput = formatOutputWithInputs(cleanOutput, accumulatedStdin);
          setOutput(formattedOutput);
          setWaitingForInput(true);
        } else {
          setOutput(outputText + '\n\nError: ' + String(data.error));
          setWaitingForInput(false);
        }
      } else if (data.error) {
        const errStr = String(data.error);
        const isEOFError = errStr.includes('EOFError') || errStr.includes('EOF when reading');

        if (isEOFError) {
          const errorLines = errStr.split('\n');
          const prompt = extractPrompt(errStr) ||
                         errorLines.find((line: string) => /Enter\s+\w+[\s:]+$/i.test(line)) ||
                         errorLines.find((line: string) => /[:?]\s*$/.test(line.trim()));

          if (prompt) {
            setOutput(prompt);
            setWaitingForInput(true);
          } else {
            const firstLine = errorLines[0]?.trim();
            if (firstLine && !firstLine.includes('Traceback') && !firstLine.includes('File')) {
              setOutput(firstLine);
            } else {
              setOutput('Waiting for input...');
            }
            setWaitingForInput(true);
          }
        } else {
          setOutput(errStr);
          setWaitingForInput(false);
        }
      } else if (data.output) {
        const outputText = String(data.output).trimEnd();
        const hasTraceback = outputText.includes('Traceback') || outputText.includes('File "');

        if (hasTraceback) {
          const lines = outputText.split('\n');

          if (stdinData !== '') {
            // provided input: show content up to traceback and determine whether next prompt requires input
            const promptLines: string[] = [];
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.includes('Traceback')) break;
              const trimmed = line.trim();
              if ((/[:?]\s*$/.test(trimmed) || /Enter\s+\w+[\s:]+$/i.test(trimmed))
                && !trimmed.includes('Traceback') && !trimmed.includes('File')) {
                promptLines.push(trimmed);
              }
            }

            const lastPrompt = promptLines[promptLines.length - 1];
            const tracebackIndex = lines.findIndex((l: string) => l.includes('Traceback'));

            if (lastPrompt) {
              if (tracebackIndex > 0) {
                setOutput(lines.slice(0, tracebackIndex).join('\n').trimEnd());
              } else {
                const cleanOutput = outputText.split('\n')
                  .filter((l: string) => !l.includes('Traceback') && !l.includes('File "'))
                  .join('\n');
                setOutput(cleanOutput.trimEnd());
              }
              setWaitingForInput(true);
            } else {
              const cleanOutput = lines.filter((l: string) => !l.includes('Traceback') && !l.includes('File "') && !l.includes('EOFError')).join('\n');
              setOutput(cleanOutput.trimEnd() || 'Waiting for input...');
              setWaitingForInput(true);
            }
          } else {
            // First run: attempt to find prompt before traceback
            const promptLine = lines.find((line: string) => {
              const trimmed = line.trim();
              return (/[:?]\s*$/.test(trimmed) || /Enter\s+\w+[\s:]+$/i.test(trimmed))
                && !trimmed.includes('Traceback')
                && !trimmed.includes('File');
            });

            if (promptLine) {
              setOutput(promptLine.trim());
              setWaitingForInput(true);
            } else {
              const firstLine = lines[0]?.trim();
              if (firstLine && !firstLine.includes('Traceback')) {
                setOutput(firstLine);
              } else {
                setOutput('Waiting for input...');
              }
              setWaitingForInput(true);
            }
          }
        } else {
          // No traceback - check for prompt patterns at the end of output
          const promptPatterns = [
            /[:?]\s*$/,                // ends with : or ?
            /Enter\s+\w+[\s:]+$/i,     // "Enter something:"
            /Please\s+enter/i,         // "Please enter"
            /input[\s:]+$/i,           // "input:"
          ];

          const lines = outputText.split('\n');
          const lastLine = lines[lines.length - 1].trim();
          const isLastLinePrompt = promptPatterns.some((pattern) => pattern.test(lastLine));
          const formattedOutput = formatOutputWithInputs(outputText, accumulatedStdin);
          setOutput(formattedOutput);

          if (isLastLinePrompt) {
            setWaitingForInput(true);
          } else {
            setWaitingForInput(false);
          }
        }
      } else {
        // No output
        if (accumulatedStdin.length > 0) {
          setOutput('No output\n');
        } else {
          setOutput('No output yet. Click "Run" to execute your code.');
        }
        setWaitingForInput(false);
      }
    } catch (error) {
      setOutput((prev) => prev + (prev ? '\n' : '') + `Error: ${error instanceof Error ? error.message : 'Failed to execute code'}\n`);
      setWaitingForInput(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleInputSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentInput.trim() || isRunning) return;

    const newInput = currentInput;
    const newStdin = [...accumulatedStdin, newInput].join('\n');

    setAccumulatedStdin((prev) => [...prev, newInput]);
    setCurrentInput('');
    setWaitingForInput(false);

    await executeCode(newStdin);
  };

  const handleClear = () => {
    setCode(language.defaultCode);
    setOutput('');
    setAccumulatedStdin([]);
    setCurrentInput('');
    setWaitingForInput(false);
    try {
      localStorage.removeItem(`code-${languageId}`);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?lang=${languageId}&code=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      editorContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Header theme={theme} onThemeToggle={onThemeToggle} languageName={language.name} />

      <div className="flex-1 flex overflow-hidden">
        <LanguageSidebar
          theme={theme}
          currentLanguageId={languageId}
          onLanguageSelect={onLanguageChange}
        />

        <main className="flex-1 flex flex-col">
          <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-sm font-mono`}>
                main.{language.fileExtension}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRun}
                disabled={isRunning || waitingForInput}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : waitingForInput ? 'Waiting for input...' : 'Run'}</span>
              </button>

              <button
                onClick={handleClear}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center space-x-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                title="Share"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettings && (
                  <div className={`absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} z-50`}>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Font Size: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden" ref={editorContainerRef}>
            <div className="flex-1 border-r border-gray-800">
              <Editor
                height="100%"
                language={language.id === 'cpp' ? 'cpp' : language.id}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  fontSize,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                }}
              />
            </div>

            <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b flex justify-between items-center`}>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Output
                </h3>
                <button
                  onClick={() => setOutput('')}
                  className={`text-sm px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  Clear Output
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <pre className={`font-mono text-sm whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                  {output || 'No output yet. Click "Run" to execute your code.'}
                </pre>

                {waitingForInput && (
                  <form onSubmit={handleInputSubmit} className="mt-4 flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      disabled={isRunning}
                      className={`flex-1 px-3 py-2 rounded-lg font-mono text-sm border ${
                        theme === 'dark'
                          ? 'bg-gray-950 text-gray-300 border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      } focus:outline-none disabled:opacity-50`}
                      placeholder="Type your input and press Enter..."
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={isRunning || !currentInput.trim()}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isRunning || !currentInput.trim()
                          ? 'bg-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      Submit
                    </button>
                  </form>
                )}
                <div ref={outputEndRef} />
              </div>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t p-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center space-x-4 flex-wrap">
              <span>💡 Tip: Press Ctrl+Enter to run code</span>
              <span>•</span>
              <span>Ctrl+S to save</span>
              <span>•</span>
              <span>💬 Type input directly in the output area when prompted</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
