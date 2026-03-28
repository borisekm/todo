import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isPast,
} from 'date-fns';
import { useTaskStore } from '../hooks/useTaskStore';
import type { Task } from '../types';
import { PriorityPill } from '../components/shared/PriorityPill';

const PRIORITY_DOT: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { getExpandedTasksForRange } = useTaskStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });
  const tasksInRange = getExpandedTasksForRange(calStart, calEnd);

  const tasksByDate = new Map<string, Task[]>();
  for (const task of tasksInRange) {
    if (!task.dueDate) continue;
    const key = task.dueDate;
    if (!tasksByDate.has(key)) tasksByDate.set(key, []);
    tasksByDate.get(key)!.push(task);
  }

  const selectedTasks = selectedDay
    ? tasksByDate.get(format(selectedDay, 'yyyy-MM-dd')) ?? []
    : [];

  return (
    <div className="flex-1 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Calendar</h2>
          <p className="text-sm text-gray-500">{format(currentMonth, 'MMMM yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-gray-500">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {allDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate.get(dateStr) ?? [];
              const inMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const todayDay = isToday(day);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date(0)) ? null : day)}
                  className={`min-h-[72px] p-1.5 border-b border-r border-gray-800 text-left transition-colors hover:bg-gray-800 ${
                    isSelected ? 'bg-indigo-600/20' : ''
                  }`}
                >
                  <div
                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      todayDay
                        ? 'bg-indigo-600 text-white'
                        : inMonth
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map((task) => {
                      const overdue = task.dueDate && task.status !== 'completed' && isPast(parseISO(task.dueDate + 'T23:59:59'));
                      return (
                        <div
                          key={task.id}
                          className={`flex items-center gap-1 text-[10px] truncate rounded px-1 ${
                            task.status === 'completed'
                              ? 'text-gray-500 line-through'
                              : overdue
                              ? 'text-red-400 bg-red-500/10'
                              : 'text-gray-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                          {task.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <div className="text-[10px] text-gray-500 px-1">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          {selectedDay ? (
            <>
              <h3 className="text-sm font-semibold text-white mb-1">
                {format(selectedDay, 'EEEE, MMM d')}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}</p>

              {selectedTasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks due this day.</p>
              ) : (
                <div className="space-y-2">
                  {selectedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.status === 'completed'
                          ? 'border-gray-800 bg-gray-800/50 opacity-60'
                          : 'border-gray-700 bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-sm ${
                            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'
                          }`}
                        >
                          {task.title}
                        </span>
                        <PriorityPill priority={task.priority} size="xs" />
                      </div>
                      {task.recurrence && (
                        <span className="text-[10px] text-purple-400 mt-1 block">↻ recurring</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm">Click a day to see its tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
