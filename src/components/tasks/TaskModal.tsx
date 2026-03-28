import { useEffect, useState } from 'react';
import type { Task, Priority, RecurrenceFreq, Project } from '../../types';
import { TagChip } from '../shared/TagChip';

interface Props {
  task?: Task | null;
  projects: Project[];
  onSave: (data: Partial<Task>) => void;
  onClose: () => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TaskModal({ task, projects, onSave, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState('');
  const [projectId, setProjectId] = useState('');
  const [enableRecurrence, setEnableRecurrence] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceFreq>('daily');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority);
      setTags(task.tags);
      setDueDate(task.dueDate ?? '');
      setEstimateMinutes(task.estimateMinutes?.toString() ?? '');
      setProjectId(task.projectId ?? '');
      if (task.recurrence) {
        setEnableRecurrence(true);
        setRecurrenceFreq(task.recurrence.freq);
        setRecurrenceInterval(task.recurrence.interval);
        setRecurrenceDays(task.recurrence.daysOfWeek ?? []);
        setRecurrenceEndDate(task.recurrence.endDate ?? '');
      }
    }
  }, [task]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const toggleDay = (d: number) =>
    setRecurrenceDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags,
      dueDate: dueDate || undefined,
      estimateMinutes: estimateMinutes ? parseInt(estimateMinutes) : undefined,
      projectId: projectId || undefined,
      recurrence: enableRecurrence
        ? {
            freq: recurrenceFreq,
            interval: recurrenceInterval,
            daysOfWeek: recurrenceFreq === 'weekly' && recurrenceDays.length > 0 ? recurrenceDays : undefined,
            endDate: recurrenceEndDate || undefined,
          }
        : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <input
              autoFocus
              type="text"
              placeholder="Task title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
          />

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Priority</label>
              <div className="flex gap-1">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-red-500/30 border-red-500/50 text-red-300'
                          : p === 'medium'
                          ? 'bg-yellow-500/30 border-yellow-500/50 text-yellow-300'
                          : 'bg-green-500/30 border-green-500/50 text-green-300'
                        : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Estimate + Project */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Estimate (minutes)</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 30"
                value={estimateMinutes}
                onChange={(e) => setEstimateMinutes(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {projects.length > 0 && (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                  if (e.key === ',' || e.key === ' ') { e.preventDefault(); addTag(); }
                }}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <TagChip key={tag} tag={tag} onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))} />
                ))}
              </div>
            )}
          </div>

          {/* Recurrence */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableRecurrence}
                onChange={(e) => setEnableRecurrence(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              Recurring task
            </label>

            {enableRecurrence && (
              <div className="mt-3 space-y-3 pl-1 border-l-2 border-indigo-500/30 ml-2">
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">Every</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
                    className="w-14 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={recurrenceFreq}
                    onChange={(e) => setRecurrenceFreq(e.target.value as RecurrenceFreq)}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="daily">day(s)</option>
                    <option value="weekly">week(s)</option>
                    <option value="monthly">month(s)</option>
                  </select>
                </div>

                {recurrenceFreq === 'weekly' && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">On days:</p>
                    <div className="flex gap-1">
                      {DAYS_OF_WEEK.map((day, i) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(i)}
                          className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                            recurrenceDays.includes(i)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          {day[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-1">End date (optional)</label>
                  <input
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
