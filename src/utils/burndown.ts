import { eachDayOfInterval, format } from 'date-fns';
import type { Task } from '../types';

export interface BurndownPoint {
  date: string;
  scope: number;
  completed: number;
  remaining: number;
}

export function computeBurndown(tasks: Task[], startDate: Date, endDate: Date): BurndownPoint[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const scope = tasks.filter(
      (t) => !t.recurrence && t.createdAt.slice(0, 10) <= dayStr
    ).length;
    const completed = tasks.filter(
      (t) => !t.recurrence && t.completedAt && t.completedAt.slice(0, 10) <= dayStr
    ).length;
    return { date: dayStr, scope, completed, remaining: scope - completed };
  });
}

export interface VelocityPoint {
  date: string;
  count: number;
}

export function computeVelocity(tasks: Task[], days: number): VelocityPoint[] {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);

  return eachDayOfInterval({ start, end }).map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const count = tasks.filter(
      (t) => t.completedAt && t.completedAt.slice(0, 10) === dayStr
    ).length;
    return { date: dayStr, count };
  });
}

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export function computeTimeByProject(
  tasks: Task[],
  timeEntries: { taskId: string; durationSeconds: number }[],
  projects: { id: string; name: string }[]
): PieSlice[] {
  const projectMap = new Map<string, number>();

  for (const entry of timeEntries) {
    const task = tasks.find((t) => t.id === entry.taskId);
    const projectId = task?.projectId ?? '__none__';
    projectMap.set(projectId, (projectMap.get(projectId) ?? 0) + entry.durationSeconds);
  }

  const slices: PieSlice[] = [];
  let colorIdx = 0;
  for (const [projectId, seconds] of projectMap.entries()) {
    if (seconds === 0) continue;
    const project = projects.find((p) => p.id === projectId);
    slices.push({
      name: project?.name ?? 'No Project',
      value: Math.round(seconds / 60),
      color: COLORS[colorIdx++ % COLORS.length],
    });
  }

  return slices.sort((a, b) => b.value - a.value);
}
