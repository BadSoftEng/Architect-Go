import React from 'react';
import { 
  ArrowRight, ShieldCheck, Cpu, GitBranch, 
  Terminal, BarChart3, Lock 
} from 'lucide-react';
import { AboutSection } from './AboutSection';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative animate-fade-in">
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 space-y-8 pt-20 pb-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-mono font-bold tracking-wide animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          ARCHITECT-GO: INTELLIGENT BACKEND ENGINE
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Turn Spaghetti Code into <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-500">
            Scalable Infrastructure
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Upload a napkin sketch or legacy codebase. Architect-Go instantly generates STRICT TypeScript schemas, market viability scores, and secure Firebase backends.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-gray-950 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] flex items-center gap-3"
          >
            Initialize Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="https://github.com/BadSoftEng/bruh"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-gray-900 border border-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-800 hover:text-white transition-all flex items-center gap-2"
          >
            <GitBranch className="w-5 h-5" />
            View Source
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto px-4 w-full relative z-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <FeatureCard 
          icon={<Cpu className="w-6 h-6 text-blue-400" />}
          title="Strict Schemas"
          desc="Auto-generates Zod-validated TypeScript interfaces. No 'any' types allowed. Runtime safety ensured."
        />
        <FeatureCard 
          icon={<BarChart3 className="w-6 h-6 text-green-400" />}
          title="Market Viability"
          desc="AI analyzes your concept against 2026 market trends, providing a viability score and strategic audit."
        />
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-purple-400" />}
          title="Security First"
          desc="Generates ready-to-deploy Firestore security rules and backend logic tailored for BYOD environments."
        />
      </div>

      {/* About Section */}
      <AboutSection />

    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors group">
    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-800/80 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-100 mb-2 font-mono">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">
      {desc}
    </p>
  </div>
);