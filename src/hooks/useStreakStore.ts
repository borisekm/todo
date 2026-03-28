import { useCallback, useMemo } from 'react';
import { addDays, format } from 'date-fns';
import { useLocalStorage } from './useLocalStorage';
import type { StreakRecord } from '../types';
import { computeStreak, todayISO, isStreakPaused } from '../utils/streaks';

const DEFAULT_STREAK: StreakRecord = {
  currentStreak: 0,
  longestStreak: 0,
  history: [],
};

export function useStreakStore() {
  const [streak, setStreak] = useLocalStorage<StreakRecord>('taskflow:streak', DEFAULT_STREAK);

  const recordCompletion = useCallback(() => {
    const today = todayISO();
    setStreak((prev) => {
      if (isStreakPaused(prev)) return prev;
      if (prev.history.includes(today)) return prev;
      const history = [...prev.history, today];
      const computed = computeStreak(history, today);
      return { ...prev, ...computed, history };
    });
  }, [setStreak]);

  const pauseStreak = useCallback((days: number) => {
    const pausedUntil = format(addDays(new Date(), days), 'yyyy-MM-dd');
    setStreak((prev) => ({ ...prev, pausedUntil }));
  }, [setStreak]);

  const resumeStreak = useCallback(() => {
    setStreak((prev) => ({ ...prev, pausedUntil: undefined }));
  }, [setStreak]);

  const isPaused = useMemo(() => isStreakPaused(streak), [streak]);

  const todayCompleted = useMemo(() => streak.history.includes(todayISO()), [streak.history]);

  return { streak, recordCompletion, pauseStreak, resumeStreak, isPaused, todayCompleted };
}
