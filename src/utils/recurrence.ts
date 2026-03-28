import {
  addDays,
  addWeeks,
  addMonths,
  isAfter,
  isBefore,
  parseISO,
  format,
  getDay,
} from 'date-fns';
import type { Task } from '../types';

export function expandRecurringTask(
  template: Task,
  rangeStart: Date,
  rangeEnd: Date
): Task[] {
  if (!template.recurrence || !template.dueDate) return [];
  const { freq, interval, daysOfWeek, endDate } = template.recurrence;
  const templateStart = parseISO(template.dueDate);
  const hardEnd = endDate ? parseISO(endDate) : rangeEnd;

  const instances: Task[] = [];
  let cursor = templateStart;

  // advance cursor to range start
  while (isBefore(cursor, rangeStart)) {
    cursor = advance(cursor, freq, interval);
  }

  while (!isAfter(cursor, rangeEnd) && !isAfter(cursor, hardEnd)) {
    if (freq === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
      for (const dow of daysOfWeek) {
        const day = new Date(cursor);
        const delta = (dow - getDay(cursor) + 7) % 7;
        const target = addDays(day, delta);
        if (!isAfter(target, rangeEnd) && !isAfter(target, hardEnd) && !isBefore(target, rangeStart)) {
          instances.push(makeInstance(template, target));
        }
      }
    } else {
      instances.push(makeInstance(template, cursor));
    }
    cursor = advance(cursor, freq, interval);
  }

  return instances;
}

function advance(date: Date, freq: string, interval: number): Date {
  if (freq === 'daily') return addDays(date, interval);
  if (freq === 'weekly') return addWeeks(date, interval);
  return addMonths(date, interval);
}

function makeInstance(template: Task, date: Date): Task {
  return {
    ...template,
    id: `${template.id}__${format(date, 'yyyy-MM-dd')}`,
    dueDate: format(date, 'yyyy-MM-dd'),
    parentTaskId: template.id,
    status: 'pending',
    completedAt: undefined,
    xpAwarded: undefined,
  };
}

export function isRecurringInstance(taskId: string): boolean {
  return taskId.includes('__');
}

export function getTemplateId(instanceId: string): string {
  return instanceId.split('__')[0];
}

export function getInstanceDate(instanceId: string): string | undefined {
  return instanceId.split('__')[1];
}
