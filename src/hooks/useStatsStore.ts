import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserStats } from '../types';
import {
  levelFromXP,
  xpToNextLevel,
  ALL_BADGES,
  checkBadgeUnlocks,
} from '../utils/xp';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  badges: ALL_BADGES.map((b) => ({ ...b })),
  totalTasksCompleted: 0,
  totalPomodorosCompleted: 0,
  totalTimeTrackedSeconds: 0,
};

export function useStatsStore() {
  const [stats, setStats] = useLocalStorage<UserStats>('taskflow:stats', DEFAULT_STATS);

  const addXP = useCallback(
    (amount: number) => {
      setStats((prev) => {
        const xp = prev.xp + amount;
        const level = levelFromXP(xp);
        return { ...prev, xp, level };
      });
    },
    [setStats]
  );

  const recordTaskCompleted = useCallback(
    (xpAmount: number, completedAt: string, timerDurationSeconds?: number) => {
      setStats((prev) => {
        const xp = prev.xp + xpAmount;
        const level = levelFromXP(xp);
        const totalTasksCompleted = prev.totalTasksCompleted + 1;
        const existingBadgeIds = prev.badges.filter((b) => b.unlockedAt).map((b) => b.id);
        const newBadgeIds = checkBadgeUnlocks({
          totalTasksCompleted,
          totalPomodorosCompleted: prev.totalPomodorosCompleted,
          currentStreak: 0,
          level,
          lastCompletedAt: completedAt,
          lastTimerDurationSeconds: timerDurationSeconds,
          existingBadgeIds,
        });
        const badges = prev.badges.map((b) =>
          newBadgeIds.includes(b.id) ? { ...b, unlockedAt: completedAt } : b
        );
        return { ...prev, xp, level, totalTasksCompleted, badges };
      });
    },
    [setStats]
  );

  const recordPomodoroCompleted = useCallback(
    (xpAmount: number, completedAt: string) => {
      setStats((prev) => {
        const xp = prev.xp + xpAmount;
        const level = levelFromXP(xp);
        const totalPomodorosCompleted = prev.totalPomodorosCompleted + 1;
        const existingBadgeIds = prev.badges.filter((b) => b.unlockedAt).map((b) => b.id);
        const newBadgeIds = checkBadgeUnlocks({
          totalTasksCompleted: prev.totalTasksCompleted,
          totalPomodorosCompleted,
          currentStreak: 0,
          level,
          existingBadgeIds,
        });
        const badges = prev.badges.map((b) =>
          newBadgeIds.includes(b.id) ? { ...b, unlockedAt: completedAt } : b
        );
        return { ...prev, xp, level, totalPomodorosCompleted, badges };
      });
    },
    [setStats]
  );

  const recordTimeTracked = useCallback(
    (seconds: number) => {
      setStats((prev) => ({
        ...prev,
        totalTimeTrackedSeconds: prev.totalTimeTrackedSeconds + seconds,
      }));
    },
    [setStats]
  );

  const checkStreakBadges = useCallback(
    (currentStreak: number) => {
      setStats((prev) => {
        const existingBadgeIds = prev.badges.filter((b) => b.unlockedAt).map((b) => b.id);
        const newBadgeIds = checkBadgeUnlocks({
          totalTasksCompleted: prev.totalTasksCompleted,
          totalPomodorosCompleted: prev.totalPomodorosCompleted,
          currentStreak,
          level: prev.level,
          existingBadgeIds,
        });
        if (newBadgeIds.length === 0) return prev;
        const now = new Date().toISOString();
        const badges = prev.badges.map((b) =>
          newBadgeIds.includes(b.id) ? { ...b, unlockedAt: now } : b
        );
        return { ...prev, badges };
      });
    },
    [setStats]
  );

  const xpProgress = xpToNextLevel(stats.xp);

  return {
    stats,
    xpProgress,
    addXP,
    recordTaskCompleted,
    recordPomodoroCompleted,
    recordTimeTracked,
    checkStreakBadges,
  };
}
