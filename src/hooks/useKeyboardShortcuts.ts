import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onTogglePlay?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onReset?: () => void;
  onOpenSearch?: () => void;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onOpenSearch,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if typing in an input, textarea or monaco editor
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('.monaco-editor')
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch?.();
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          onTogglePlay?.();
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          onStepForward?.();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          onStepBackward?.();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onReset?.();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onStepForward, onStepBackward, onReset, onOpenSearch]);
}
