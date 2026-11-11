import React, { useEffect, useState } from 'react';
import { 
  Binary, 
  Search, 
  Cpu, 
  Terminal, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { NavSection } from '../../engine/types';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenSearch,
}) => {
  const [cBackendLive, setCBackendLive] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setCBackendLive(data.status === 'healthy');
        } else {
          setCBackendLive(false);
        }
      } catch (_) {
        setCBackendLive(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Binary className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                DSVA
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                C11 Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Data Structure Visualizer & Analyzer</p>
          </div>
        </button>
      </div>

      {/* Center Search Input Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all text-xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span>Search algorithms, structures, Big-O...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded-md">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: C Engine Status & Shortcuts */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend Status Badge */}
        <div 
          title={cBackendLive ? "Connected directly to native C backend server" : "Running high-performance C-equivalent client engine"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
            cBackendLive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cBackendLive ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${cBackendLive ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
          </span>
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{cBackendLive ? 'C Backend Online' : 'C Engine Ready'}</span>
        </div>

        {/* Quick Playground link */}
        <button
          onClick={() => onNavigate('playground')}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
          title="Open C Playground"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Learning Resources */}
        <button
          onClick={() => onNavigate('learning')}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
          title="Learning Syllabus"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white md:hidden transition-all"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
