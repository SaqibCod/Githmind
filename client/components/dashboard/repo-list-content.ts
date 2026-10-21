import type { IndexStatus, Repository } from "@/lib/api";

/**
 * Presentation rules and placeholder rows for the repositories screen, from
 * the design export (docs/design/githMind UI Design.html → "githMind
 * Dashboard").
 *
 * Swap `PLACEHOLDER_REPOS` for the `useRepos()` result to go live — it is
 * typed as `Repository[]`, so the row component needs no changes.
 */

/** Per-status chip tone, action label and whether the action is the primary
 *  (filled) button. Keyed by the backend's four index states. */
export const STATUS_PRESENTATION: Record<
  IndexStatus,
  { tone: "ok" | "vi" | "err" | "pe"; action: string; primary: boolean }
> = {
  READY: { tone: "ok", action: "Open chat", primary: true },
  INDEXING: { tone: "vi", action: "View progress", primary: false },
  FAILED: { tone: "err", action: "Retry", primary: false },
  PENDING: { tone: "pe", action: "Index", primary: true },
};

/**
 * Language dot colours. The design maps languages onto its own accent palette
 * rather than the usual brand colours — note this is deliberately different
 * from `components/icons/language-icon.tsx`, which uses real brand hues.
 */
const LANGUAGE_DOT: Record<string, string> = {
  Java: "bg-gm-orange",
  TypeScript: "bg-gm-violet",
  JavaScript: "bg-gm-violet",
  Shell: "bg-gm-green",
};

export function languageDotClass(language: string | null) {
  return (language && LANGUAGE_DOT[language]) || "bg-gm-faint";
}

/**
 * Where a row's action button points. The design sends every non-READY state
 * to the per-repository overview screen, which has no route yet — change this
 * one function once it exists.
 */
export function repoActionHref(repo: Repository) {
  return repo.indexStatus === "READY"
    ? `/chat/${repo.id}`
    : `/dashboard/overview?repo=${repo.id}`;
}

/** `errorMessage` on a READY repo is a partial-success warning, not a failure
 *  — the backend reserves FAILED for genuine failures. */
export function hasIndexWarning(repo: Repository) {
  return repo.indexStatus === "READY" && Boolean(repo.errorMessage);
}

export function progressLabel(repo: Repository) {
  return repo.filesTotal
    ? `${repo.filesProcessed.toLocaleString()} of ${repo.filesTotal.toLocaleString()} files`
    : "";
}

export const DASHBOARD_COPY = {
  heading: "Repositories",
  emptySubtitle: "Index a repository to start chatting with it.",
  filterPlaceholder: "Filter repositories",
  sync: "Sync with GitHub",
  syncing: "Syncing...",
  syncingNotice:
    "Syncing with GitHub. Your current list stays visible until it finishes.",
  loadError: "Could not load your repositories. Check your connection and try again.",
  retry: "Retry",
  emptyTitle: "No repositories yet",
  emptyBody:
    "Your GitHub account has no repositories. Create one on GitHub, then sync to see it here.",
  noMatchTitle: "No matches",
  noMatchBody: "No repository matches that filter.",
  warning: "Indexed with warnings",
  privateLabel: "Private",
  githubLink: "GitHub ↗",
} as const;

export function subtitleFor(count: number) {
  return `${count} ${count === 1 ? "repository" : "repositories"}. Index one to start chatting with it.`;
}

/** Shaped exactly like the API's `Repository`, so this can be swapped out. */
export const PLACEHOLDER_REPOS: Repository[] = [
  {
    id: "1",
    githubRepoId: 1,
    owner: "acme",
    name: "payments-api",
    fullName: "acme/payments-api",
    isPrivate: true,
    defaultBranch: "main",
    language: "Java",
    htmlUrl: "https://github.com/acme/payments-api",
    description: "Billing and invoicing service with webhook handling.",
    indexStatus: "READY",
    indexedAt: "2026-10-21T09:00:00Z",
    chunkCount: 2304,
    filesTotal: 480,
    filesProcessed: 480,
    errorMessage: null,
  },
  {
    id: "2",
    githubRepoId: 2,
    owner: "acme",
    name: "web-app",
    fullName: "acme/web-app",
    isPrivate: false,
    defaultBranch: "main",
    language: "TypeScript",
    htmlUrl: "https://github.com/acme/web-app",
    description: "Customer dashboard built with Next.js.",
    indexStatus: "INDEXING",
    indexedAt: null,
    chunkCount: 1126,
    filesTotal: 480,
    filesProcessed: 240,
    errorMessage: null,
  },
  {
    id: "3",
    githubRepoId: 3,
    owner: "acme",
    name: "ingest-worker",
    fullName: "acme/ingest-worker",
    isPrivate: true,
    defaultBranch: "main",
    language: "Java",
    htmlUrl: "https://github.com/acme/ingest-worker",
    description: "Queue consumer that normalizes incoming events.",
    indexStatus: "READY",
    indexedAt: "2026-10-21T09:00:00Z",
    chunkCount: 2292,
    filesTotal: 480,
    filesProcessed: 480,
    errorMessage: "12 of 480 chunks were skipped after repeated rate-limit errors.",
  },
  {
    id: "4",
    githubRepoId: 4,
    owner: "saq",
    name: "medi-scan",
    fullName: "saq/medi-scan",
    isPrivate: true,
    defaultBranch: "develop",
    language: "TypeScript",
    htmlUrl: "https://github.com/saq/medi-scan",
    description: "Lab report analyzer with retrieval over report text.",
    indexStatus: "FAILED",
    indexedAt: null,
    chunkCount: 640,
    filesTotal: 480,
    filesProcessed: 135,
    errorMessage: "java.net.SocketTimeoutException: Read timed out",
  },
  {
    id: "5",
    githubRepoId: 5,
    owner: "saq",
    name: "dotfiles",
    fullName: "saq/dotfiles",
    isPrivate: false,
    defaultBranch: "main",
    language: "Shell",
    htmlUrl: "https://github.com/saq/dotfiles",
    description: "Shell and editor configuration.",
    indexStatus: "PENDING",
    indexedAt: null,
    chunkCount: 0,
    filesTotal: 0,
    filesProcessed: 0,
    errorMessage: null,
  },
];
