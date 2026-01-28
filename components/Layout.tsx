import React from 'react';
import { Terminal, Hexagon, Github, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLogoClick }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent-500/30">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="p-2 bg-accent-600/10 rounded-lg border border-accent-500/20">
              <Hexagon className="w-6 h-6 text-accent-500" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight text-white">Architect-Go</h1>
              <p className="text-xs text-gray-400 font-mono">V1.0</p>
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-800">
                 <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-[10px] font-mono text-accent-400 bg-accent-500/10 px-1.5 py-0.5 rounded border border-accent-500/20">{user.role}</span>
                 </div>
                 <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-gray-700" 
                 />
                 <button 
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    title="Sign Out"
                 >
                    <LogOut className="w-4 h-4" />
                 </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Terminal className="w-5 h-5" />
                </a>
                <a href="https://github.com/BadSoftEng/bruh" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            )}
            
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-mono">
            POWERED BY GEMINI 3 PRO PREVIEW • SECURE ARCHITECTURE GENERATION
          </p>
        </div>
      </footer>
    </div>
  );
};