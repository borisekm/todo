import { BadgeGrid } from '../components/gamification/BadgeGrid';
import { XPBar } from '../components/gamification/XPBar';
import { StreakBadge } from '../components/habits/StreakBadge';
import { HeatmapGrid } from '../components/habits/HeatmapGrid';
import { useStatsStore } from '../hooks/useStatsStore';
import { useStreakStore } from '../hooks/useStreakStore';

export function BadgesPage() {
  const { stats, xpProgress } = useStatsStore();
  const { streak, isPaused, pauseStreak, resumeStreak } = useStreakStore();

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Achievements</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your progress, streaks, and earned badges.</p>
      </div>

      <XPBar
        xp={stats.xp}
        level={stats.level}
        current={xpProgress.current}
        needed={xpProgress.needed}
        progress={xpProgress.progress}
      />

      <StreakBadge
        streak={streak.currentStreak}
        isPaused={isPaused}
        onPause={pauseStreak}
        onResume={resumeStreak}
      />

      <HeatmapGrid history={streak.history} />

      <div>
        <h3 className="text-base font-semibold text-white mb-4">Badges</h3>
        <BadgeGrid badges={stats.badges} />
      </div>
    </div>
  );
}
