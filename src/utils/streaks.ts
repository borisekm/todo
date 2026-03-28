import { parseISO, differenceInCalendarDays, format } from 'date-fns';
import type { StreakRecord } from '../types';

export function computeStreak(history: string[], today: string): Pick<StreakRecord, 'currentStreak' | 'longestStreak' | 'lastCompletionDate'> {
  if (history.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...new Set(history)].sort();
  const lastDate = sorted[sorted.length - 1];
  const todayDate = parseISO(today);
  const lastParsed = parseISO(lastDate);
  const gap = differenceInCalendarDays(todayDate, lastParsed);

  let current = 0;
  if (gap <= 1) {
    // streak is still active
    current = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const diff = differenceInCalendarDays(parseISO(sorted[i]), parseISO(sorted[i - 1]));
      if (diff === 1) current++;
      else break;
    }
  }

  // longest streak
  let longest = 0;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(parseISO(sorted[i]), parseISO(sorted[i - 1]));
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  longest = Math.max(longest, run, current);

  return { currentStreak: current, longestStreak: longest, lastCompletionDate: lastDate };
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isStreakPaused(record: StreakRecord): boolean {
  if (!record.pausedUntil) return false;
  return differenceInCalendarDays(parseISO(record.pausedUntil), parseISO(todayISO())) >= 0;
}
