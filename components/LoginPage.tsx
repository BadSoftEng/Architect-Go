import React, { useState } from 'react';
import { Hexagon, Github, Shield, ArrowRight, Loader2, Fingerprint, User as UserIcon, Briefcase, Code2 } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [name, setName] = useState('Senior Architect');
  const [role, setRole] = useState<'ARCHITECT' | 'ENGINEER'>('ARCHITECT');

  const handleSimulatedLogin = (provider: string) => {
    setIsLoading(provider);
    
    // Simulate API network delay
    setTimeout(() => {
      const displayName = name.trim() || 'Senior Architect';
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: displayName,
        email: `${displayName.toLowerCase().replace(/\s+/g, '.')}@architect-go.dev`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}&backgroundColor=b6e3f4`,
        role: role
      };
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative animate-fade-in">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div className="p-3 bg-accent-600/10 rounded-2xl border border-accent-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]">
            <Hexagon className="w-10 h-10 text-accent-500" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">Identity Access</h1>
            <p className="text-gray-400 text-sm mt-1">Configure your session profile</p>
          </div>
        </div>

        {/* Identity Config Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-500 uppercase font-semibold ml-1">Display Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-950/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 outline-none transition-all placeholder:text-gray-700"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-500 uppercase font-semibold ml-1">Role Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRole('ARCHITECT')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    role === 'ARCHITECT' 
                      ? 'bg-accent-600 text-white border-accent-500 shadow-lg shadow-accent-600/20' 
                      : 'bg-gray-950/50 text-gray-500 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  ARCHITECT
                </button>
                <button
                  onClick={() => setRole('ENGINEER')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    role === 'ENGINEER' 
                      ? 'bg-accent-600 text-white border-accent-500 shadow-lg shadow-accent-600/20' 
                      : 'bg-gray-950/50 text-gray-500 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  ENGINEER
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800"></div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSimulatedLogin('google')}
              disabled={!!isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-medium text-sm group disabled:opacity-70 disabled:cursor-wait"
            >
              <div className="flex items-center gap-3">
                {isLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleSimulatedLogin('github')}
              disabled={!!isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#24292e] text-white rounded-xl hover:bg-[#2f363d] border border-gray-700 transition-all font-medium text-sm group disabled:opacity-70 disabled:cursor-wait"
            >
              <div className="flex items-center gap-3">
                {isLoading === 'github' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Github className="w-5 h-5" />
                )}
                <span>Continue with GitHub</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
            onClick={() => handleSimulatedLogin('sso')}
            disabled={!!isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium disabled:opacity-70 disabled:cursor-wait"
            >
              <Shield className="w-4 h-4" />
              <span>Single Sign-On (SAML)</span>
            </button>
          </div>

        </div>

        {/* Footer Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-600 font-mono">
           <Fingerprint className="w-3 h-3" />
           <span>256-BIT ENCRYPTED SESSION</span>
        </div>

      </div>
    </div>
  );
};