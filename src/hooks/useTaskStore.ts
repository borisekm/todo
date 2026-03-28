import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { Task } from '../types';
import { expandRecurringTask, isRecurringInstance, getTemplateId } from '../utils/recurrence';

const EMPTY: Task[] = [];

export function useTaskStore() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow:tasks', EMPTY);

  const now = () => new Date().toISOString();

  const addTask = useCallback(
    (partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      const task: Task = {
        ...partial,
        id: uuid(),
        status: 'pending',
        createdAt: now(),
        updatedAt: now(),
      };
      setTasks((prev) => [...prev, task]);
      return task.id;
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, changes: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...changes, updatedAt: now() } : t
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );

  const completeTask = useCallback(
    (id: string) => {
      // For recurring instances, mark in a completed-instances set stored on the template
      if (isRecurringInstance(id)) {
        const templateId = getTemplateId(id);
        const instanceDate = id.split('__')[1];
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== templateId) return t;
            const completedInstances: string[] = (t as any).completedInstances ?? [];
            if (completedInstances.includes(instanceDate)) return t;
            return {
              ...t,
              completedInstances: [...completedInstances, instanceDate],
              updatedAt: now(),
            };
          })
        );
        return;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: 'completed', completedAt: now(), updatedAt: now() }
            : t
        )
      );
    },
    [setTasks]
  );

  const uncompleteTask = useCallback(
    (id: string) => {
      if (isRecurringInstance(id)) {
        const templateId = getTemplateId(id);
        const instanceDate = id.split('__')[1];
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== templateId) return t;
            const completedInstances: string[] = (t as any).completedInstances ?? [];
            return {
              ...t,
              completedInstances: completedInstances.filter((d) => d !== instanceDate),
              updatedAt: now(),
            };
          })
        );
        return;
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: 'pending', completedAt: undefined, updatedAt: now() }
            : t
        )
      );
    },
    [setTasks]
  );

  const getExpandedTasksForRange = useCallback(
    (start: Date, end: Date): Task[] => {
      const regular = tasks.filter((t) => !t.recurrence);
      const templates = tasks.filter((t) => !!t.recurrence);
      const instances = templates.flatMap((t) => expandRecurringTask(t, start, end)).map((inst) => {
        const template = templates.find((t) => t.id === getTemplateId(inst.id));
        const completedInstances: string[] = (template as any)?.completedInstances ?? [];
        const instanceDate = inst.id.split('__')[1];
        return completedInstances.includes(instanceDate)
          ? { ...inst, status: 'completed' as const, completedAt: instanceDate + 'T00:00:00.000Z' }
          : inst;
      });
      return [...regular, ...instances];
    },
    [tasks]
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    getExpandedTasksForRange,
    allTags,
  };
}
