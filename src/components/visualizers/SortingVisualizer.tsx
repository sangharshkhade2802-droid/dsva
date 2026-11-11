import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpDown, 
  Shuffle, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame,
  Activity,
  Sliders,
  Send
} from 'lucide-react';
import { executeAlgorithmApi } from '../../engine/api';
import { ExecutionTrace } from '../../engine/types';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import { ControlPanel } from '../common/ControlPanel';
import { StatBadge } from '../common/StatBadge';
import { CodeViewer } from '../code/CodeViewer';
import { C_SOURCE_REGISTRY } from '../../engine/cSourceRegistry';

const SORTING_ALGORITHMS = [
  { id: 'bubble-sort', name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
  { id: 'selection-sort', name: 'Selection Sort', time: 'O(n²)', space: 'O(1)' },
  { id: 'insertion-sort', name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
  { id: 'merge-sort', name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' },
  { id: 'quick-sort', name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' },
  { id: 'heap-sort', name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)' },
  { id: 'counting-sort', name: 'Counting Sort', time: 'O(n + k)', space: 'O(k)' },
  { id: 'radix-sort', name: 'Radix Sort', time: 'O(d(n+b))', space: 'O(n+b)' },
  { id: 'shell-sort', name: 'Shell Sort', time: 'O(n log² n)', space: 'O(1)' },
  { id: 'bucket-sort', name: 'Bucket Sort', time: 'O(n + k)', space: 'O(n)' },
];

export const SortingVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('quick-sort');
  const [arraySize, setArraySize] = useState(14);
  const [currentArray, setCurrentArray] = useState<number[]>([29, 10, 14, 37, 13, 42, 18, 25, 5, 48, 31, 22, 19, 34]);
  const [customInput, setCustomInput] = useState('');
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Player hook
  const player = useAnimationPlayer(trace, { initialSpeed: 1 });

  // Generate presets
  const generateRandom = (size = arraySize) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    setCurrentArray(newArr);
    runAlgorithm(selectedAlgo, newArr);
  };

  const generateNearlySorted = () => {
    const arr = Array.from({ length: arraySize }, (_, i) => (i + 1) * 6);
    // Swap 2 random pairs
    const i1 = Math.floor(Math.random() * (arraySize - 2));
    const t = arr[i1]; arr[i1] = arr[i1 + 1]; arr[i1 + 1] = t;
    setCurrentArray(arr);
    runAlgorithm(selectedAlgo, arr);
  };

  const generateReversed = () => {
    const arr = Array.from({ length: arraySize }, (_, i) => (arraySize - i) * 6 + 10);
    setCurrentArray(arr);
    runAlgorithm(selectedAlgo, arr);
  };

  const runAlgorithm = async (algoId = selectedAlgo, arr = currentArray) => {
    setIsLoading(true);
    player.reset();
    try {
      const data = await executeAlgorithmApi(`/sorting/${algoId}`, { array: arr });
      setTrace(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount or algo change
  useEffect(() => {
    runAlgorithm(selectedAlgo, currentArray);
  }, [selectedAlgo]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const parsed = customInput
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0 && n <= 200);
    if (parsed.length >= 3) {
      setCurrentArray(parsed);
      setArraySize(parsed.length);
      runAlgorithm(selectedAlgo, parsed);
    }
  };

  // Determine current display array and highlights
  const displayArray = player.currentStep?.array?.length ? player.currentStep.array : currentArray;
  const activeIndices = player.currentStep?.indices || [];
  const activeAction = player.currentStep?.action || '';
  const maxVal = Math.max(...displayArray, 100);

  const codeMeta = C_SOURCE_REGISTRY[selectedAlgo] || C_SOURCE_REGISTRY['quick-sort'];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header Title & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Sorting Suite
            </span>
            <span className="text-xs text-slate-400 font-mono">C11 Native Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sorting Visualizer & Execution Engine
          </h1>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl glass-panel">
          {SORTING_ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgo(algo.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAlgo === algo.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Array Configuration & Generator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl glass-panel text-xs">
        {/* Preset Generators */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateRandom()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all font-medium"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Randomize</span>
          </button>
          <button
            onClick={generateNearlySorted}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            Nearly Sorted
          </button>
          <button
            onClick={generateReversed}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            Reversed
          </button>
        </div>

        {/* Size Slider */}
        <div className="flex items-center gap-2.5">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Size: {arraySize}</span>
          <input
            type="range"
            min={6}
            max={32}
            value={arraySize}
            onChange={(e) => {
              const sz = parseInt(e.target.value, 10);
              setArraySize(sz);
              generateRandom(sz);
            }}
            className="w-24 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Custom: 50, 20, 80, 10"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 w-44 font-mono text-xs"
          />
          <button
            type="submit"
            className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
            title="Apply custom array"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Main Visualizer Stage */}
      <div className="flex flex-col gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-2xl relative overflow-hidden">
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
              icon={Flame}
              label="Swaps"
              value={trace ? trace.swaps : 0}
              color="amber"
            />
            <StatBadge
              icon={Sparkles}
              label="Operations"
              value={trace ? trace.operations : 0}
              color="purple"
            />
            <StatBadge
              icon={Clock}
              label="C Exec Time"
              value={trace ? trace.execution_time_us.toFixed(2) : '0.00'}
              unit="μs"
              color="emerald"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Time: <span className="text-emerald-400 font-semibold">{SORTING_ALGORITHMS.find(a => a.id === selectedAlgo)?.time}</span></span>
            <span>•</span>
            <span>Space: <span className="text-sky-400 font-semibold">{SORTING_ALGORITHMS.find(a => a.id === selectedAlgo)?.space}</span></span>
          </div>
        </div>

        {/* Animated Bar Canvas */}
        <div className="min-h-[300px] h-72 flex items-end justify-center gap-1.5 sm:gap-2 pt-8 px-2">
          {displayArray.map((val, idx) => {
            const isComparing = activeAction === 'compare' && activeIndices.includes(idx);
            const isSwapping = (activeAction === 'swap' || activeAction === 'shift' || activeAction === 'overwrite') && activeIndices.includes(idx);
            const isPivot = activeAction === 'pivot' && activeIndices.includes(idx);
            const isSorted = activeAction === 'mark_sorted' && activeIndices.includes(idx);

            let barColor = 'from-slate-700 to-slate-800 border-slate-700/80 text-slate-300';
            if (isComparing) {
              barColor = 'from-amber-400 to-amber-600 border-amber-300 shadow-lg shadow-amber-500/30 text-amber-950 font-bold';
            } else if (isSwapping) {
              barColor = 'from-rose-500 to-rose-600 border-rose-400 shadow-lg shadow-rose-500/40 text-white font-bold';
            } else if (isPivot) {
              barColor = 'from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/40 text-white font-bold';
            } else if (isSorted) {
              barColor = 'from-emerald-400 to-emerald-600 border-emerald-300 shadow-lg shadow-emerald-500/30 text-emerald-950 font-bold';
            }

            const heightPct = Math.max(12, Math.round((val / maxVal) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center max-w-[48px] h-full justify-end group">
                {/* Floating Value pill */}
                <motion.span 
                  animate={{ y: isComparing || isSwapping ? -4 : 0 }}
                  className={`text-[11px] font-mono mb-1 transition-colors ${
                    isComparing ? 'text-amber-400 font-bold' : isSwapping ? 'text-rose-400 font-bold' : isPivot ? 'text-purple-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {val}
                </motion.span>

                {/* Animated Bar */}
                <motion.div
                  layout
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg bg-gradient-to-t border transition-all ${barColor}`}
                />

                {/* Index subscript */}
                <span className="text-[10px] font-mono text-slate-600 mt-1.5 group-hover:text-slate-300">
                  {idx}
                </span>
              </div>
            );
          })}
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-700 border border-slate-600"></span>
            <span>Default</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400"></span>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 border border-rose-400"></span>
            <span>Swapping / Shift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500 border border-purple-400"></span>
            <span>Pivot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400"></span>
            <span>Sorted</span>
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

      {/* Synchronized C Source Code Viewer */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            Synchronized C11 Source Implementation
          </h3>
          <span className="text-xs text-slate-400">
            Monaco editor line automatically highlights active executing C instruction
          </span>
        </div>
        <CodeViewer
          codeMetadata={codeMeta}
          activeLine={player.currentStep?.line}
          height="380px"
        />
      </div>
    </div>
  );
};
