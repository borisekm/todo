import { useCallback, useState } from 'react';
import { PomodoroTimer } from '../components/pomodoro/PomodoroTimer';
import { SessionHistory } from '../components/pomodoro/SessionHistory';
import { usePomodoroStore } from '../hooks/usePomodoroStore';
import { useTaskStore } from '../hooks/useTaskStore';
import { useStatsStore } from '../hooks/useStatsStore';
import { useTimerStore } from '../hooks/useTimerStore';
import { xpForPomodoro } from '../utils/xp';
import type { PomodoroSession, TimeEntry } from '../types';

export function PomodoroPage() {
  const { tasks } = useTaskStore();
  const { recordPomodoroCompleted, recordTimeTracked } = useStatsStore();
  const { addEntry } = useTimerStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  const handleSessionComplete = useCallback(
    (session: PomodoroSession, entry: TimeEntry | null) => {
      if (session.type === 'work') {
        recordPomodoroCompleted(xpForPomodoro(), session.completedAt);
        if (entry) {
          addEntry(entry);
          recordTimeTracked(entry.durationSeconds);
        }
      }
    },
    [recordPomodoroCompleted, addEntry, recordTimeTracked]
  );

  const {
    sessions,
    config,
    setConfig,
    phase,
    secondsLeft,
    isRunning,
    workCount,
    startTimer,
    pauseTimer,
    resetTimer,
  } = usePomodoroStore(handleSessionComplete);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Pomodoro Timer</h2>
        <p className="text-sm text-gray-500 mt-0.5">Focus in intervals, take breaks, get things done.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Timer */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col items-center">
          <PomodoroTimer
            phase={phase}
            secondsLeft={secondsLeft}
            isRunning={isRunning}
            workCount={workCount}
            activeTaskId={selectedTaskId}
            tasks={tasks}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            onSelectTask={setSelectedTaskId}
            workMinutes={config.workMinutes}
            breakMinutes={config.breakMinutes}
          />
        </div>

        {/* Config + History */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Timer Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: 'Focus (min)', key: 'workMinutes', value: config.workMinutes },
                  { label: 'Short break', key: 'breakMinutes', value: config.breakMinutes },
                  { label: 'Long break', key: 'longBreakMinutes', value: config.longBreakMinutes },
                  { label: 'Sessions/long', key: 'sessionsBeforeLong', value: config.sessionsBeforeLong },
                ] as const
              ).map(({ label, key, value }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1">{label}</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={value}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, [key]: Number(e.target.value) }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <SessionHistory sessions={sessions} tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
