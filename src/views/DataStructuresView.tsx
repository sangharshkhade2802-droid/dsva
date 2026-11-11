import React, { useState } from 'react';
import { Layers, GitFork, Hash, Database } from 'lucide-react';
import { LinearVisualizer } from '../components/visualizers/LinearVisualizer';
import { TreeVisualizer } from '../components/visualizers/TreeVisualizer';
import { HashVisualizer } from '../components/visualizers/HashVisualizer';

export const DataStructuresView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'linear' | 'trees' | 'hash'>('linear');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel self-start">
        <button
          onClick={() => setActiveTab('linear')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'linear'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Linear Data Structures</span>
        </button>

        <button
          onClick={() => setActiveTab('trees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'trees'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Non-Linear & Trees</span>
        </button>

        <button
          onClick={() => setActiveTab('hash')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'hash'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Hash-Based Structures</span>
        </button>
      </div>

      {/* Render active sub-visualizer */}
      {activeTab === 'linear' && <LinearVisualizer />}
      {activeTab === 'trees' && <TreeVisualizer />}
      {activeTab === 'hash' && <HashVisualizer />}
    </div>
  );
};
