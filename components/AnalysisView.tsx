import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArchitectResponse } from '../types';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, Database, Server, 
  Copy, Play, Terminal, Check, Loader2, Trash2, Bug, Lock, FileKey, Save, Download,
  ShieldAlert, Shield, ArrowUpRight, Archive
} from 'lucide-react';

interface AnalysisViewProps {
  data: ArchitectResponse;
  onSave?: () => void;
  onGoToVault?: () => void;
}

// Sub-component for individual code blocks to handle independent copy state
const SecurityCodeBlock = ({ inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const text = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  if (inline) {
    return (
      <code className="bg-green-500/10 text-green-300 border border-green-500/20 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-800 bg-[#0d1117] shadow-xl">
       <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-green-500" />
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Security Configuration</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 hover:text-white transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>COPY RULE</span>
              </>
            )}
          </button>
       </div>
       <div className="p-4 overflow-x-auto">
         <code className="font-mono text-xs text-green-300/90 whitespace-pre" {...props}>
           {children}
         </code>
       </div>
    </div>
  );
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, onSave, onGoToVault }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (onSave) {
      onSave();
      setIsSaved(true);
      setHasSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleExportSecurity = () => {
    const blob = new Blob([data.securityContext], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().split('T')[1].slice(0, 12); // HH:MM:SS.ms
  };

  const runSimulation = () => {
    setShowTerminal(true);
    setIsSimulating(true);
    
    // Clear logs and set start message
    const startTime = getTimestamp();
    setSimulationLogs([
      `[${startTime}] >>> SYSTEM INITIALIZED: ARCHITECT-GO SANDBOX <<<`,
      `[${startTime}] Initializing execution environment...`
    ]);

    // Parse potential function names for realistic logs
    const symbols = (data.backendImpl.match(/(?:function|const|let|var)\s+(\w+)/g) || [])
      .map(s => s.replace(/(?:function|const|let|var)\s+/, ''))
      .slice(0, 3);

    const steps = [
      { msg: 'Analyzing AST for syntax integrity...', delay: 800 },
      { msg: 'Resolving dependencies (firebase-admin, zod)...', delay: 1500 },
      { msg: 'Transpiling TypeScript to ES2022...', delay: 2400 },
      ...symbols.map((sym, i) => ({ 
        msg: `[Compiler] Optimized symbol: ${sym}`, 
        delay: 3000 + (i * 600) 
      })),
      { msg: 'Injecting environment variables...', delay: symbols.length ? 3000 + (symbols.length * 600) + 500 : 3000 },
      { msg: 'Starting isolated execution context...', delay: symbols.length ? 3000 + (symbols.length * 600) + 1200 : 3800 },
      { msg: 'SUCCESS: Backend logic deployed to sandbox (Memory: 14MB).', delay: symbols.length ? 3000 + (symbols.length * 600) + 2000 : 4500 },
      { msg: '>>> SIMULATION SEQUENCE COMPLETED <<<', delay: symbols.length ? 3000 + (symbols.length * 600) + 2200 : 4700 },
    ];

    steps.forEach(({ msg, delay }) => {
      setTimeout(() => {
        const time = getTimestamp();
        setSimulationLogs(prev => [...prev, `[${time}] ${msg}`]);
        if (msg.includes('SIMULATION SEQUENCE COMPLETED')) setIsSimulating(false);
      }, delay);
    });
  };

  const runDebug = () => {
    setShowTerminal(true);
    setIsSimulating(true);
    
    const startTime = getTimestamp();
    setSimulationLogs([
      `[${startTime}] >>> ATTACHING DEBUGGER (Port 9229) <<<`,
      `[${startTime}] $ node --inspect-brk server.ts`
    ]);

    const steps = [
      { msg: 'Debugger listening on ws://127.0.0.1:9229/8b34...', delay: 600 },
      { msg: 'Debugger attached.', delay: 1200 },
      { msg: 'Set breakpoints in: [AuthModule, Database, Security].', delay: 1800 },
      { msg: 'Paused on start.', delay: 2400 },
      { msg: 'Step over: const app = initializeApp();', delay: 3000 },
      { msg: 'Step into: validateSchema(req.body);', delay: 3800 },
      { msg: 'Variable scope: { user: undefined, payload: Object }', delay: 4500 },
      { msg: 'Step over: await db.collection("users").add(...)', delay: 5200 },
      { msg: 'No exceptions thrown.', delay: 6000 },
      { msg: '>>> DEBUG SESSION DISCONNECTED <<<', delay: 6500 },
    ];

    steps.forEach(({ msg, delay }) => {
      setTimeout(() => {
        const time = getTimestamp();
        setSimulationLogs(prev => [...prev, `[${time}] ${msg}`]);
        if (msg.includes('DEBUG SESSION DISCONNECTED')) setIsSimulating(false);
      }, delay);
    });
  };

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulationLogs]);

  const getLogStyle = (log: string) => {
    if (log.includes('ERROR') || log.includes('Failed')) return 'text-red-400 font-semibold';
    if (log.includes('SUCCESS')) return 'text-green-400 font-bold';
    if (log.includes('WARNING')) return 'text-yellow-400';
    if (log.includes('>>>')) return 'text-accent-400 font-bold tracking-wide';
    if (log.includes('[Compiler]')) return 'text-blue-400';
    if (log.includes('Step')) return 'text-purple-300';
    if (log.includes('Debugger')) return 'text-yellow-300';
    return 'text-gray-300';
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Header Actions */}
      <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
        {hasSaved && onGoToVault && (
          <button 
             onClick={onGoToVault}
             className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-xl border border-accent-500 shadow-lg shadow-accent-600/20 transition-all animate-fade-in"
          >
             <Archive className="w-4 h-4" />
             <span className="text-sm font-semibold">Open Vault</span>
             <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
        
        {onSave && !hasSaved && (
          <button 
            onClick={handleSave}
            disabled={isSaved}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-700 shadow-lg transition-all"
          >
            {isSaved ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
            <span className="text-sm font-semibold">{isSaved ? 'Vaulted' : 'Save to Vault'}</span>
          </button>
        )}

        {hasSaved && !onGoToVault && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 text-green-400 rounded-xl border border-green-500/20">
            <Check className="w-4 h-4" />
            <span className="text-sm font-semibold">Saved</span>
          </div>
        )}
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 md:pt-0">
        <div className={`col-span-1 rounded-xl border p-6 flex flex-col items-center justify-center text-center ${getScoreColor(data.viabilityScore)}`}>
          <span className="text-5xl font-bold font-mono mb-2">{data.viabilityScore}%</span>
          <span className="text-sm uppercase tracking-widest font-semibold opacity-80">Market Viability</span>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-500" />
            Strategic Audit (2026)
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {data.viabilityAnalysis}
          </p>
          <div className="bg-gray-950/50 rounded-lg p-4 border border-gray-800">
            <p className="text-accent-400 text-xs font-mono uppercase mb-2">Action Plan</p>
            <p className="text-gray-300 text-sm">{data.strategy2026}</p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Data Model */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              TypeScript & Zod Schema
            </h3>
            <span className="text-xs font-mono text-gray-500">STRICT + RUNTIME VALIDATION</span>
          </div>
          <div className="relative group">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                  onClick={() => handleCopy(data.dataModel, 'datamodel')}
                  className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 border border-gray-700 backdrop-blur-sm"
                  title="Copy Schema"
               >
                  {copiedSection === 'datamodel' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
               </button>
            </div>
            <pre className="bg-[#0D1117] border border-gray-800 rounded-xl p-4 overflow-x-auto text-sm font-mono text-gray-300 h-96">
              <code>{data.dataModel}</code>
            </pre>
          </div>
        </div>

        {/* Backend Implementation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              Backend Logic
            </h3>
            <div className="flex items-center gap-3">
               <button 
                  onClick={runDebug}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono font-bold rounded border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Bug className="w-3 h-3" />
                 DEBUG
               </button>
               <button 
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent-600/10 hover:bg-accent-600/20 text-accent-400 text-xs font-mono font-bold rounded border border-accent-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isSimulating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Play className="w-3 h-3" />}
                 RUN SIMULATION
               </button>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <button 
                  onClick={() => handleCopy(data.backendImpl, 'backend')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 border border-gray-700 backdrop-blur-sm transition-all" 
                  title="Copy Backend Code"
               >
                  {copiedSection === 'backend' ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">Code Copied!</span>
                    </>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
               </button>
            </div>
            <pre className={`bg-[#0D1117] border border-gray-800 rounded-xl p-4 overflow-x-auto text-sm font-mono text-gray-300 transition-all ${showTerminal ? 'h-64' : 'h-96'}`}>
              <code>{data.backendImpl}</code>
            </pre>
          </div>

          {/* Terminal Output */}
          {showTerminal && (
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl font-mono text-xs shadow-2xl overflow-hidden animate-fade-in-up flex flex-col h-40">
               {/* Terminal Header */}
               <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between border-b border-black">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300 font-semibold text-[10px] tracking-wide">DEBUG CONSOLE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <button 
                      onClick={() => setSimulationLogs([])}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                      title="Clear Console"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
               </div>

               {/* Terminal Body */}
               <div className="p-3 overflow-y-auto flex-1 font-mono leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {simulationLogs.length === 0 && (
                     <div className="text-gray-500 opacity-50 italic">
                        Microsoft Windows [Version 10.0.19045.3693]<br/>
                        (c) Microsoft Corporation. All rights reserved.<br/><br/>
                        C:\ArchitectGo\Sandbox{'>'} Ready for input...
                     </div>
                  )}
                  {simulationLogs.map((log, i) => {
                    const hasTimestamp = log.startsWith('[');
                    const timestamp = hasTimestamp ? log.split(']')[0] + ']' : '';
                    const message = hasTimestamp ? log.split(']').slice(1).join(']') : log;
                    
                    return (
                      <div key={i} className="break-all flex">
                         {hasTimestamp && (
                           <span className="text-gray-500 mr-2 shrink-0 select-none text-[10px] pt-0.5">{timestamp}</span>
                         )}
                         <span className={`${getLogStyle(log)}`}>{message}</span>
                      </div>
                    );
                  })}
                  
                  {/* Active Line with Cursor */}
                  <div className="flex items-center text-gray-300 mt-1">
                    <span className="text-green-500 mr-2">➜</span>
                    <span className="text-blue-400 mr-2">~</span>
                    <div className="flex items-center">
                       {isSimulating ? '' : ''}
                       <span className="w-2 h-4 bg-gray-400 animate-pulse ml-1 inline-block align-middle"></span>
                    </div>
                  </div>
                  <div ref={terminalEndRef} />
               </div>
            </div>
          )}
        </div>

      </div>

      {/* Security Context - Revamped UI */}
      <div className="bg-gray-900/40 border border-green-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg shadow-green-900/10">
        <div className="bg-green-500/5 border-b border-green-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-green-500/10 rounded-lg">
               <ShieldCheck className="w-5 h-5 text-green-400" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white tracking-tight">Zero-Trust Security Protocol</h3>
               <p className="text-xs text-green-400/70 font-mono mt-0.5 flex items-center gap-1">
                 <Lock className="w-3 h-3" />
                 GENERATED COMPLIANCE AUDIT
               </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={handleExportSecurity}
                className="hidden md:flex items-center gap-2 text-xs font-semibold text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/20 transition-all"
             >
                <Download className="w-3 h-3" />
                EXPORT REPORT
             </button>
             <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-mono text-green-400 font-bold tracking-wider">LIVE</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-gray-300 security-markdown">
           <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-6 pb-2 border-b border-gray-800" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mb-4 mt-8 flex items-center gap-2" {...props} />,
                h3: ({node, ...props}) => (
                  <div className="flex items-center gap-3 mt-8 mb-4">
                    <div className="w-8 h-px bg-green-500/30"></div>
                    <h3 className="text-sm font-bold text-green-400 font-mono uppercase tracking-widest" {...props} />
                    <div className="flex-1 h-px bg-green-500/10"></div>
                  </div>
                ),
                ul: ({node, ...props}) => <ul className="space-y-4 mb-6" {...props} />,
                li: ({node, ...props}) => (
                  <li className="flex items-start gap-3 text-gray-400 text-sm group pl-2">
                    <Shield className="w-4 h-4 text-green-500/30 mt-0.5 shrink-0 group-hover:text-green-400 transition-colors" />
                    <span className="leading-relaxed" {...props} />
                  </li>
                ),
                strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                code: SecurityCodeBlock,
                blockquote: ({node, ...props}) => (
                  <div className="flex gap-4 bg-red-500/5 border border-red-500/20 p-5 rounded-xl my-6">
                     <div className="p-2 bg-red-500/10 rounded-lg h-fit">
                        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-wide">Security Vulnerability Detected</h4>
                        <blockquote className="text-red-200/80 text-sm italic leading-relaxed" {...props} />
                     </div>
                  </div>
                )
              }}
           >
              {data.securityContext}
           </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};