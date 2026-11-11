import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Gauge, 
  Code2,
  Activity
} from 'lucide-react';
import { ExecutionStep } from '../../engine/types';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: ExecutionStep | null;
  speed: number;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  currentStepIndex,
  totalSteps,
  currentStep,
  speed,
  progress,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onSeek,
  onSpeedChange,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl glass-panel shadow-xl">
      {/* Current Step Description & Line Badge */}
      <div className="flex items-center justify-between gap-3 min-h-[38px] px-3 py-2 bg-slate-950/70 border border-slate-800/80 rounded-xl">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span className="text-xs font-medium text-slate-200 truncate">
            {currentStep?.description || (totalSteps === 0 ? 'Ready. Select input and run algorithm.' : 'Execution ready')}
          </span>
        </div>
        {currentStep && currentStep.line > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 shrink-0">
            <Code2 className="w-3 h-3" />
            <span>Line {currentStep.line}</span>
          </div>
        )}
      </div>

      {/* Progress scrub bar */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(parseInt(e.target.value, 10))}
            disabled={totalSteps <= 1}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          />
        </div>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex <= 0 || totalSteps === 0}
            title="Step Backward (ArrowLeft / J)"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onTogglePlay}
            disabled={totalSteps === 0}
            title="Play / Pause (Space)"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold glow-emerald'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{currentStepIndex >= totalSteps - 1 && totalSteps > 0 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1 || totalSteps === 0}
            title="Step Forward (ArrowRight / L)"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={currentStepIndex === 0 && !isPlaying}
            title="Reset (R)"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 px-2 py-1 rounded-xl">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Speed:</span>
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                speed === s
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
