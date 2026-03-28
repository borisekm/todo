import { useMemo } from 'react';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';
import type { FilterState } from './TaskFilters';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

interface Props {
  tasks: Task[];
  filters: FilterState;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  activeTimerTaskId?: string | null;
  timerSeconds?: number;
  onStartTimer?: (id: string) => void;
  onStopTimer?: () => void;
}

export function TaskList({
  tasks,
  filters,
  onToggleComplete,
  onEdit,
  onDelete,
  activeTimerTaskId,
  timerSeconds = 0,
  onStartTimer,
  onStopTimer,
}: Props) {
  const filtered = useMemo(() => {
    let result = tasks.filter((t) => t.status !== 'archived');

    if (filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.tag !== 'all') {
      result = result.filter((t) => t.tags.includes(filters.tag));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority':
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

    return result;
  }, [tasks, filters]);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-sm">No tasks match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          isTimerActive={task.id === activeTimerTaskId}
          timerSeconds={task.id === activeTimerTaskId ? timerSeconds : 0}
          onStartTimer={onStartTimer}
          onStopTimer={onStopTimer}
        />
      ))}
    </div>
  );
}
