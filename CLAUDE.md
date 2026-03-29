# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

There is no test framework configured.

## Architecture

**TaskFlow** is a single-page React 18 + TypeScript app. All state is persisted to localStorage via custom hooks — no backend, no external state library.

### State management

Each feature slice has a dedicated store hook in `src/hooks/`:

| Hook | localStorage key | Responsibility |
|------|-----------------|----------------|
| `useTaskStore` | `taskflow:tasks` | Task CRUD, recurring expansion |
| `useStatsStore` | `taskflow:stats` | XP, level, badge unlocks |
| `useStreakStore` | `taskflow:streak` | Daily completion streaks |
| `usePomodoroStore` | `taskflow:pomodoro` + `taskflow:pomodoroConfig` | Pomodoro timer & sessions |
| `useTimerStore` | `taskflow:timeentries` | Manual time tracking |

`useLocalStorage<T>(key, default)` is the generic persistence primitive used by all stores.

### Routing

`App.tsx` uses a single `useState<Page>` — no router library. The five pages are `tasks`, `pomodoro`, `analytics`, `calendar`, `badges`.

### Recurring tasks

Templates are stored once in `taskflow:tasks` with a `recurrence` field. Instances are generated on-the-fly by `expandRecurringTask(template, start, end)` in `src/utils/recurrence.ts`. Instance IDs follow the pattern `${templateId}__${yyyy-MM-dd}`. Completions are tracked in `template.completedInstances: string[]`.

### Gamification

XP rules and badge logic live in `src/utils/xp.ts`. Badge unlock checks run inside `useStatsStore` when tasks complete, pomodoros complete, or streak milestones are hit. Level thresholds are in `LEVEL_THRESHOLDS`.

### Seeding

`src/seed.ts` is called once from `main.tsx` (`seedIfEmpty()`) to populate sample data when localStorage is empty.

## Key conventions

- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`)
- TailwindCSS v4: uses `@tailwindcss/vite` plugin (not postcss); `@import "tailwindcss"` in `index.css` (no `@tailwind` directives)
- All localStorage keys are prefixed `taskflow:`
- Pure utility functions (no React) go in `src/utils/`; store hooks go in `src/hooks/`; page-level components go in `src/pages/`; reusable UI in `src/components/`
