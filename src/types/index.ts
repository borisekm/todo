export type Priority = 'low' | 'medium' | 'high';
export type RecurrenceFreq = 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'completed' | 'archived';

export interface RecurrenceRule {
  freq: RecurrenceFreq;
  interval: number; // every N days/weeks/months
  daysOfWeek?: number[]; // 0=Sun..6=Sat, for weekly
  endDate?: string; // ISO date
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  tags: string[];
  projectId?: string;
  dueDate?: string; // ISO date
  estimateMinutes?: number;
  recurrence?: RecurrenceRule;
  parentTaskId?: string; // for recurring instances
  completedAt?: string; // ISO datetime
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  xpAwarded?: boolean;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startedAt: string; // ISO datetime
  stoppedAt: string; // ISO datetime
  durationSeconds: number;
  source: 'timer' | 'pomodoro';
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  type: 'work' | 'break';
  durationMinutes: number;
  completedAt: string; // ISO datetime
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface StreakRecord {
  taskId?: string; // undefined = global daily streak
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate?: string; // ISO date
  pausedUntil?: string; // ISO date
  history: string[]; // ISO dates when completed
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO datetime; undefined = locked
}

export interface UserStats {
  xp: number;
  level: number;
  badges: Badge[];
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
  totalTimeTrackedSeconds: number;
}

export interface AppState {
  tasks: Task[];
  timeEntries: TimeEntry[];
  pomodoroSessions: PomodoroSession[];
  projects: Project[];
  streak: StreakRecord;
  userStats: UserStats;
}
