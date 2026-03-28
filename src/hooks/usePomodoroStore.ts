import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { PomodoroSession, TimeEntry } from '../types';
// TimeEntry imported for the callback signature

interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLong: number;
}

const DEFAULT_CONFIG: PomodoroConfig = {
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLong: 4,
};

const EMPTY_SESSIONS: PomodoroSession[] = [];

export function usePomodoroStore(
  onSessionComplete?: (session: PomodoroSession, entry: TimeEntry | null) => void
) {
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('taskflow:pomodoro', EMPTY_SESSIONS);
  const [config, setConfig] = useLocalStorage<PomodoroConfig>('taskflow:pomodoroConfig', DEFAULT_CONFIG);

  const [phase, setPhase] = useState<'work' | 'break' | 'idle'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(config.workMinutes * 60);
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>();
  const [workCount, setWorkCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const finishSession = useCallback(() => {
    clearTimer();
    setIsRunning(false);

    const completedAt = new Date().toISOString();
    const durationMinutes = phase === 'work' ? config.workMinutes : (workCount % config.sessionsBeforeLong === 0 ? config.longBreakMinutes : config.breakMinutes);
    const session: PomodoroSession = {
      id: uuid(),
      taskId: activeTaskId,
      type: phase === 'work' ? 'work' : 'break',
      durationMinutes,
      completedAt,
    };
    setSessions((prev) => [...prev, session]);

    let entry: TimeEntry | null = null;
    if (phase === 'work' && activeTaskId && startedAtRef.current) {
      entry = {
        id: uuid(),
        taskId: activeTaskId,
        startedAt: startedAtRef.current,
        stoppedAt: completedAt,
        durationSeconds: durationMinutes * 60,
        source: 'pomodoro',
      };
    }

    onSessionComplete?.(session, entry);

    const newWorkCount = phase === 'work' ? workCount + 1 : workCount;
    setWorkCount(newWorkCount);

    // auto-switch
    if (phase === 'work') {
      const isLong = newWorkCount % config.sessionsBeforeLong === 0;
      setPhase('break');
      setSecondsLeft((isLong ? config.longBreakMinutes : config.breakMinutes) * 60);
    } else {
      setPhase('work');
      setSecondsLeft(config.workMinutes * 60);
    }
    startedAtRef.current = null;
  }, [phase, config, workCount, activeTaskId, setSessions, onSessionComplete]);

  const startTimer = useCallback((taskId?: string) => {
    if (phase === 'idle') setPhase('work');
    setActiveTaskId(taskId);
    startedAtRef.current = new Date().toISOString();
    setIsRunning(true);
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [phase]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setPhase('idle');
    setSecondsLeft(config.workMinutes * 60);
    startedAtRef.current = null;
  }, [config.workMinutes]);

  // watch for countdown reaching 0
  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      finishSession();
    }
  }, [secondsLeft, isRunning, finishSession]);

  useEffect(() => {
    return clearTimer;
  }, []);

  const todaySessions = sessions.filter(
    (s) => s.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10)
  );

  return {
    sessions,
    todaySessions,
    config,
    setConfig,
    phase,
    secondsLeft,
    isRunning,
    activeTaskId,
    workCount,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
