import React from 'react';
import { 
  Binary, 
  ArrowUpDown, 
  Search, 
  Layers, 
  Network, 
  LineChart, 
  Code2, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Cpu,
  Clock,
  BookOpen
} from 'lucide-react';
import { NavSection } from '../engine/types';

interface DashboardViewProps {
  onNavigate: (section: NavSection) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-10 shadow-2xl glass-panel">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Computer Science Interactive Laboratory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Transform abstract computer science into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">interactive visual reality</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Execute algorithms powered strictly by <strong>C11 native memory architecture</strong>. Step through memory allocations, pointer assignments, tree rotations, and graph relaxations with synchronized C source code.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('sorting')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg glow-emerald transition-all"
            >
              <span>Explore Sorting Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('graph')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <span>Graph Engine (Dijkstra/BFS)</span>
            </button>

            <button
              onClick={() => onNavigate('playground')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs border border-slate-800 transition-all"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>C Playground</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#22c55e" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Algorithms</span>
            <ArrowUpDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">30+</div>
          <div className="text-[11px] text-slate-500 mt-1">Sorting, Searching, Graph, Trees</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Data Structures</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">18+</div>
          <div className="text-[11px] text-slate-500 mt-1">Linear, Trees, Heaps, Hash Tables</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">C Engine Standard</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">C11/C17</div>
          <div className="text-[11px] text-slate-500 mt-1">Strict POSIX / MinGW Architecture</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Big-O Classes</span>
            <LineChart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">O(1)..O(n!)</div>
          <div className="text-[11px] text-slate-500 mt-1">Empirical & Asymptotic Benchmarks</div>
        </div>
      </div>

      {/* Module Categories Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider font-mono mb-4">
          Core Laboratories & Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Sorting */}
          <div 
            onClick={() => onNavigate('sorting')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <ArrowUpDown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                Sorting Visualizer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step animations for all 10 sorting algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Shell, and Bucket sort.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold mt-4">
              <span>Launch Sorting Stage</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Searching */}
          <div 
            onClick={() => onNavigate('searching')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors mb-1">
                Searching Visualizer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Probe-by-probe animations of Binary, Linear, Jump, Interpolation, and Exponential search with active boundary and eliminated region visualization.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono font-semibold mt-4">
              <span>Launch Search Stage</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Graph Algorithms */}
          <div 
            onClick={() => onNavigate('graph')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors mb-1">
                Interactive Graph Visualizer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Graph canvas with weighted edges: BFS, DFS, Dijkstra, Bellman-Ford (negative cycles), Floyd-Warshall, Kruskal, Prim MST, and Topological Sort.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono font-semibold mt-4">
              <span>Launch Graph Stage</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Data Structures (Linear & Non-Linear) */}
          <div 
            onClick={() => onNavigate('data_structures')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                Data Structures Lab
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Linked lists, Stacks, Queues, AVL self-balancing trees, BST, Binary Heaps, and Hash Tables with collision resolution strategies.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold mt-4">
              <span>Explore Structures</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Complexity Analyzer */}
          <div 
            onClick={() => onNavigate('complexity')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mb-1">
                Complexity Analyzer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Side-by-side empirical benchmark suite. Compare operations, swaps, comparisons, and microsecond execution time across multiple algorithms.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold mt-4">
              <span>Run Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Learning Resources */}
          <div 
            onClick={() => onNavigate('learning')}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.01] group glass-panel flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors mb-1">
                Learning & Interview Prep
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Textbook-grade explanations, real-world industry applications, working principles, advantages, trade-offs, and technical interview questions.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono font-semibold mt-4">
              <span>Open Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
