interface Props {
  streak: number;
  isPaused: boolean;
  onPause: (days: number) => void;
  onResume: () => void;
}

export function StreakBadge({ streak, isPaused, onPause, onResume }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{isPaused ? '⏸️' : streak > 0 ? '🔥' : '💤'}</div>
          <div>
            <div className="text-2xl font-bold text-white">{streak}</div>
            <div className="text-sm text-gray-400">day streak</div>
          </div>
        </div>

        <div className="flex gap-2">
          {isPaused ? (
            <button
              onClick={onResume}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              Resume
            </button>
          ) : (
            <div className="flex gap-1">
              {[1, 3, 7].map((days) => (
                <button
                  key={days}
                  onClick={() => onPause(days)}
                  className="px-2.5 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-xs hover:bg-gray-700 hover:text-gray-200 transition-colors border border-gray-700"
                  title={`Pause for ${days} day${days > 1 ? 's' : ''}`}
                >
                  Pause {days}d
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isPaused && (
        <p className="text-xs text-yellow-500/80 mt-2">
          Streak paused — it won't break while you're away.
        </p>
      )}
    </div>
  );
}
