import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { TimeEntry } from '../types';

const EMPTY: TimeEntry[] = [];

export function useTimerStore() {
  const [timeEntries, setTimeEntries] = useLocalStorage<TimeEntry[]>('taskflow:timeentries', EMPTY);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback((taskId: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveTaskId(taskId);
    setElapsedSeconds(0);
    startedAtRef.current = new Date().toISOString();
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (!activeTaskId || !startedAtRef.current) return null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const stoppedAt = new Date().toISOString();
    const duration = Math.round((new Date(stoppedAt).getTime() - new Date(startedAtRef.current).getTime()) / 1000);
    const entry: TimeEntry = {
      id: uuid(),
      taskId: activeTaskId,
      startedAt: startedAtRef.current,
      stoppedAt,
      durationSeconds: duration,
      source: 'timer',
    };
    setTimeEntries((prev) => [...prev, entry]);
    setActiveTaskId(null);
    setElapsedSeconds(0);
    startedAtRef.current = null;
    return entry;
  }, [activeTaskId, setTimeEntries]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (!activeTaskId) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, [activeTaskId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const addEntry = useCallback(
    (entry: TimeEntry) => {
      setTimeEntries((prev) => [...prev, entry]);
    },
    [setTimeEntries]
  );

  const totalSecondsForTask = useCallback(
    (taskId: string) =>
      timeEntries
        .filter((e) => e.taskId === taskId)
        .reduce((sum, e) => sum + e.durationSeconds, 0),
    [timeEntries]
  );

  return {
    timeEntries,
    activeTaskId,
    elapsedSeconds,
    isRunning: !!intervalRef.current,
    start,
    stop,
    pause,
    resume,
    addEntry,
    totalSecondsForTask,
  };
}
