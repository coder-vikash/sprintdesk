# Architecture — SprintDesk

Quick doc explaining how the app is put together and why. Not trying to be a formal spec, just writing down the reasoning so it's clear if someone (or future me) opens this repo cold.

---

## High level

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────────────┐
│  Components │ --> │    Hooks     │ --> │   Services   │ --> │     Data source     │
│  (React)    │     │ (TanStack Q) │     │  (API layer) │     │ mock json / real API│
└─────────────┘     └──────────────┘     └──────────────┘     └────────────────────┘
```

Components never talk to `fetch`/`axios` directly. Everything goes through a hook, and the hook calls a service function. This was the main architectural requirement in the assignment brief, so I stuck to it pretty strictly.

Why bother with this for a project this size? Honestly for a solo project you could get away with less structure, but the whole point of the assignment was to show this pattern, and it does actually pay off once you have 4+ pages all needing the same task data - you're not duplicating fetch logic everywhere.

---

## The three data sources

| Source                         | What it's for                                          | Where it's used                       |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------- |
| `public/mock-data.json`        | users, sprints, tasks, comments, seed notifications    | Board, Analytics, Dashboard, comments |
| `dummyjson.com`                | real login/refresh/current-user API                    | Login page, auth interceptor          |
| `jsonplaceholder.typicode.com` | fake "new post" polling to simulate live notifications | Notification bell                     |

`src/services/mockClient.ts` is the _only_ file that knows `mock-data.json` exists. It fetches it once and caches it in memory (`cachedData` variable) so we're not re-fetching the same 30KB file every time a component asks for tasks. Every other service (`taskService`, `userService`, `sprintService`) just calls `loadMockData()` from that file and slices out whatever it needs.

If this ever needed to point at a real backend instead of the JSON file, in theory you'd only touch `mockClient.ts` (and maybe individual service files if the API shape is different) - the components and hooks wouldn't need to change at all.

---

## State management - the three buckets

I split state into three categories because mixing them tends to cause bugs later (stale server data cached in a global store, or global stores holding stuff that should just be `useState`).

### 1. Server state → TanStack Query

Anything that "comes from an API" - tasks (initial load), users, sprints, comments, the notification poll. TanStack Query handles the loading/error states and caching for free, which saves writing a bunch of `isLoading` booleans by hand.

One nuance: once tasks are loaded into the board the _first_ time, further changes (drag/drop, add, delete, edit) go through Zustand instead of re-fetching. That's intentional - there's no real backend to write to and persist against, so treating the board as "loaded once, then locally managed" made more sense than trying to keep hitting a read-only JSON file.

### 2. App/client state → Zustand

- `authStore` - current user, access token (memory only), auth status
- `boardStore` - the tasks array and all board mutations (reorder/add/delete/update)
- `notificationStore` - notifications list + toast queue
- `themeStore` - light/dark

These all need to be read/written from components that aren't nested inside each other (e.g. the notification bell lives in the header, but a toast can be triggered from the board page) - that's the signal that it needs to be global rather than passed down as props.

### 3. Local state → `useState`

Form inputs, "is this modal open", "is this drawer open" - stuff that only one component (and maybe its direct children) cares about. Didn't see a reason to put a boolean like `isEditing` in Zustand just because Zustand was available.

---

## Auth flow in more detail

```
1. User submits login form
2. POST /auth/login → get { accessToken, refreshToken, user info }
3. accessToken → Zustand (memory only, gone on refresh)
   refreshToken → localStorage (survives refresh)
4. On every request: axios interceptor attaches Authorization: Bearer <accessToken>
5. If a request 401s:
   - interceptor calls /auth/refresh using the stored refresh token
   - gets a new accessToken, retries the original failed request
   - if two requests fail around the same time, only ONE refresh call goes out,
     the second failed request just waits in a small queue for it to finish
6. On page load/refresh:
   - check localStorage for a refresh token
   - if found, refresh immediately + call /auth/me to restore the user's name/email
     (refresh alone only gives you a token back, not who the user is)
   - if refresh fails (expired token etc), log the user out cleanly
```

The queueing bit (step 5) was the trickiest part to get right - without it, if two API calls both got a 401 at roughly the same time, you'd fire two refresh requests instead of one, which is wasteful and can cause race conditions.

---

## Board / drag-and-drop

Using `@dnd-kit` with `useSortable` (not just `useDraggable`), because the assignment wants both:

- moving a task to a different column
- reordering tasks _within_ the same column

Both cases are handled by one function in the store, `reorderTask(taskId, newStatus, newIndex)`. It:

1. pulls the dragged task out of the array
2. splits the rest into "tasks in the target column" vs "everything else"
3. splices the dragged task back into the target column at the right index
4. puts it all back together

Same function whether you're dropping into a new column or just moving up/down in place - the "target column" and "current column" being the same is just a special case, didn't need separate logic for it.

---

## Why no signup

DummyJSON doesn't actually persist new users - a "successful" signup would just be a fake response, and you'd never be able to log in with that account afterward since it doesn't exist server-side. Building a signup form that looks like it works but silently doesn't felt worse than not having one at all, so I left it out. The assignment also only explicitly asked for login.

---

## Known trade-offs (repeated from the README, but worth having here too)

- Comments added via the UI live in local component state, not persisted anywhere - there's nowhere to persist them to.
- Notification polling logic is real (checks for new post IDs, toasts if the panel is closed) but JSONPlaceholder always returns the same 5 posts, so in practice you'll rarely see it trigger organically.
