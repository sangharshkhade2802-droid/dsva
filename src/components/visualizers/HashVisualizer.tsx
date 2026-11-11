import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Plus, 
  Search, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { executeAlgorithmApi } from '../../engine/api';
import { ExecutionTrace } from '../../engine/types';
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer';
import { ControlPanel } from '../common/ControlPanel';
import { StatBadge } from '../common/StatBadge';

export const HashVisualizer: React.FC = () => {
  const [collisionMode, setCollisionMode] = useState<'linear' | 'quadratic' | 'chaining'>('linear');
  const [tableSize, setTableSize] = useState<number>(10);
  const [initialKeys, setInitialKeys] = useState<number[]>([15, 25, 35, 42]);
  const [inputKey, setInputKey] = useState('55');
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);

  const player = useAnimationPlayer(trace, { initialSpeed: 1 });

  const runHashOp = async (op = 'insert', key = parseInt(inputKey, 10)) => {
    player.reset();
    try {
      const data = await executeAlgorithmApi('/data-structures/hash', {
        initial: initialKeys,
        capacity: tableSize,
        mode: collisionMode,
        op,
        value: isNaN(key) ? 55 : key,
      });
      setTrace(data);

      if (op === 'insert' && !isNaN(key) && !initialKeys.includes(key)) {
        setInitialKeys([...initialKeys, key]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runHashOp('insert', 55);
  }, [collisionMode]);

  const displayTable = player.currentStep?.array?.length 
    ? player.currentStep.array 
    : new Array(tableSize).fill(-1);

  const activeIndices = player.currentStep?.indices || [];
  const currentAction = player.currentStep?.action || '';

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Hash-Based Structures
            </span>
            <span className="text-xs text-slate-400 font-mono">Collision Resolution Strategies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hash Table & Collision Resolution Engine
          </h1>
        </div>

        {/* Strategy Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl glass-panel text-xs">
          {[
            { id: 'linear', label: 'Linear Probing' },
            { id: 'quadratic', label: 'Quadratic Probing' },
            { id: 'chaining', label: 'Separate Chaining' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCollisionMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                collisionMode === mode.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl glass-panel text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">Insert Key:</span>
            <input
              type="number"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-20 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 text-center"
            />
          </div>

          <button
            onClick={() => runHashOp('insert')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Insert & Resolve Collisions
          </button>

          <button
            onClick={() => runHashOp('search')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            <Search className="w-3.5 h-3.5" /> Search Key
          </button>
        </div>

        <button
          onClick={() => {
            setInitialKeys([15, 25, 35, 42]);
            runHashOp('insert', 55);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Table
        </button>
      </div>

      {/* Hash Bucket Visualization Canvas */}
      <div className="flex flex-col gap-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl glass-panel shadow-2xl min-h-[350px]">
        {/* Math formula representation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/70 text-xs font-mono text-slate-400">
          <div>
            Primary Hash Function: <span className="text-emerald-400 font-bold">h(k) = k % {tableSize}</span>
          </div>
          <div>
            Active Strategy:{' '}
            <span className="text-sky-400 font-bold uppercase">{collisionMode}</span>
          </div>
        </div>

        {/* Bucket Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5 py-4">
          {displayTable.map((slotVal, slotIdx) => {
            const isTarget = activeIndices.includes(slotIdx);
            const isCollision = currentAction === 'collision' && isTarget;
            const isInserted = currentAction === 'insert' && isTarget;
            const isEmpty = slotVal === -1;

            let borderStyle = 'border-slate-800 bg-slate-950/60';
            let textColor = 'text-slate-400';

            if (isCollision) {
              borderStyle = 'border-rose-500 bg-rose-500/20 text-rose-300 animate-pulse';
              textColor = 'text-rose-300 font-bold';
            } else if (isInserted) {
              borderStyle = 'border-emerald-400 bg-emerald-500/20 text-emerald-300';
              textColor = 'text-emerald-300 font-bold';
            } else if (!isEmpty) {
              borderStyle = 'border-slate-700 bg-slate-800/80 text-white font-bold';
            }

            return (
              <motion.div
                key={slotIdx}
                layout
                className={`flex flex-col rounded-2xl border p-3 items-center justify-between min-h-[100px] shadow-lg transition-all ${borderStyle}`}
              >
                <span className="text-[10px] font-mono text-slate-500">Slot #{slotIdx}</span>

                <div className={`text-base font-mono ${textColor}`}>
                  {isEmpty ? <span className="text-slate-700 text-xs">EMPTY</span> : slotVal}
                </div>

                {/* Chaining Indicator */}
                {collisionMode === 'chaining' && !isEmpty && (
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">
                    Chain: 1 Node
                  </span>
                )}
                {isEmpty && <span className="h-4"></span>}
              </motion.div>
            );
          })}
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
    </div>
  );
};
