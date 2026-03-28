import { useState } from 'react';
import type { Task } from '../types';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilters, type FilterState } from '../components/tasks/TaskFilters';
import { TaskModal } from '../components/tasks/TaskModal';
import { useTaskStore } from '../hooks/useTaskStore';
import { useTimerStore } from '../hooks/useTimerStore';
import { useStreakStore } from '../hooks/useStreakStore';
import { useStatsStore } from '../hooks/useStatsStore';
import { xpForTaskCompletion } from '../utils/xp';

const DEFAULT_FILTERS: FilterState = {
  status: 'all',
  priority: 'all',
  tag: 'all',
  search: '',
  sortBy: 'createdAt',
};

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, completeTask, uncompleteTask, allTags } = useTaskStore();
  const { activeTaskId, elapsedSeconds, start: startTimer, stop: stopTimer } = useTimerStore();
  const { recordCompletion } = useStreakStore();
  const { recordTaskCompleted } = useStatsStore();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask({
        title: data.title!,
        description: data.description,
        priority: data.priority ?? 'medium',
        tags: data.tags ?? [],
        dueDate: data.dueDate,
        estimateMinutes: data.estimateMinutes,
        projectId: data.projectId,
        recurrence: data.recurrence,
      });
    }
    setModalOpen(false);
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.status === 'completed') {
      uncompleteTask(id);
    } else {
      completeTask(id);
      recordCompletion();
      const xp = xpForTaskCompletion(task);
      const now = new Date().toISOString();
      recordTaskCompleted(xp, now);
    }
  };

  const handleStopTimer = () => {
    stopTimer();
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending' && !t.recurrence).length;
  const completedToday = tasks.filter(
    (t) => t.completedAt && t.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ).length;

  return (
    <div className="flex-1 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Tasks</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount} pending · {completedToday} done today
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onChange={setFilters} allTags={allTags} />

      {/* Task list */}
      <TaskList
        tasks={tasks}
        filters={filters}
        onToggleComplete={handleToggleComplete}
        onEdit={openEdit}
        onDelete={deleteTask}
        activeTimerTaskId={activeTaskId}
        timerSeconds={elapsedSeconds}
        onStartTimer={startTimer}
        onStopTimer={handleStopTimer}
      />

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          projects={[]}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
