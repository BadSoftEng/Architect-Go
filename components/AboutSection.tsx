import React from 'react';
import { Github, Code2, Zap, Coffee, Sparkles, Terminal } from 'lucide-react';

export const AboutSection = () => {
  return (
    <div className="w-full py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden relative group hover:border-accent-500/30 transition-all duration-500">
           
           {/* "Vibing" Badge */}
           <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              VIBE CODING
           </div>

           <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
              
              {/* Avatar / Identity */}
              <div className="flex-shrink-0 relative">
                 <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-950 border border-gray-700 flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=BadSoftEng&backgroundColor=b6e3f4" 
                      alt="BadSoftEng"
                      className="w-full h-full object-cover p-2 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                 </div>
                 {/* Floating Icon */}
                 <div className="absolute -bottom-3 -right-3 bg-gray-900 border border-gray-700 p-2 rounded-lg shadow-lg">
                    <Terminal className="w-5 h-5 text-accent-400" />
                 </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-6">
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                       BadSoftEng
                       <Sparkles className="w-5 h-5 text-accent-400" />
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono text-xs border border-gray-700">Software Engineer</span>
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono text-xs border border-gray-700">Specialist Backend</span>
                    </div>
                 </div>

                 <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    I literally <strong>vibe coded</strong> this entire project. Architect-Go is a raw showcase of what happens when you combine 
                    Generative AI with rapid prototyping. No overthinking, just shipping.
                 </p>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                       <div className="flex items-center gap-2 mb-2 text-accent-400 font-bold text-xs uppercase tracking-wider">
                          <Zap className="w-3 h-3" /> Tech Stack
                       </div>
                       <p className="text-gray-400 text-sm">React, TypeScript, Gemini Pro, Tailwind</p>
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                       <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                          <Coffee className="w-3 h-3" /> Current Status
                       </div>
                       <p className="text-gray-400 text-sm">Waiting for better soon... 🚀</p>
                    </div>
                 </div>

                 <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
                    <a 
                      href="https://github.com/BadSoftEng" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                       <Github className="w-4 h-4" />
                       @BadSoftEng
                    </a>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500 font-mono text-xs italic">
                       "It works on my machine"
                    </span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};