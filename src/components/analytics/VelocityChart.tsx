import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { VelocityPoint } from '../../utils/burndown';
import { format, parseISO, isToday } from 'date-fns';

interface Props {
  data: VelocityPoint[];
}

export function VelocityChart({ data }: Props) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-3xl mb-2">📊</div>
        <p className="text-sm">Complete tasks to see your daily velocity.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Daily Velocity</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => format(parseISO(d), 'MMM d')}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            labelFormatter={(d) => format(parseISO(d as string), 'MMM d, yyyy')}
            itemStyle={{ color: '#d1d5db' }}
            formatter={(v) => [v as number, 'Tasks completed']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={isToday(parseISO(entry.date)) ? '#6366f1' : '#4b5563'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
