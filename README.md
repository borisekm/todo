# TaskFlow

A productivity app with task management, Pomodoro timer, time tracking, analytics, and gamification. Runs entirely in the browser — no backend or account required.

## Features

- **Tasks** — create, filter, and complete tasks with priorities, tags, due dates, and time estimates. Supports recurring tasks (daily/weekly/monthly).
- **Pomodoro** — configurable work/break timer that auto-logs sessions and links to tasks.
- **Time tracking** — manual start/stop timer per task, aggregated in analytics.
- **Analytics** — burndown chart, velocity chart, and time-by-project breakdown (Recharts).
- **Calendar** — view tasks by date, including recurring instances.
- **Gamification** — XP, levels, streaks, and 14 unlockable badges tied to task completions and Pomodoros.

## Getting started

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build
```

## Stack

- React 18 + TypeScript (strict)
- Vite + `@tailwindcss/vite` (Tailwind CSS v4)
- Recharts, date-fns, uuid
- All state in `localStorage` — no backend, no auth

## Data

All data lives in `localStorage` under `taskflow:*` keys. Clearing site data resets the app. On first load, sample tasks are seeded automatically.
