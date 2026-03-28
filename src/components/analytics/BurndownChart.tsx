import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BurndownPoint } from '../../utils/burndown';
import { format, parseISO } from 'date-fns';

interface Props {
  data: BurndownPoint[];
}

export function BurndownChart({ data }: Props) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Burndown Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => format(parseISO(d), 'MMM d')}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            labelFormatter={(d) => format(parseISO(d as string), 'MMM d, yyyy')}
            itemStyle={{ color: '#d1d5db' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
          <Line type="monotone" dataKey="scope" name="Scope" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="remaining" name="Remaining" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center h-64 text-gray-500">
      <div className="text-3xl mb-2">📉</div>
      <p className="text-sm">No data yet. Complete some tasks to see the burndown.</p>
    </div>
  );
}
