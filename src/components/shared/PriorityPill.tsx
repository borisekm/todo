import type { Priority } from '../../types';

const styles: Record<Priority, string> = {
  high: 'bg-red-500/20 text-red-400 border border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

const labels: Record<Priority, string> = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
};

interface Props {
  priority: Priority;
  size?: 'sm' | 'xs';
}

export function PriorityPill({ priority, size = 'sm' }: Props) {
  return (
    <span
      className={`${styles[priority]} ${size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded-full font-medium`}
    >
      {labels[priority]}
    </span>
  );
}
