import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Target, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { executeAlgorithmApi } from '../../engine/api';
import { ExecutionTrace } from '../../engine/types';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import { ControlPanel } from '../common/ControlPanel';
import { StatBadge } from '../common/StatBadge';
import { CodeViewer } from '../code/CodeViewer';
import { C_SOURCE_REGISTRY } from '../../engine/cSourceRegistry';

const SEARCH_ALGORITHMS = [
  { id: 'binary-search', name: 'Binary Search', time: 'O(log n)', space: 'O(1)' },
  { id: 'linear-search', name: 'Linear Search', time: 'O(n)', space: 'O(1)' },
  { id: 'jump-search', name: 'Jump Search', time: 'O(√n)', space: 'O(1)' },
  { id: 'interpolation-search', name: 'Interpolation Search', time: 'O(log log n)', space: 'O(1)' },
  { id: 'exponential-search', name: 'Exponential Search', time: 'O(log n)', space: 'O(1)' },
];

export const SearchingVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('binary-search');
  const [sortedArray] = useState<number[]>([4, 9, 14, 22, 29, 35, 41, 52, 63, 70, 84, 91, 105, 120, 138]);
  const [targetValue, setTargetValue] = useState<number>(52);
  const [inputTarget, setInputTarget] = useState('52');
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);

  const player = useAnimationPlayer(trace, { initialSpeed: 1 });

  const runSearch = async (algoId = selectedAlgo, target = targetValue) => {
    player.reset();
    try {
      const data = await executeAlgorithmApi(`/searching/${algoId}`, {
        array: sortedArray,
        target,
      });
      setTrace(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runSearch(selectedAlgo, targetValue);
  }, [selectedAlgo, targetValue]);

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputTarget, 10);
    if (!isNaN(val)) {
      setTargetValue(val);
      runSearch(selectedAlgo, val);
    }
  };

  const currentAux = player.currentStep?.aux || {};
  const currentAction = player.currentStep?.action || '';
  const activeIndices = player.currentStep?.indices || [];

  const codeMeta = C_SOURCE_REGISTRY['binary-search'];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
              Search Suite
            </span>
            <span className="text-xs text-slate-400 font-mono">C11 Native Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Searching Visualizer & Range Engine
          </h1>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl glass-panel">
          {SEARCH_ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgo(algo.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAlgo === algo.id
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Target Setting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl glass-panel text-xs">
        <form onSubmit={handleTargetSubmit} className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Search Target:</span>
          </div>
          <input
            type="number"
            value={inputTarget}
            onChange={(e) => setInputTarget(e.target.value)}
            className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-emerald-400 text-center focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
          >
            Search
          </button>
        </form>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono">Presets:</span>
          {[14, 52, 91, 138, 99].map((val) => (
            <button
              key={val}
              onClick={() => {
                setTargetValue(val);
                setInputTarget(val.toString());
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                targetValue === val
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {val} {val === 99 ? '(Absent)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Track Canvas */}
      <div className="flex flex-col gap-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-2xl relative">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
          <div className="flex flex-wrap items-center gap-2">
            <StatBadge
              icon={Activity}
              label="Comparisons"
              value={trace ? trace.comparisons : 0}
              color="blue"
            />
            <StatBadge
              icon={Target}
              label="Active Target"
              value={targetValue}
              color="emerald"
            />
            <StatBadge
              icon={Clock}
              label="C Exec Time"
              value={trace ? trace.execution_time_us.toFixed(2) : '0.00'}
              unit="μs"
              color="purple"
            />
          </div>

          {/* Outcome Status */}
          {currentAction === 'found' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>TARGET FOUND</span>
            </div>
          )}
          {currentAction === 'not_found' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-xs font-semibold">
              <XCircle className="w-4 h-4" />
              <span>TARGET NOT FOUND</span>
            </div>
          )}
        </div>

        {/* Array Cells Track */}
        <div className="py-8 overflow-x-auto">
          <div className="flex items-center justify-start min-w-[750px] gap-2 mx-auto">
            {sortedArray.map((val, idx) => {
              const isMid = currentAux.mid === idx || (currentAction === 'examine_mid' && activeIndices.includes(idx));
              const isFound = (currentAction === 'found' && activeIndices.includes(idx)) || (val === targetValue && currentAction === 'found');
              const isLow = currentAux.low === idx;
              const isHigh = currentAux.high === idx;
              
              // Region eliminated check
              const isEliminated = (currentAux.low !== undefined && idx < currentAux.low) ||
                                   (currentAux.high !== undefined && idx > currentAux.high);

              let cellStyle = 'bg-slate-800/80 border-slate-700 text-slate-200';
              if (isFound) {
                cellStyle = 'bg-emerald-500 border-emerald-300 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/50 scale-110';
              } else if (isMid) {
                cellStyle = 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-500/40 scale-105';
              } else if (isEliminated) {
                cellStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40 line-through';
              }

              return (
                <div key={idx} className="flex-1 flex flex-col items-center min-w-[44px]">
                  {/* Top Pointer Badges */}
                  <div className="h-6 flex items-center justify-center mb-1 text-[10px] font-mono font-bold">
                    {isFound && <span className="text-emerald-400">FOUND</span>}
                    {!isFound && isMid && <span className="text-amber-400">MID</span>}
                    {!isFound && !isMid && isLow && <span className="text-sky-400">LOW</span>}
                    {!isFound && !isMid && isHigh && <span className="text-purple-400">HIGH</span>}
                  </div>

                  {/* Cell Box */}
                  <motion.div 
                    layout
                    className={`w-full aspect-square flex items-center justify-center rounded-xl border font-mono text-sm shadow-md transition-all ${cellStyle}`}
                  >
                    {val}
                  </motion.div>

                  {/* Bottom Index */}
                  <span className="text-[10px] font-mono text-slate-600 mt-1.5">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500"></span>
            <span>Low Bound</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>Midpoint / Probe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500"></span>
            <span>High Bound</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800 opacity-50"></span>
            <span>Eliminated Search Region</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span>Target Match</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        isPlaying={player.isPlaying}
        currentStepIndex={player.currentStepIndex}
        totalSteps={player.totalSteps}
        currentStep={player.currentStep}
        speed={player.speed}
        progress={player.progress}
        onPlay={player.play}
        onPause={player.pause}
        onTogglePlay={player.togglePlay}
        onStepForward={player.stepForward}
        onStepBackward={player.stepBackward}
        onReset={player.reset}
        onSeek={player.seek}
        onSpeedChange={player.setSpeed}
      />

      {/* C Source Code */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
          C11 Search Implementation
        </h3>
        <CodeViewer
          codeMetadata={codeMeta}
          activeLine={player.currentStep?.line}
          height="340px"
        />
      </div>
    </div>
  );
};
