import type { Task } from '../../types';

interface Props {
  phase: 'work' | 'break' | 'idle';
  secondsLeft: number;
  isRunning: boolean;
  workCount: number;
  activeTaskId?: string;
  tasks: Task[];
  onStart: (taskId?: string) => void;
  onPause: () => void;
  onReset: () => void;
  onSelectTask: (id: string) => void;
  workMinutes: number;
  breakMinutes: number;
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PomodoroTimer({
  phase,
  secondsLeft,
  isRunning,
  workCount,
  activeTaskId,
  tasks,
  onStart,
  onPause,
  onReset,
  onSelectTask,
  workMinutes,
  breakMinutes,
}: Props) {
  const totalSeconds = phase === 'work' || phase === 'idle' ? workMinutes * 60 : breakMinutes * 60;
  const progress = phase === 'idle' ? 0 : 1 - secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const pendingTasks = tasks.filter((t) => t.status === 'pending' && !t.recurrence);

  const phaseColor = phase === 'work' ? '#6366f1' : phase === 'break' ? '#10b981' : '#4b5563';
  const phaseLabel = phase === 'idle' ? 'Ready' : phase === 'work' ? 'Focus' : 'Break';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular timer */}
      <div className="relative">
        <svg width={200} height={200} viewBox="0 0 200 200" className="-rotate-90">
          {/* Background track */}
          <circle cx={100} cy={100} r={RADIUS} fill="none" stroke="#1f2937" strokeWidth={10} />
          {/* Progress arc */}
          <circle
            cx={100}
            cy={100}
            r={RADIUS}
            fill="none"
            stroke={phaseColor}
            strokeWidth={10}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={phase === 'idle' ? CIRCUMFERENCE : dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium mt-0.5" style={{ color: phaseColor }}>
            {phaseLabel}
          </span>
          <span className="text-xs text-gray-500 mt-0.5">Session {workCount + 1}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
          title="Reset"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {isRunning ? (
          <button
            onClick={onPause}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-medium transition-all"
            style={{ backgroundColor: phaseColor }}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => onStart(activeTaskId)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: phaseColor }}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < workCount % 4 ? 'bg-indigo-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Task selector */}
      {pendingTasks.length > 0 && (
        <div className="w-full max-w-xs">
          <label className="block text-xs text-gray-400 mb-1.5">Linked task</label>
          <select
            value={activeTaskId ?? ''}
            onChange={(e) => onSelectTask(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">No task selected</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
