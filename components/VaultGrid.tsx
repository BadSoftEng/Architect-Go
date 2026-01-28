import React from 'react';
import { VaultItem } from '../types';
import { Archive, Trash2, ArrowUpRight, Calendar, Activity, FolderOpen } from 'lucide-react';

interface VaultGridProps {
  items: VaultItem[];
  onLoad: (item: VaultItem) => void;
  onDelete: (id: string) => void;
}

export const VaultGrid: React.FC<VaultGridProps> = ({ items, onLoad, onDelete }) => {
  return (
    <div className="space-y-4 pt-8 animate-fade-in-up">
      <div className="flex items-center gap-2 text-gray-400 border-b border-gray-800 pb-2">
        <Archive className="w-4 h-4" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider">Project Vault</h3>
        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-500">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
          <div className="p-4 bg-gray-800/50 rounded-full mb-4">
            <FolderOpen className="w-8 h-8 text-gray-600" />
          </div>
          <h4 className="text-gray-400 font-semibold">Vault is Empty</h4>
          <p className="text-gray-600 text-sm mt-1">Completed architectural scans will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-gray-900/40 border border-gray-800 hover:border-accent-500/50 rounded-xl p-5 transition-all hover:bg-gray-900/60"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-accent-500/10 transition-colors">
                  <Activity className={`w-5 h-5 ${
                    item.data.viabilityScore >= 80 ? 'text-green-400' : 
                    item.data.viabilityScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                </div>
                <div className="flex gap-2">
                   <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete from Vault"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>

              <h4 className="text-gray-200 font-semibold truncate pr-4 mb-1">{item.title}</h4>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-4">
                <Calendar className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleDateString()}
                <span className="text-gray-700">|</span>
                <span className={`${
                    item.data.viabilityScore >= 80 ? 'text-green-500' : 
                    item.data.viabilityScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  SCORE: {item.data.viabilityScore}%
                </span>
              </div>

              <button 
                onClick={() => onLoad(item)}
                className="w-full py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs font-bold text-gray-400 group-hover:text-white group-hover:border-gray-600 transition-all flex items-center justify-center gap-2"
              >
                LOAD ARCHITECTURE <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};