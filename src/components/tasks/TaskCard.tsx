import type { Task } from '../../types';
import { PriorityPill } from '../shared/PriorityPill';
import { TagChip } from '../shared/TagChip';
import { format, isPast, parseISO } from 'date-fns';

function formatSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

interface Props {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  timerSeconds?: number;
  isTimerActive?: boolean;
  onStartTimer?: (id: string) => void;
  onStopTimer?: () => void;
  streak?: number;
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  timerSeconds = 0,
  isTimerActive = false,
  onStartTimer,
  onStopTimer,
  streak = 0,
}: Props) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && !isCompleted && isPast(parseISO(task.dueDate + 'T23:59:59'));

  return (
    <div
      className={`group bg-gray-900 border rounded-xl p-4 transition-all duration-200 hover:border-gray-600 ${
        isCompleted ? 'opacity-60 border-gray-800' : isOverdue ? 'border-red-800/50' : 'border-gray-800'
      } ${isTimerActive ? 'ring-1 ring-indigo-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            isCompleted
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-600 hover:border-indigo-500'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`text-sm font-medium leading-snug ${
                isCompleted ? 'line-through text-gray-500' : 'text-gray-100'
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                aria-label="Edit task"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-gray-800"
                aria-label="Delete task"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <PriorityPill priority={task.priority} size="xs" />

            {task.dueDate && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                  isOverdue
                    ? 'text-red-400 bg-red-500/10 border-red-500/30'
                    : 'text-gray-400 bg-gray-800 border-gray-700'
                }`}
              >
                {format(parseISO(task.dueDate), 'MMM d')}
              </span>
            )}

            {task.recurrence && (
              <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
                ↻ {task.recurrence.freq}
              </span>
            )}

            {streak > 0 && (
              <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/30 px-1.5 py-0.5 rounded-full">
                🔥 {streak}
              </span>
            )}

            {task.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>

          {/* Timer row */}
          {!isCompleted && onStartTimer && (
            <div className="flex items-center gap-2 mt-2.5">
              {isTimerActive ? (
                <>
                  <span className="text-xs font-mono text-indigo-400 tabular-nums">
                    {formatSeconds(timerSeconds)}
                  </span>
                  <button
                    onClick={onStopTimer}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full transition-colors"
                  >
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-sm" />
                    Stop
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onStartTimer(task.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30 px-2 py-0.5 rounded-full transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Track time
                </button>
              )}

              {task.estimateMinutes && (
                <span className="text-[10px] text-gray-500">
                  ~{task.estimateMinutes}m
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
