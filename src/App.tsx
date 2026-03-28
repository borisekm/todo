import { useState } from 'react';
import { Sidebar } from './components/shared/Sidebar';
import { TasksPage } from './pages/TasksPage';
import { PomodoroPage } from './pages/PomodoroPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { BadgesPage } from './pages/BadgesPage';
import { useStatsStore } from './hooks/useStatsStore';
import { useStreakStore } from './hooks/useStreakStore';

type Page = 'tasks' | 'pomodoro' | 'analytics' | 'calendar' | 'badges';

export default function App() {
  const [page, setPage] = useState<Page>('tasks');
  const { stats, xpProgress } = useStatsStore();
  const { streak, isPaused } = useStreakStore();

  const renderPage = () => {
    switch (page) {
      case 'tasks': return <TasksPage />;
      case 'pomodoro': return <PomodoroPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'calendar': return <CalendarPage />;
      case 'badges': return <BadgesPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar
        active={page}
        onNavigate={(p) => setPage(p as Page)}
        xp={stats.xp}
        level={stats.level}
        xpProgress={xpProgress.progress}
        streak={streak.currentStreak}
        isPaused={isPaused}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
