# githMind API Contract

Reference for building the UI. Every endpoint below was read off the backend source, not inferred.

- Backend: Spring Boot, `http://localhost:8080` (`NEXT_PUBLIC_API_BASE_URL`)
- Frontend: Next.js, `http://localhost:3000` (`app.frontend.url`)
- Controllers: `backend/src/main/java/githMind/backend/controller/`

---

## 1. Transport rules

| Rule | Value |
| --- | --- |
| Auth | Server-side HTTP session cookie `GITHMIND_SESSION` (HttpOnly, SameSite=Lax, 7d) |
| Every request | `credentials: "include"` — no bearer token exists, the cookie is the only credential |
| CSRF | Disabled server-side; no token header needed |
| CORS | Only `http://localhost:3000`, `allowCredentials: true` |
| Content type | `application/json` (except the SSE stream, which responds `text/event-stream`) |
| Protected paths | Everything under `/api/**` except `/api/auth/login-url` |
| Timestamps | ISO-8601 UTC instants, e.g. `2026-10-19T14:03:11.482Z` |
| IDs | UUID strings for all internal entities; `githubRepoId` / `githubId` are JSON **numbers** |

### Error envelope

`GlobalExceptionHandler` returns this shape for 400 / 401 / 404 / 500:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Repository not found",
  "timestamp": "2026-10-19T14:03:11.482Z"
}
```

**UI-relevant exception:** an unauthenticated request to `/api/**` is rejected by `HttpStatusEntryPoint` **before** the handler runs — it returns bare `401` with an **empty body**. Any error renderer must fall back to `res.statusText` when JSON parsing fails, and treat 401 as "session expired → redirect to `/login`" rather than showing a message.

Validation failures (`@NotBlank`, `@NotNull`) return 400 with the **first** field error only, formatted `"<field>: <message>"` — e.g. `"content: must not be blank"`. There is no per-field error map, so forms can only show one message at a time.

---

## 2. Auth

### `GET /api/auth/login-url` — public

```json
{ "url": "/oauth2/authorization/github" }
```

Relative path, meant to be appended to the API base URL.

### GitHub OAuth (browser navigation, not fetch)

```
window.location.href = `${API_BASE}/oauth2/authorization/github`
```

Must be a **full-page navigation**. It is a 302 redirect chain to github.com; XHR/fetch will fail on CORS. Requested scopes: `read:user`, `repo`.

| Outcome | Browser lands on |
| --- | --- |
| Success | `http://localhost:3000/auth/callback` |
| Failure | `http://localhost:3000/login?error=oauth_failed` |

The callback URL carries **no token or user data** — the session cookie is already set. The callback page's only job is to call `GET /api/auth/me` and then route to `/dashboard`, or to `/login?error=session` if that call 401s.

### `GET /api/auth/me`

```ts
type User = {
  id: string;              // UUID
  githubId: number;        // JSON number (Java Long)
  githubUsername: string;
  displayName: string;
  avatarUrl: string | null;
};
```

`401` (empty body) when there is no session. This is the canonical "am I logged in?" probe.

### `POST /api/auth/logout`

`204 No Content`, no body. Invalidates the session and clears `GITHMIND_SESSION`.

### Route guarding

The HttpOnly session cookie is unreadable from JS and from Next middleware. The app therefore keeps a **separate, non-authoritative** JS cookie `githmind_auth=1` (set in `hooks/use-auth.ts`, read in `proxy.ts`) purely to avoid a flash of protected UI. It is a hint, never proof — the real check is a 401 from the API. Design every protected page with a loading state that resolves after `/api/auth/me` returns.

---

## 3. Repositories

```ts
type IndexStatus = "PENDING" | "INDEXING" | "READY" | "FAILED";

type Repository = {
  id: string;                    // UUID — use this for all githMind calls
  githubRepoId: number;
  owner: string;
  name: string;
  fullName: string;              // "owner/name"
  isPrivate: boolean;
  defaultBranch: string;
  language: string | null;
  htmlUrl: string | null;
  description: string | null;
  indexStatus: IndexStatus;
  indexedAt: string | null;      // null until first successful index
  chunkCount: number;
  filesTotal: number;
  filesProcessed: number;
  errorMessage: string | null;
};
```

### `GET /api/repos?refresh={boolean}` → `Repository[]`

`refresh` defaults to **`true`**.

| `refresh` | Behaviour | Latency |
| --- | --- | --- |
| `true` | Calls the GitHub API, upserts every repo, returns the fresh list | **Seconds** — one GitHub request plus a DB write per repo |
| `false` | Reads only from Postgres | Fast |

Sorted by `fullName`, case-insensitive. Never paginated — the full list comes back in one array.

**UI implication:** the dashboard should load with `refresh=false` for an instant first paint and expose an explicit "Sync with GitHub" action that fires `refresh=true` with its own spinner. A cold `refresh=true` on mount will show a long blank skeleton. Also design a **zero-repos** empty state — a GitHub account with no repositories returns `[]`.

### `GET /api/repos/{id}` → `Repository`

`404 "Repository not found"` if the id is unknown **or owned by another user** — ownership failures are deliberately indistinguishable from not-found, so the UI must render both as a plain "not found" page.

### `POST /api/repos/{id}/index` → `202 Accepted` + `Repository`

Starts indexing and returns immediately. The returned repo has `indexStatus: "INDEXING"`, counters reset to `0`, and `errorMessage: null`. Work continues on a background executor.

| Status | When |
| --- | --- |
| `202` | Accepted, job started |
| `400` | `"Repository is already being indexed"` |
| `404` | `"Repository not found"` |

Re-indexing an already-`READY` repo is allowed; it deletes the existing vectors first.

### `GET /api/repos/{id}/status` → `IndexStatusResponse`

```ts
type IndexStatusResponse = {
  repositoryId: string;
  indexStatus: IndexStatus;
  filesTotal: number;        // 0 until the GitHub tree has been walked
  filesProcessed: number;
  chunkCount: number;
  indexedAt: string | null;
  errorMessage: string | null;
};
```

The polling endpoint. Progress is flushed to the DB **every 5 files**, so `filesProcessed` advances in steps of 5, not 1 — a progress bar should animate between samples rather than jump. A 2–3s poll interval matches the write cadence; stop polling on `READY` or `FAILED`.

#### Indexing progress states to design

| State | What the payload looks like | UI |
| --- | --- | --- |
| Not yet indexed | `PENDING`, all counters `0`, `indexedAt: null` | "Index this repo" CTA |
| Enumerating files | `INDEXING`, `filesTotal: 0` | Indeterminate spinner — a percentage is undefined here (division by zero) |
| Indexing | `INDEXING`, `filesTotal > 0` | `filesProcessed / filesTotal` bar + chunk counter |
| Ready | `READY`, `indexedAt` set, `errorMessage: null` | Chat unlocked |
| **Ready with warning** | `READY` **and** `errorMessage` non-null | Chat unlocked **plus** a warning banner |
| Failed | `FAILED`, `errorMessage` set | Error state + "Retry indexing" |

**`errorMessage` is not a failure flag.** On `READY` it carries a partial-index warning such as `"12 of 480 chunks were skipped after repeated rate-limit errors; re-run indexing to fill the gaps"`. Branch on `indexStatus`, never on the presence of `errorMessage`. Failure messages are raw exception text truncated to 2000 characters — render them in a scrollable or clamped container, not a single line, and don't assume they are user-friendly.

---

## 4. Chat

```ts
type ChatSession = {
  id: string;
  repositoryId: string;
  title: string;          // never null — defaults to "Chat with owner/name"
  createdAt: string;
};

type Citation = {
  filePath: string;
  startLine: number | null;
  endLine: number | null;
  language: string | null;
};

type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations: Citation[];   // always an array; empty for user messages
  createdAt: string;
};
```

### `POST /api/chat/sessions` → `ChatSession`

```json
{ "repositoryId": "uuid", "title": "optional" }
```

| Status | When |
| --- | --- |
| `200` | Created (note: **200**, not 201) |
| `400` | `"Repository must be indexed before chatting"` — repo is not `READY` |
| `400` | `"repositoryId: must not be null"` |
| `404` | `"Repository not found"` |

Omitted or blank `title` → `"Chat with owner/name"`. Title is capped at 200 chars by the column; there is no server-side length validation, so **the UI must enforce `maxLength=200`** or the request fails with a 500.

### `GET /api/chat/sessions?repositoryId={uuid}` → `ChatSession[]`

Newest first. `repositoryId` is **required** — omitting it is a 500, not a 400. `404` if the repo isn't owned by the caller. Returns `[]` for a repo with no sessions.

### `GET /api/chat/sessions/{id}` → `ChatMessage[]`

Returns the **messages**, not the session object — despite the URL shape. Oldest first, ready to render top-to-bottom. `404 "Chat session not found"`. Not paginated: a long conversation returns in full, so virtualize if transcripts grow.

### `POST /api/chat/sessions/{id}/messages` → SSE stream

```
Content-Type: text/event-stream
Body: { "content": "how does auth work?" }
```

**`EventSource` cannot be used** — this is a POST with a JSON body and requires cookies. Use `fetch` + `ReadableStream` and parse frames manually (see `client/lib/stream-chat.ts`).

Errors surface **before** the stream opens, as a normal JSON response:

| Status | When |
| --- | --- |
| `400` | `"content: must not be blank"` |
| `400` | `"Repository is not ready for chat"` |
| `404` | `"Chat session not found"` |

Once the stream is open, a mid-stream model failure closes the connection without an error frame. The UI must treat an unexpected close — no `done` event — as a failed turn and offer retry.

#### Event sequence

| # | `event:` | `data:` | UI action |
| --- | --- | --- | --- |
| 1 | `user_message` | `ChatMessage` (role `USER`) | Replace the optimistic bubble with the persisted one (gives it a real id) |
| 2..n | `token` | A **JSON-encoded string**, e.g. `"const "` — `JSON.parse` it, don't use it raw | Append to the streaming assistant bubble |
| n+1 | `assistant_message` | `ChatMessage` (role `ASSISTANT`, with `citations`) | Swap the streamed text for the canonical message and render citations |
| n+2 | `done` | the literal text `[DONE]` — **not** JSON, so don't `JSON.parse` it | Re-enable the composer |

Citations arrive **only at the end**, in `assistant_message` — reserve layout space rather than letting them push the transcript on arrival. Up to 8 chunks are retrieved per question (`RagSettings.TOP_K_CHUNKS`), deduplicated, so expect 0–8 citations. `startLine` / `endLine` / `language` are each independently nullable, so a citation may be a bare file path — `foo/Bar.java:12-48` must degrade to `foo/Bar.java`.

Stream timeout: **180s** (`RagSettings.STREAM_TIMEOUT_MS`). Time-to-first-token is typically 1–3s, so a "thinking…" state between `user_message` and the first `token` is worth designing.

---

## 5. Endpoint summary

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/auth/login-url` | public | `{ url }` |
| `GET` | `/oauth2/authorization/github` | public | 302 redirect chain |
| `GET` | `/api/auth/me` | session | `User` |
| `POST` | `/api/auth/logout` | session | `204` |
| `GET` | `/api/repos?refresh=` | session | `Repository[]` |
| `GET` | `/api/repos/{id}` | session | `Repository` |
| `POST` | `/api/repos/{id}/index` | session | `202` + `Repository` |
| `GET` | `/api/repos/{id}/status` | session | `IndexStatusResponse` |
| `POST` | `/api/chat/sessions` | session | `ChatSession` |
| `GET` | `/api/chat/sessions?repositoryId=` | session | `ChatSession[]` |
| `GET` | `/api/chat/sessions/{id}` | session | `ChatMessage[]` |
| `POST` | `/api/chat/sessions/{id}/messages` | session | SSE stream |

---

## 6. Per-page data contract

### `/login`
Calls nothing on mount (optionally `/api/auth/me` to bounce an already-signed-in user). Sign-in is a full-page navigation to `/oauth2/authorization/github`. Handle `?error=oauth_failed` (GitHub rejected) and `?error=session` (callback couldn't establish a session) as distinct banners.

### `/auth/callback`
Full-screen spinner. One call: `/api/auth/me` → `/dashboard` on success, `/login?error=session` on 401. No other UI.

### `/dashboard` — repository list
`GET /api/repos?refresh=false`, plus an explicit sync action using `refresh=true`.

States: initial skeleton · zero repos (no GitHub repos) · list loaded · syncing (keep the stale list visible, overlay progress) · 401 → redirect.

Per-row data: `fullName`, `description`, `language`, `isPrivate` badge, `defaultBranch`, `htmlUrl` link out, and an `indexStatus` chip driving the row's primary action — `PENDING` → "Index", `INDEXING` → progress, `READY` → "Open chat", `FAILED` → "Retry". A row's `indexStatus` from the list may be stale while a job runs; the authoritative value is `/status`.

### `/dashboard/overview` — repo detail
`GET /api/repos/{id}` once, then poll `GET /api/repos/{id}/status` while `INDEXING`. Needs the full six-state indexing matrix from §3, including the `READY`-with-warning variant, and a `chunkCount` / `filesTotal` stat pair.

### `/chat/[repoId]`
On mount: `GET /api/repos/{repoId}` (gate on `READY`) and `GET /api/chat/sessions?repositoryId={repoId}`. On session select: `GET /api/chat/sessions/{id}`. On send: the SSE stream.

States: repo not `READY` → blocked view pointing back at indexing · no sessions → empty state with a "New chat" CTA · session list + transcript · streaming (composer disabled, stop/abort available via `AbortSignal`) · stream died without `done` → retry affordance.

### `/dashboard/setting`
`GET /api/auth/me` for `displayName`, `githubUsername`, `avatarUrl` (nullable → initials fallback), and `POST /api/auth/logout`. No profile-mutation endpoints exist — everything here is read-only plus sign-out.

---

## 7. Gaps the UI must design around

These are backend absences, not oversights in the client — don't design affordances that have no endpoint behind them.

1. **No delete or rename anywhere.** No `DELETE /api/chat/sessions/{id}`, no session rename, no repo removal, no "clear index". A session's title is fixed at creation.
2. **No pagination on any list.** Repos, sessions, and messages all return complete arrays.
3. **No message-level retry/regenerate endpoint.** Retrying means POSTing the same content as a new turn, which appends a second user message to the transcript.
4. **No server-side indexing cancel.** Once `POST /index` is accepted the job runs to completion or failure; a "Cancel" button cannot be honoured.
5. **No webhook or push channel for index progress** — polling `/status` is the only mechanism.
6. **No profile or preferences endpoints.** Settings is display-only.
7. **401s are bodiless**, so a generic "show `error.message`" toast renders empty for the single most common error. Special-case it.

### Type drift to fix in `client/lib/api.ts`

`User.githubId` is typed `string` but the backend serializes Java `Long` as a JSON **number**. Same for `avatarUrl`, typed `string | null` — correct — while `displayName` is non-null in the DB, so that one is fine. Only `githubId` needs changing to `number`.
