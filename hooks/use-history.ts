import { useState, useCallback, useRef } from 'react';

interface HistoryState {
  content: string;
  timestamp: number;
}

export function useHistory(initialContent: string = '') {
  const [history, setHistory] = useState<HistoryState[]>([{ content: initialContent, timestamp: Date.now() }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxHistorySize = 50;

  const addToHistory = useCallback((content: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ content, timestamp: Date.now() });

      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => Math.max(0, prev));
        return newHistory;
      }

      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].content;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].content;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const getCurrentContent = () => history[currentIndex]?.content || '';

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentContent,
  };
}
