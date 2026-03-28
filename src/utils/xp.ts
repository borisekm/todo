import type { Task, Badge } from '../types';
import { todayISO } from './streaks';

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2700, 3700, 5000, 7000];

export function levelFromXP(xp: number): number {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.max(1, level);
}

export function xpToNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = levelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { current, needed, progress: Math.min(100, Math.round((current / needed) * 100)) };
}

export function xpForTaskCompletion(task: Task): number {
  let xp = 10;
  if (task.priority === 'high') xp += 10;
  if (task.priority === 'medium') xp += 5;
  if (task.dueDate && task.dueDate === todayISO()) xp += 50;
  return xp;
}

export function xpForPomodoro(): number {
  return 5;
}

export function xpForStreakMilestone(streak: number): number {
  const milestones = [7, 14, 30, 60, 100];
  if (milestones.includes(streak)) return 20;
  return 0;
}

export const ALL_BADGES: Badge[] = [
  { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🎯' },
  { id: 'ten_tasks', name: 'Getting Started', description: 'Complete 10 tasks', icon: '🚀' },
  { id: 'fifty_tasks', name: 'Productive', description: 'Complete 50 tasks', icon: '💪' },
  { id: 'hundred_tasks', name: 'Task Master', description: 'Complete 100 tasks', icon: '🏆' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '🔥' },
  { id: 'streak_14', name: 'Fortnight Force', description: '14-day streak', icon: '⚡' },
  { id: 'streak_30', name: 'Monthly Champion', description: '30-day streak', icon: '🌟' },
  { id: 'streak_100', name: 'Centurion', description: '100-day streak', icon: '👑' },
  { id: 'pomodoro_10', name: 'Focus Finder', description: 'Complete 10 Pomodoros', icon: '🍅' },
  { id: 'pomodoro_50', name: 'Deep Worker', description: 'Complete 50 Pomodoros', icon: '🧠' },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a task after midnight', icon: '🦉' },
  { id: 'speed_runner', name: 'Speed Runner', description: 'Complete a task in under 5 minutes', icon: '⚡' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐' },
  { id: 'level_10', name: 'Expert', description: 'Reach level 10', icon: '🏅' },
];

export function checkBadgeUnlocks(params: {
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
  currentStreak: number;
  level: number;
  lastCompletedAt?: string;
  lastTimerDurationSeconds?: number;
  existingBadgeIds: string[];
}): string[] {
  const { totalTasksCompleted, totalPomodorosCompleted, currentStreak, level, lastCompletedAt, lastTimerDurationSeconds, existingBadgeIds } = params;
  const newBadges: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !existingBadgeIds.includes(id)) newBadges.push(id);
  };

  check('first_task', totalTasksCompleted >= 1);
  check('ten_tasks', totalTasksCompleted >= 10);
  check('fifty_tasks', totalTasksCompleted >= 50);
  check('hundred_tasks', totalTasksCompleted >= 100);
  check('streak_7', currentStreak >= 7);
  check('streak_14', currentStreak >= 14);
  check('streak_30', currentStreak >= 30);
  check('streak_100', currentStreak >= 100);
  check('pomodoro_10', totalPomodorosCompleted >= 10);
  check('pomodoro_50', totalPomodorosCompleted >= 50);
  check('level_5', level >= 5);
  check('level_10', level >= 10);

  if (lastCompletedAt) {
    const hour = new Date(lastCompletedAt).getHours();
    check('night_owl', hour >= 0 && hour < 4);
  }
  if (lastTimerDurationSeconds !== undefined) {
    check('speed_runner', lastTimerDurationSeconds <= 300 && lastTimerDurationSeconds > 0);
  }

  return newBadges;
}
