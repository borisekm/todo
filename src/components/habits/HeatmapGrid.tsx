import { useMemo } from 'react';
import {
  eachDayOfInterval,
  subDays,
  format,
  getDay,
  startOfDay,
} from 'date-fns';

interface Props {
  history: string[]; // ISO dates
}

const CELL_SIZE = 11;
const CELL_GAP = 2;
const WEEKS = 52;

const INTENSITY_COLORS = [
  '#1f2937', // 0 — empty
  '#1e3a5f', // 1
  '#1e4d8c', // 2
  '#2563eb', // 3
  '#4f46e5', // 4 — max
];

function intensityColor(count: number): string {
  if (count === 0) return INTENSITY_COLORS[0];
  if (count === 1) return INTENSITY_COLORS[1];
  if (count <= 2) return INTENSITY_COLORS[2];
  if (count <= 4) return INTENSITY_COLORS[3];
  return INTENSITY_COLORS[4];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function HeatmapGrid({ history }: Props) {
  const completionMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of history) {
      map[d] = (map[d] ?? 0) + 1;
    }
    return map;
  }, [history]);

  const today = startOfDay(new Date());
  const start = subDays(today, WEEKS * 7 - 1);

  const days = eachDayOfInterval({ start, end: today });

  // Group into weeks (columns)
  const firstDow = getDay(start); // 0=Sun
  const paddedDays: (Date | null)[] = [
    ...Array(firstDow).fill(null),
    ...days,
  ];

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  // Month label positions
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    const firstReal = week.find((d) => d !== null);
    if (firstReal) {
      const m = firstReal.getMonth();
      if (m !== lastMonth) {
        monthPositions.push({ label: MONTH_LABELS[m], col });
        lastMonth = m;
      }
    }
  });

  const totalWidth = weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Completion History</h3>
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="relative h-5 mb-1" style={{ width: totalWidth + 24 }}>
            <div style={{ marginLeft: 24 }}>
              {monthPositions.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute text-[10px] text-gray-500"
                  style={{ left: 24 + col * (CELL_SIZE + CELL_GAP) }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((d, i) => (
                <span
                  key={i}
                  className="text-[9px] text-gray-600 flex items-center"
                  style={{ height: CELL_SIZE, width: 14 }}
                >
                  {i % 2 === 1 ? d : ''}
                </span>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-0.5">
                {week.map((day, dIdx) => {
                  if (!day) {
                    return (
                      <div
                        key={dIdx}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      />
                    );
                  }
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const count = completionMap[dateStr] ?? 0;
                  return (
                    <div
                      key={dIdx}
                      title={`${format(day, 'MMM d, yyyy')}: ${count} completion${count !== 1 ? 's' : ''}`}
                      className="rounded-sm cursor-default transition-opacity hover:opacity-80"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: intensityColor(count),
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-[10px] text-gray-500">Less</span>
            {INTENSITY_COLORS.map((color, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor: color }}
              />
            ))}
            <span className="text-[10px] text-gray-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
