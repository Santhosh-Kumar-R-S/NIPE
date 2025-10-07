import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { TextInput } from './components/TextInput';
import { SummaryResult } from './components/SummaryResult';

const API_BASE_URL = 'http://localhost:3001';

type SummaryMode = 'short' | 'detailed' | 'plain';

interface SummaryData {
  summary: string;
  stats: {
    originalWords: number;
    summaryWords: number;
    compressionRatio: string;
    readingTimeSaved: number;
  };
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('short');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTextInput('');
    setResult(null);
    setError(null);
  };

  const handleTextChange = (text: string) => {
    setTextInput(text);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handleSummarize = async () => {
    if (!selectedFile && !textInput.trim()) {
      setError('Please upload a file or enter text to summarize');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('textInput', textInput);
      }

      formData.append('mode', summaryMode);

      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setResult({
        summary: data.summary,
        stats: data.stats,
      });

      saveToHistory(data.summary, summaryMode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (summary: string, mode: SummaryMode) => {
    try {
      const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        summary,
        mode,
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      localStorage.setItem('summaryHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  };

  const canSummarize = (selectedFile || textInput.trim()) && !loading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Summarize Legal Documents in Seconds
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload or paste legal text to get instant AI-powered summaries
            </p>
          </div>

          <FileUpload onFileSelect={handleFileSelect} disabled={loading} />

          {selectedFile && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Selected: {selectedFile.name}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          <TextInput
            value={textInput}
            onChange={handleTextChange}
            disabled={loading}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Summary Mode
              </label>
              <select
                value={summaryMode}
                onChange={(e) => setSummaryMode(e.target.value as SummaryMode)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="short">Short Summary</option>
                <option value="detailed">Detailed Summary</option>
                <option value="plain">Plain English Summary</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSummarize}
                disabled={!canSummarize}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700
                         hover:from-blue-700 hover:to-blue-800
                         text-white font-medium rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-md hover:shadow-lg
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Summarize
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                {error}
              </p>
            </div>
          )}

          {result && <SummaryResult summary={result.summary} stats={result.stats} />}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by AI • Designed for lawyers, students, and citizens
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
