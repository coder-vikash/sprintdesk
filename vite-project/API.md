# API Documentation — SprintDesk

Listing every external call the app makes. There's no custom backend here - it's a mix of a static mock JSON file, DummyJSON (real auth API), and JSONPlaceholder (fake polling target).

---

## 1. Mock Data — `mock-data.json`

Served as a static file from `/public/mock-data.json`, fetched once and cached in memory (`src/services/mockClient.ts`).

### GET `/mock-data.json`

No params, no auth. Returns the whole file:

```json
{
  "users": [...],
  "sprints": [...],
  "tasks": [...],
  "comments": [...],
  "notifications": [...]
}
```

Everything else below is really just slicing/filtering this response, done in the service files:

| Function                    | File                     | What it returns                 |
| --------------------------- | ------------------------ | ------------------------------- |
| `getTasks()`                | `taskService.ts`         | first 30 items from `tasks`     |
| `getTaskComments(taskId)`   | `taskService.ts`         | `comments` filtered by `taskId` |
| `getUsers()`                | `userService.ts`         | all `users`                     |
| `getUserById(id)`           | `userService.ts`         | one user, filtered client-side  |
| `getSprints()`              | `sprintService.ts`       | all `sprints`                   |
| `getInitialNotifications()` | `notificationService.ts` | all `notifications`             |

Since this is a static file, none of these are real "writes" - `addTask`, `deleteTask`, `updateTask`, `reorderTask` and adding a comment all just update the Zustand store in memory (and localStorage via persist), they never PATCH/POST back to this file.

---

## 2. Auth — DummyJSON

Base URL: `https://dummyjson.com`

### POST `/auth/login`

**Body:**

```json
{ "username": "emilys", "password": "emilyspass" }
```

**Response (200):**

```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "image": "...",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

**Response (400):** wrong credentials, body has a `message` field which is what gets shown on the login form.

Called from `authService.ts → loginRequest()`, triggered by `useAuth().login()`.

---

### POST `/auth/refresh`

**Body:**

```json
{ "refreshToken": "eyJhbGciOi..." }
```

**Response (200):**

```json
{ "accessToken": "eyJhbGciOi...", "refreshToken": "eyJhbGciOi..." }
```

Two callers:

1. On app load, if a refresh token exists in localStorage (session restore)
2. Inside the axios response interceptor, whenever any authenticated request comes back 401

`authService.ts → refreshAccessToken()`

---

### GET `/auth/me`

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):** same user shape as login, minus the tokens. Used right after a token refresh on page load to repopulate the username shown in the header - the refresh endpoint by itself only gives you a new token, not who you are.

`authService.ts → getCurrentUser()`

---

## 3. Notification polling — JSONPlaceholder

Base URL: `https://jsonplaceholder.typicode.com`

### GET `/posts?_limit=5`

No auth needed. Called every 15 seconds via TanStack Query's `refetchInterval`, paused whenever the tab is hidden (`document.visibilitychange` listener flips `refetchInterval` to `false`).

**Response:**

```json
[
  { "userId": 1, "id": 1, "title": "...", "body": "..." },
  ...
]
```

Each `id` from the response is checked against a `Set` of already-seen ids (`useNotificationsPolling.ts`). New ones get pushed into `notificationStore` and, if the notification panel is closed, trigger a toast.

Heads up: JSONPlaceholder is a static mock too, it always returns the same 5 posts with ids 1-5. So after the very first poll, nothing will ever look "new" again in practice - this isn't a bug, there's just no way for genuinely new data to show up from a fake, unchanging endpoint.

---

## Axios instance + interceptor

All DummyJSON calls (except the raw `fetch` ones in `authService.ts`, see note below) go through `apiClient.ts`:

```ts
export const apiClient = axios.create({ baseURL: "https://dummyjson.com" });
```

- **Request interceptor:** attaches `Authorization: Bearer <token>` from `authStore` automatically
- **Response interceptor:** on a 401, refreshes the token once and retries the failed request. Concurrent 401s are queued so only one refresh call fires at a time.

Note: `loginRequest`, `refreshAccessToken`, and `getCurrentUser` in `authService.ts` use plain `fetch` rather than `apiClient`, since they're either not authenticated yet (login) or are the refresh call itself (can't run the interceptor on the thing the interceptor depends on). Everything else authenticated would go through `apiClient`.

---

## Error handling pattern

- Mock data fetch failures throw a plain `Error` with a message, caught by TanStack Query's `isError` state
- Auth failures surface the API's actual `message` field where possible, falling back to a generic "Invalid username or password"
- A failed silent refresh (expired refresh token) triggers `logout()`, which clears state and the interceptor rejects the original request - the app then redirects to `/login` via `ProtectedRoute`
