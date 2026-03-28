import { format, parseISO } from 'date-fns';
import type { PomodoroSession, Task } from '../../types';

interface Props {
  sessions: PomodoroSession[];
  tasks: Task[];
}

export function SessionHistory({ sessions, tasks }: Props) {
  const todaySessions = sessions
    .filter((s) => s.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10))
    .slice()
    .reverse();

  const workSessions = todaySessions.filter((s) => s.type === 'work');
  const totalFocusMinutes = workSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  if (todaySessions.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center text-gray-500">
        <p className="text-sm">No sessions today yet. Start a Pomodoro!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-200">Today's Sessions</h3>
        <span className="text-xs text-gray-400">
          {workSessions.length} 🍅 · {totalFocusMinutes}m focus
        </span>
      </div>

      <div className="space-y-2">
        {todaySessions.map((session) => {
          const task = session.taskId ? tasks.find((t) => t.id === session.taskId) : null;
          return (
            <div
              key={session.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                session.type === 'work' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-green-500/10 border border-green-500/20'
              }`}
            >
              <span className="text-base">{session.type === 'work' ? '🍅' : '☕'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-300">
                  {session.type === 'work' ? `${session.durationMinutes}m focus` : `${session.durationMinutes}m break`}
                </div>
                {task && <div className="text-[10px] text-gray-500 truncate">{task.title}</div>}
              </div>
              <span className="text-[10px] text-gray-500 flex-shrink-0">
                {format(parseISO(session.completedAt), 'h:mm a')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
