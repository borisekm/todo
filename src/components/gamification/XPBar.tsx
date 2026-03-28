interface Props {
  xp: number;
  level: number;
  current: number;
  needed: number;
  progress: number;
}

export function XPBar({ xp, level, current, needed, progress }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {level}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Level {level}</div>
            <div className="text-xs text-gray-400">{xp.toLocaleString()} total XP</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {current} / {needed} XP to next level
        </div>
      </div>

      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">{progress}%</div>
    </div>
  );
}
