import { useState, useEffect, useRef, useCallback } from 'react';
import { ExecutionTrace, ExecutionStep } from '../engine/types';
import confetti from 'canvas-confetti';

interface UseAnimationPlayerOptions {
  autoPlay?: boolean;
  initialSpeed?: number;
  onComplete?: () => void;
}

export function useAnimationPlayer(
  trace: ExecutionTrace | null,
  options: UseAnimationPlayerOptions = {}
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(options.autoPlay ?? false);
  const [speed, setSpeed] = useState(options.initialSpeed ?? 1);
  const timerRef = useRef<number | null>(null);

  const totalSteps = trace?.steps.length ?? 0;
  const currentStep: ExecutionStep | null =
    trace && trace.steps[currentStepIndex] ? trace.steps[currentStepIndex] : null;

  // Reset when trace changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [trace]);

  const stepForward = useCallback(() => {
    if (!trace || totalSteps === 0) return;
    setCurrentStepIndex((prev) => {
      if (prev + 1 >= totalSteps) {
        setIsPlaying(false);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch (_) {}
        options.onComplete?.();
        return prev;
      }
      return prev + 1;
    });
  }, [trace, totalSteps, options]);

  const stepBackward = useCallback(() => {
    if (!trace || totalSteps === 0) return;
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, [trace, totalSteps]);

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const seek = useCallback((index: number) => {
    if (totalSteps === 0) return;
    const clamped = Math.max(0, Math.min(totalSteps - 1, index));
    setCurrentStepIndex(clamped);
  }, [totalSteps]);

  // Animation interval timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = Math.max(50, Math.round(600 / speed));

    timerRef.current = window.setTimeout(() => {
      stepForward();
    }, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, speed, stepForward]);

  const progress = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return {
    currentStepIndex,
    totalSteps,
    currentStep,
    isPlaying,
    speed,
    progress,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    reset,
    seek,
    setSpeed,
  };
}
