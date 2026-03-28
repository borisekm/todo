import { useMemo } from 'react';
import { subDays } from 'date-fns';
import { BurndownChart } from '../components/analytics/BurndownChart';
import { VelocityChart } from '../components/analytics/VelocityChart';
import { TimeBreakdown } from '../components/analytics/TimeBreakdown';
import { useTaskStore } from '../hooks/useTaskStore';
import { useTimerStore } from '../hooks/useTimerStore';
import { useStatsStore } from '../hooks/useStatsStore';
import { computeBurndown, computeVelocity, computeTimeByProject } from '../utils/burndown';

export function AnalyticsPage() {
  const { tasks } = useTaskStore();
  const { timeEntries } = useTimerStore();
  const { stats } = useStatsStore();

  const burndown = useMemo(
    () => computeBurndown(tasks, subDays(new Date(), 29), new Date()),
    [tasks]
  );

  const velocity = useMemo(
    () => computeVelocity(tasks, 14),
    [tasks]
  );

  const timeByProject = useMemo(
    () => computeTimeByProject(tasks, timeEntries, []),
    [tasks, timeEntries]
  );

  const totalTrackedHours = Math.floor(stats.totalTimeTrackedSeconds / 3600);
  const totalTrackedMins = Math.floor((stats.totalTimeTrackedSeconds % 3600) / 60);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Track your progress over time.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Tasks completed', value: stats.totalTasksCompleted, icon: '✓' },
          { label: 'Pomodoros', value: stats.totalPomodorosCompleted, icon: '🍅' },
          { label: 'Time tracked', value: `${totalTrackedHours}h ${totalTrackedMins}m`, icon: '⏱️' },
          { label: 'Current level', value: `Lvl ${stats.level}`, icon: '⭐' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <BurndownChart data={burndown} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VelocityChart data={velocity} />
        <TimeBreakdown data={timeByProject} />
      </div>
    </div>
  );
}
