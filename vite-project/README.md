# SprintDesk

A sprint management dashboard I built for a frontend assignment. It's basically a mini Jira/Trello - login, a kanban board with drag and drop, some charts, and a notification bell that polls in the background.

Live demo: _(add your deployed link here)_
Repo: _(add your github link here)_

---

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite
- TanStack Query v5 - for anything that's "server data" (tasks, sprints, users, comments)
- Zustand - for app-level state (auth, board, notifications, theme)
- Tailwind CSS
- React Router v6
- @dnd-kit - drag and drop on the board
- Recharts - the analytics charts
- Vitest + React Testing Library - tests

No UI library like MUI/Antd/Shadcn was used, everything under `components/ui` is hand built with Tailwind. That was actually one of the more time consuming parts but also probably the point of the assignment.

---

## Running it locally

```bash
npm install
cp .env.example .env
npm run dev
```

Opens on `http://localhost:5173`. For login, use one of DummyJSON's test accounts, e.g.

```
username: emilys
password: emilyspass
```

(You can grab other test usernames from `https://dummyjson.com/users` if you want - password is always `username + "pass"`.)

To run tests:

```bash
npm run test
```

To check the production build:

```bash
npm run build
npm run preview
```

---

## How data flows through the app

This was the part I had to think about the most, so writing it down here.

```
Component  →  Hook (TanStack Query)  →  Service function  →  mockClient.ts / DummyJSON / JSONPlaceholder
```

None of the components ever call `fetch()` directly. Everything goes through a service file in `src/services/`. The idea is that if `mock-data.json` gets swapped for a real backend one day, only the service files need to change - not the components.

There are 3 data sources and each one has exactly one job:

| Source                          | Used for                                               |
| ------------------------------- | ------------------------------------------------------ |
| `mock-data.json` (in `/public`) | users, sprints, tasks, comments, initial notifications |
| DummyJSON (`dummyjson.com`)     | login, refresh token, getting current user             |
| JSONPlaceholder                 | fake notification polling only                         |

### State - where does what live

- **Server state** (tasks, sprints, users, comments) → TanStack Query. Once tasks are loaded the first time, board interactions (move/add/delete/edit) are handled by Zustand instead - TanStack Query doesn't refetch on every drag, that would be wasteful and also DummyJSON/mock data can't persist writes anyway.
- **App state** (auth session, board tasks, notifications, theme) → Zustand, because these need to be shared across components that aren't related to each other (e.g. the notification bell in the header vs the board page).
- **Local UI state** (form inputs, whether a modal is open) → just `useState` inside the component. Didn't see a reason to put that in Zustand.

---

## Auth flow

- Login hits `POST dummyjson.com/auth/login`
- Access token is kept in memory only (Zustand state, not persisted) - if you refresh the page it's gone
- Refresh token goes into `localStorage`
- On app load, if there's a refresh token saved, we call the refresh endpoint to get a new access token, then call `/auth/me` to get the actual logged-in user's info back (needed this because just refreshing the token doesn't give you the username back)
- Axios interceptor attaches `Authorization: Bearer <token>` to every request automatically
- If a request comes back 401, the interceptor refreshes the token once and retries the original request. If two requests fail at the same time, the second one waits in a queue instead of triggering a second refresh call

---

## Kanban board notes

- Drag and drop uses `@dnd-kit` with `useSortable`, so you can drag a task within the same column to reorder it, or drag it into a different column entirely
- Board state persists to `localStorage` through Zustand's `persist` middleware, so refreshing the page doesn't lose your changes
- Comments: since the mock data / DummyJSON can't actually save new data anywhere, new comments you add are kept in local component state and merged with the fetched ones for display. They won't survive a refresh - this is a known limitation, noted below too

---

## Known limitations / what I'd do with more time

Being upfront about what's not fully there instead of hiding it:

- **New comments don't persist across refresh.** Since there's no real backend to write to, I store them in the drawer's local state. A real fix would be a small local "write layer" (like IndexedDB) that merges with the server data on load.
- **Notification polling almost never shows anything new in practice**, because JSONPlaceholder always returns the same 5 posts - there's no way for genuinely "new" data to show up. The logic to detect new post IDs and toast about them is implemented and works, it just won't trigger organically against a static API.
- **Signup wasn't built.** The assignment only asked for login, and DummyJSON can't persist a real signup anyway (you'd get a fake success and then be unable to log in with it), so I intentionally left it out instead of shipping a broken flow.
- **SEO score is lower** in Lighthouse (82) - not something the assignment asked for, and doesn't really apply to a login-gated internal dashboard, so I didn't chase it.

---

## Testing

Three test files under `src/tests/`:

- `boardStore.test.ts` - add/delete/reorder/update task logic in the Zustand board store
- `toast.test.ts` - the toast push/remove logic
- `authInterceptor.test.ts` - session state changes around login/refresh/logout

Run with `npm run test`. All passing as of this submission.

---

## Lighthouse

Ran against the production build (`npm run build && npm run preview`):

- Performance: 98
- Accessibility: 93
- Best Practices: 100
- SEO: 82 (see limitations above)

---

## Folder structure

```
src/
├── pages/           route-level pages (Login, Dashboard, Board, Analytics)
├── components/
│   ├── ui/           Button, Input, Select, Modal, Toast, DataTable, Skeleton
│   ├── layout/        Sidebar, Header, Layout, ProtectedRoute
│   ├── board/          KanbanBoard, KanbanColumn, TaskCard, TaskDrawer, AddTaskModal, DeleteConfirmDialog
│   ├── analytics/       the 4 chart components
│   ├── notifications/    NotificationBell, NotificationPanel
│   └── dashboard/         StatCard, SprintProgress, RecentActivity
├── hooks/            useAuth, useTasks, useUsers, useSprints, useComments, useNotificationsPolling
├── services/         authService, taskService, userService, sprintService, notificationService, apiClient (axios), mockClient (mock json loader)
├── stores/           authStore, boardStore, notificationStore, themeStore
├── types/            Task, User, Sprint, Notification types
├── utils/            constants, analytics helpers, dashboard helpers
└── tests/
```
