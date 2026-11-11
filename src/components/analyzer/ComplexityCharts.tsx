import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  Clock, 
  Layers, 
  Play, 
  Sparkles, 
  CheckSquare, 
  Square,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { compareAlgorithmsApi } from '../../engine/api';
import { ComparisonResult } from '../../engine/types';

const COMPARABLE_ALGORITHMS = [
  'Quick Sort',
  'Merge Sort',
  'Heap Sort',
  'Insertion Sort',
  'Selection Sort',
  'Bubble Sort',
];

// Big-O Theoretical reference curves
const THEORETICAL_CURVES = [
  { n: 1, 'O(1)': 1, 'O(log n)': 0, 'O(n)': 1, 'O(n log n)': 0, 'O(n²)': 1 },
  { n: 2, 'O(1)': 1, 'O(log n)': 1, 'O(n)': 2, 'O(n log n)': 2, 'O(n²)': 4 },
  { n: 4, 'O(1)': 1, 'O(log n)': 2, 'O(n)': 4, 'O(n log n)': 8, 'O(n²)': 16 },
  { n: 8, 'O(1)': 1, 'O(log n)': 3, 'O(n)': 8, 'O(n log n)': 24, 'O(n²)': 64 },
  { n: 16, 'O(1)': 1, 'O(log n)': 4, 'O(n)': 16, 'O(n log n)': 64, 'O(n²)': 256 },
  { n: 32, 'O(1)': 1, 'O(log n)': 5, 'O(n)': 32, 'O(n log n)': 160, 'O(n²)': 1024 },
];

export const ComplexityCharts: React.FC = () => {
  const [selectedAlgos, setSelectedAlgos] = useState<string[]>([
    'Quick Sort',
    'Merge Sort',
    'Heap Sort',
    'Insertion Sort',
  ]);
  const [arraySize, setArraySize] = useState(60);
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runBenchmark = async () => {
    setIsLoading(true);
    // Generate identical random array for all algorithms
    const testArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 1000));
    try {
      const result = await compareAlgorithmsApi(selectedAlgos, testArr);
      setComparisonData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runBenchmark();
  }, [selectedAlgos, arraySize]);

  const toggleAlgo = (name: string) => {
    if (selectedAlgos.includes(name)) {
      if (selectedAlgos.length > 1) {
        setSelectedAlgos(selectedAlgos.filter((a) => a !== name));
      }
    } else {
      setSelectedAlgos([...selectedAlgos, name]);
    }
  };

  const chartData = comparisonData?.metrics.map((m) => ({
    name: m.name,
    'Time (μs)': m.time_us,
    Comparisons: m.comparisons,
    Swaps: m.swaps,
    Operations: m.operations,
  })) || [];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
            Empirical Benchmark Suite
          </span>
          <span className="text-xs text-slate-400 font-mono">Microsecond Timing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Computational Complexity & Multi-Algorithm Analyzer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Distinguish theoretical Big-O asymptotic bounds from actual measured C execution time across identical datasets.
        </p>
      </div>

      {/* Benchmark Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl glass-panel text-xs">
        {/* Algorithm Checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-mono mr-1">Compare:</span>
          {COMPARABLE_ALGORITHMS.map((algo) => {
            const isChecked = selectedAlgos.includes(algo);
            return (
              <button
                key={algo}
                onClick={() => toggleAlgo(algo)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
                <span>{algo}</span>
              </button>
            );
          })}
        </div>

        {/* Input Size N */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono">Input Size (N): {arraySize}</span>
          <input
            type="range"
            min={10}
            max={200}
            step={10}
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value, 10))}
            className="w-28 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
          />
          <button
            onClick={runBenchmark}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
          >
            <Clock className="w-3.5 h-3.5" /> Run Benchmark
          </button>
        </div>
      </div>

      {/* Grid of Charts: Measured Execution Time & Operation Counts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Measured C Execution Time Chart */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-200 font-mono uppercase tracking-wider">
                Actual Measured C Execution Time (μs)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              N = {arraySize}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Bar dataKey="Time (μs)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparisons & Swaps Chart */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-sm text-slate-200 font-mono uppercase tracking-wider">
                Comparisons vs. Swaps Count
              </h3>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              N = {arraySize}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Comparisons" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Swaps" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Theoretical Big-O Curves Chart */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-200 font-mono uppercase tracking-wider">
              Asymptotic Growth Curves Comparison
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Theoretical Big-O Orders</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={THEORETICAL_CURVES} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="n" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="O(1)" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="O(log n)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="O(n)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="O(n log n)" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="O(n²)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Performance Comparison Table */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-xl overflow-x-auto">
        <h3 className="font-bold text-sm text-slate-200 font-mono uppercase tracking-wider mb-3">
          Detailed Performance Audit Matrix (Input N = {arraySize})
        </h3>
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3">Algorithm</th>
              <th className="py-2.5 px-3">Time Complexity</th>
              <th className="py-2.5 px-3">Space Complexity</th>
              <th className="py-2.5 px-3">Comparisons</th>
              <th className="py-2.5 px-3">Swaps</th>
              <th className="py-2.5 px-3">Total Operations</th>
              <th className="py-2.5 px-3 text-right">C Exec Time (μs)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparisonData?.metrics.map((m) => (
              <tr key={m.name} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-100">{m.name}</td>
                <td className="py-3 px-3 text-emerald-400 font-semibold">{m.time_complexity}</td>
                <td className="py-3 px-3 text-sky-400">{m.space_complexity}</td>
                <td className="py-3 px-3 text-slate-300">{m.comparisons.toLocaleString()}</td>
                <td className="py-3 px-3 text-slate-300">{m.swaps.toLocaleString()}</td>
                <td className="py-3 px-3 text-purple-400 font-semibold">{m.operations.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-400">{m.time_us.toFixed(2)} μs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
