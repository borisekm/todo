import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PieSlice } from '../../utils/burndown';

interface Props {
  data: PieSlice[];
}

export function TimeBreakdown({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-3xl mb-2">⏱️</div>
        <p className="text-sm">Track time on tasks to see breakdown by project.</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-200 mb-1">Time by Project</h3>
      <p className="text-xs text-gray-500 mb-4">Total: {Math.floor(total / 60)}h {total % 60}m</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            formatter={(v) => { const n = Number(v); return [`${Math.floor(n / 60)}h ${n % 60}m`, 'Time']; }}
            itemStyle={{ color: '#d1d5db' }}
          />
          <Legend
            formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
