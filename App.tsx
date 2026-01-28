import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { FileUpload } from './components/FileUpload';
import { AnalysisView } from './components/AnalysisView';
import { VaultGrid } from './components/VaultGrid';
import { AppState, ArchitectResponse, FileInput, User, VaultItem } from './types';
import { analyzeArchitecture } from './services/architectAi';
import { getVault, saveToVault, deleteFromVault } from './services/vaultService';
import { Loader2, ArrowRight, ArrowLeft, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  
  const [fileInput, setFileInput] = useState<FileInput>({ file: null, previewUrl: null });
  const [contextText, setContextText] = useState("");
  const [result, setResult] = useState<ArchitectResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);

  useEffect(() => {
    // Load vault items when idle (user logged in)
    if (state === AppState.IDLE) {
      setVaultItems(getVault());
    }
  }, [state]);

  const handleStart = () => {
    if (user) {
      setState(AppState.IDLE);
    } else {
      setState(AppState.LOGIN);
    }
  };

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setState(AppState.IDLE);
  };

  const handleLogout = () => {
    setUser(null);
    reset();
    setState(AppState.LANDING);
  };

  const handleLogoClick = () => {
    if (user) {
      reset(); // Go back to dashboard and clear current temporary state
    } else {
      setState(AppState.LANDING);
    }
  };

  const handleScan = async () => {
    if (!fileInput.file && !contextText.trim()) return;

    setState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await analyzeArchitecture(fileInput.previewUrl, contextText);
      setResult(data);
      setState(AppState.RESULT);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred during architectural analysis.");
      setState(AppState.ERROR);
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setFileInput({ file: null, previewUrl: null });
    setContextText("");
    setResult(null);
  };

  // Vault Actions
  const handleSaveToVault = () => {
    if (!result) return;
    // Derive title from viability analysis or text context
    const suggestedTitle = contextText.slice(0, 30) || "Generated Architecture";
    const cleanTitle = suggestedTitle.replace(/\n/g, ' ').trim() + (suggestedTitle.length > 25 ? '...' : '');
    
    saveToVault(result, cleanTitle);
    setVaultItems(getVault()); // Refresh list
  };

  const handleLoadVaultItem = (item: VaultItem) => {
    setResult(item.data);
    setState(AppState.RESULT);
  };

  const handleDeleteVaultItem = (id: string) => {
    deleteFromVault(id);
    setVaultItems(getVault());
  };

  return (
    <Layout user={user} onLogout={handleLogout} onLogoClick={handleLogoClick}>
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Landing Page */}
        {state === AppState.LANDING && (
          <LandingPage onStart={handleStart} />
        )}

        {/* Login Page */}
        {state === AppState.LOGIN && (
          <LoginPage onLogin={handleLogin} />
        )}

        {/* Dashboard / Idle State */}
        {state === AppState.IDLE && user && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                Fix The Unfixable.
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Upload your legacy spaghetti code or a napkin sketch. 
                Architect-Go will re-engineer it into a scalable, secure ecosystem.
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
              <FileUpload input={fileInput} onChange={setFileInput} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0B0F19] text-gray-500">OR PROVIDE CONTEXT</span>
                </div>
              </div>

              <textarea
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder="Describe the system requirements or paste raw code here..."
                className="w-full h-32 bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-300 focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 outline-none transition-all placeholder:text-gray-600 font-mono text-sm resize-none"
              />

              <button
                onClick={handleScan}
                disabled={(!fileInput.file && !contextText.trim())}
                className="w-full py-4 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent-600/20"
              >
                Start Architectural Scan <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Vault Grid */}
            <VaultGrid 
              items={vaultItems} 
              onLoad={handleLoadVaultItem} 
              onDelete={handleDeleteVaultItem} 
            />
          </div>
        )}

        {/* Loading State */}
        {state === AppState.ANALYZING && (
          <div className="py-20 text-center space-y-6 animate-pulse max-w-4xl mx-auto">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-accent-500 blur-xl opacity-20 rounded-full"></div>
              <Loader2 className="w-16 h-16 text-accent-500 animate-spin relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Analyzing Architecture</h3>
              <p className="text-gray-500 mt-2 font-mono">Identifying entities • Checking security • Refactoring</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === AppState.ERROR && (
          <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-red-400">Analysis Failed</h3>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => setState(AppState.IDLE)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results State */}
        {state === AppState.RESULT && result && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-800">
               <div className="flex items-center gap-4">
                 <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all border border-gray-700 font-medium text-sm group"
                 >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Dashboard & Vault
                 </button>
                 <div className="h-6 w-px bg-gray-800"></div>
                 <h2 className="text-2xl font-bold text-white">Architecture Report</h2>
               </div>
            </div>
            <AnalysisView 
              data={result} 
              onSave={handleSaveToVault}
              onGoToVault={reset}
            />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default App;