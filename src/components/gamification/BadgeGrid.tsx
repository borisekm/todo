import { format, parseISO } from 'date-fns';
import type { Badge } from '../../types';

interface Props {
  badges: Badge[];
}

export function BadgeGrid({ badges }: Props) {
  const unlocked = badges.filter((b) => b.unlockedAt);
  const locked = badges.filter((b) => !b.unlockedAt);

  return (
    <div className="space-y-4">
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Earned ({unlocked.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {unlocked.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Locked ({locked.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {locked.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} locked />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, locked = false }: { badge: Badge; locked?: boolean }) {
  return (
    <div
      className={`relative rounded-xl border p-4 text-center transition-all ${
        locked
          ? 'bg-gray-900 border-gray-800 opacity-40 grayscale'
          : 'bg-gray-900 border-indigo-500/30 bg-gradient-to-b from-indigo-500/5 to-transparent'
      }`}
      title={locked ? `Locked: ${badge.description}` : badge.description}
    >
      {!locked && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
      )}
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className={`text-xs font-semibold ${locked ? 'text-gray-500' : 'text-gray-200'}`}>
        {badge.name}
      </div>
      <div className={`text-[10px] mt-0.5 ${locked ? 'text-gray-600' : 'text-gray-400'}`}>
        {badge.description}
      </div>
      {badge.unlockedAt && (
        <div className="text-[10px] text-indigo-400 mt-1">
          {format(parseISO(badge.unlockedAt), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}
