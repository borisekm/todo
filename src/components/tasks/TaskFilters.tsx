import type { Priority } from '../../types';

export interface FilterState {
  status: 'all' | 'pending' | 'completed';
  priority: Priority | 'all';
  tag: string | 'all';
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
}

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  allTags: string[];
}

const PRIORITY_OPTIONS: Array<{ value: FilterState['priority']; label: string }> = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

const STATUS_OPTIONS: Array<{ value: FilterState['status']; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Done' },
];

const SORT_OPTIONS: Array<{ value: FilterState['sortBy']; label: string }> = [
  { value: 'createdAt', label: 'Created' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export function TaskFilters({ filters, onChange, allTags }: Props) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Status */}
      <div className="flex rounded-lg border border-gray-700 overflow-hidden">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => set('status', opt.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              filters.status === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => set('priority', e.target.value as FilterState['priority'])}
        className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Tag */}
      {allTags.length > 0 && (
        <select
          value={filters.tag}
          onChange={(e) => set('tag', e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      )}

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => set('sortBy', e.target.value as FilterState['sortBy'])}
        className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
