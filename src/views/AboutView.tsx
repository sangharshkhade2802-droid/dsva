import React from 'react';
import { 
  Binary, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  Sparkles,
  Database,
  Workflow
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            Systems Architecture
          </span>
          <span className="text-xs text-slate-400 font-mono">C11 Native Core & React 18</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          About Data Structure Visualizer & Analyzer (DSVA)
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed mt-2">
          DSVA is an interactive computer science laboratory designed to transform abstract algorithms and pointer structures into visual animations, backed by standard C11 implementations.
        </p>
      </div>

      {/* Architectural Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 glass-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">C as the Ground Truth</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All algorithms, sorting routines, tree rotations, and graph relaxations are implemented in C11. JavaScript/TypeScript never simulates execution—it only renders the structured event trace produced by C.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 glass-card">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
            <Workflow className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">Event-Driven Animation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The C engine emits discrete atomic events (<code className="text-emerald-400 font-mono text-[11px]">compare</code>, <code className="text-emerald-400 font-mono text-[11px]">swap</code>, <code className="text-emerald-400 font-mono text-[11px]">pointer_assign</code>, <code className="text-emerald-400 font-mono text-[11px]">rotate_right</code>) with active memory states and C source line numbers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 glass-card">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">Zero-Leak Pointer Safety</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All dynamic memory allocations (<code className="text-emerald-400 font-mono text-[11px]">malloc</code>, <code className="text-emerald-400 font-mono text-[11px]">realloc</code>) are paired with corresponding <code className="text-emerald-400 font-mono text-[11px]">free</code> calls. 25 automated C unit tests prevent memory leaks and pointer corruption.
          </p>
        </div>
      </div>

      {/* Structured Event Trace Specification */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 glass-panel shadow-2xl">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Execution Event Trace Protocol</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Communication between the native C backend and the React frontend adheres to a structured JSON schema:
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "algorithm": "Quick Sort",
  "category": "Sorting",
  "status": "completed",
  "comparisons": 15,
  "swaps": 9,
  "operations": 36,
  "execution_time_us": 108.90,
  "steps": [
    {
      "step": 1,
      "action": "pivot",
      "line": 4,
      "description": "Selected pivot 25 at index 7",
      "indices": [7],
      "array": [29, 10, 14, 37, 13, 42, 18, 25],
      "aux": null
    },
    {
      "step": 2,
      "action": "compare",
      "line": 8,
      "description": "Comparing array[0]=29 with pivot 25",
      "indices": [0, 7],
      "array": [29, 10, 14, 37, 13, 42, 18, 25],
      "aux": null
    },
    {
      "step": 3,
      "action": "swap",
      "line": 12,
      "description": "Swapping array[0] and array[1] to partition smaller elements",
      "indices": [0, 1],
      "array": [10, 29, 14, 37, 13, 42, 18, 25],
      "aux": null
    }
  ]
}`}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 glass-panel shadow-2xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Production Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-emerald-400 font-bold block mb-1">Frontend Engineering</span>
            <p className="text-slate-400 leading-relaxed">
              React 18, TypeScript 5, Vite, Tailwind CSS with custom VS Code dark theme, Framer Motion for spring physics transitions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-sky-400 font-bold block mb-1">C Backend & Microservice</span>
            <p className="text-slate-400 leading-relaxed">
              C11 Standard with Winsock2 HTTP REST Server, microsecond timing via QueryPerformanceCounter, CMake and Makefile build systems.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-purple-400 font-bold block mb-1">Code Editor & Line Sync</span>
            <p className="text-slate-400 leading-relaxed">
              Monaco Code Editor with active delta-decorations synchronizing C execution lines to algorithm steps in real-time.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-amber-400 font-bold block mb-1">Analysis & Charting</span>
            <p className="text-slate-400 leading-relaxed">
              Recharts library for empirical execution time curves, operations comparisons, and asymptotic Big-O orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
