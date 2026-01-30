
import React, { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { AudioInput } from './components/AudioInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { CityPulseService } from './services/geminiService';
import { CityFile, AnalysisResult } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<CityFile[]>([]);
  const [contextText, setContextText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => new CityPulseService(), []);

  const handleFilesAdded = (newFiles: CityFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleRunAnalysis = async () => {
    if (files.length === 0 && !contextText) {
      setError("Please provide some files or urban context notes.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await service.analyzeCityData(files, contextText);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar (Input Panel) */}
      <aside className="w-full lg:w-[400px] border-r border-slate-800 flex flex-col h-full bg-slate-900/50 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-1">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CityPulse <span className="text-indigo-500">Studio</span></h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">Urban Reasoning & Prototyping</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Upload Datasets</h3>
            <FileUpload files={files} onFilesAdded={handleFilesAdded} onRemove={handleRemoveFile} />
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Urban Context</h3>
            <div className="space-y-4">
              <AudioInput service={service} onTranscriptionComplete={(text) => setContextText(prev => prev + ' ' + text)} />
              <div className="relative">
                <textarea
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="Describe urban challenges, citizen feedback, or specific goals for analysis..."
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none placeholder:text-slate-600 transition-all"
                />
                {contextText && (
                  <button 
                    onClick={() => setContextText('')}
                    className="absolute top-2 right-2 text-slate-500 hover:text-slate-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg ${
              loading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/10 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Reasoning...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.533 1.9a2 2 0 001.31 2.413l1.854.556a2 2 0 001.96-1.414l.338-1.2a2 2 0 00-.56-1.646zM6.28 10.14a2 2 0 012.77-.3l1.24 1.01a2 2 0 01.3 2.77l-1.01 1.24a2 2 0 01-2.77.3l-1.24-1.01a2 2 0 01-.3-2.77l1.01-1.24zM15.34 3.34a2 2 0 012.77-.3l1.24 1.01a2 2 0 01.3 2.77l-1.01 1.24a2 2 0 01-2.77.3l-1.24-1.01a2 2 0 01-.3-2.77l1.01-1.24z"/></svg>
                <span>Generate Intelligence</span>
              </>
            )}
          </button>
          {error && <p className="mt-3 text-[10px] text-red-400 text-center font-mono uppercase">{error}</p>}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <header className="px-8 py-4 flex justify-between items-center border-b border-slate-800/50 bg-slate-950/50 backdrop-blur">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Workspace / Reasoning Engine</span>
            {analysis && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase animate-pulse">
                Live Analysis
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
             <span className="text-[10px] font-mono text-slate-500 uppercase">Gemini 3 Pro Active</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <AnalysisDisplay result={analysis} isLoading={loading} />
        </div>
      </main>
    </div>
  );
};

export default App;
