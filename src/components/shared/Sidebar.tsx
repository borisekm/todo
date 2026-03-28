interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'pomodoro', label: 'Pomodoro', icon: '🍅' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'badges', label: 'Badges', icon: '🏆' },
];

interface Props {
  active: string;
  onNavigate: (page: string) => void;
  xp: number;
  level: number;
  xpProgress: number;
  streak: number;
  isPaused: boolean;
}

export function Sidebar({ active, onNavigate, xp, level, xpProgress, streak, isPaused }: Props) {
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen sticky top-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">TaskFlow</h1>
        <p className="text-xs text-gray-500 mt-0.5">Productivity OS</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        {/* Streak */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{isPaused ? '⏸️' : '🔥'}</span>
          <div>
            <div className="text-sm font-semibold text-white">{streak} day streak</div>
            <div className="text-xs text-gray-500">{isPaused ? 'Paused' : 'Keep it up!'}</div>
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level {level}</span>
            <span>{xp} XP</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
