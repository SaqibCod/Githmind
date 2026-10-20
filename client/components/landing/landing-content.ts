/**
 * Placeholder copy + data for the landing page, lifted from the design export
 * (docs/design/githMind UI Design.html → "githMind Landing").
 *
 * Everything the landing page renders that isn't pure layout lives here, so it
 * can be swapped for real API data later without touching the markup.
 */

export const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Get started", href: "#start" },
] as const;

/** Scrolls behind the "Works with the languages in your repos" eyebrow. */
export const MARQUEE_LANGUAGES = [
  "Java",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Kotlin",
  "C#",
  "Ruby",
] as const;

/**
 * Captions under the hero artwork. Each one cross-fades in sync with the
 * artwork scene of the same index — the design runs both on an 18s loop with
 * 6s offsets, so `delay` must stay aligned with `HERO_SCENES`.
 */
export const HERO_CAPTIONS = [
  { text: "Every repository you own, in one place.", delay: "0s" },
  { text: "Indexed file by file, layer by layer.", delay: "6s" },
  { text: "Answers that cite their sources.", delay: "12s" },
] as const;

/** Node labels orbiting the hero hexagon, with their SVG anchor positions. */
export const HERO_NODES = [
  { label: "Repos", cx: 200, cy: 15, x: 200, y: -6, anchor: "middle", delay: "0s" },
  { label: "Files", cx: 376, cy: 143, x: 392, y: 148, anchor: "start", delay: "2s" },
  { label: "Chunks", cx: 309, cy: 350, x: 309, y: 378, anchor: "middle", delay: "4s" },
  { label: "Citations", cx: 91, cy: 350, x: 91, y: 378, anchor: "middle", delay: "6s" },
  { label: "Answers", cx: 24, cy: 143, x: 8, y: 148, anchor: "end", delay: "8s" },
] as const;

/** Vertices of the slowly-rotating outer hexagon. */
export const HEXAGON_VERTICES = [
  { cx: 200, cy: 2, delay: "0s" },
  { cx: 371, cy: 101, delay: "0.6s" },
  { cx: 371, cy: 299, delay: "1.2s" },
  { cx: 200, cy: 398, delay: "1.8s" },
  { cx: 29, cy: 299, delay: "2.4s" },
  { cx: 29, cy: 101, delay: "0.3s" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect GitHub",
    body: "Sign in with OAuth. Your public and private repositories appear in a single list.",
    accent: "orange",
  },
  {
    step: "02",
    title: "Index a repository",
    body: "Watch files and chunks get processed live. Re-index whenever the code changes.",
    accent: "violet",
  },
  {
    step: "03",
    title: "Chat with citations",
    body: "Replies stream in and finish with up to 8 sources, each pointing at a file and line range.",
    accent: "orange",
  },
] as const;

/** The chat mock-up inside the first feature card. */
export const FEATURE_CHAT_DEMO = {
  repo: "acme/payments-api",
  question: "how does auth work?",
  answer:
    "Requests pass through a session filter that reads the cookie, loads the user, and rejects anything else with a 401",
  citations: [
    { path: "config/SecurityConfig.java:12-48", delay: "0.5s" },
    { path: "auth/SessionFilter.java", delay: "1.2s" },
  ],
} as const;

/** The status pills inside the "Live indexing" feature card. */
export const INDEXING_STATES = [
  { label: "Pending", tone: "neutral" },
  { label: "Indexing", tone: "violet" },
  { label: "Ready", tone: "ok" },
] as const;

/** The two plain text feature cards in the lower half of the band. */
export const FEATURE_CARDS = [
  {
    eyebrow: "Citations",
    title: "Every answer shows its sources",
    body: "Up to 8 relevant snippets are attached to each reply, with the file path and line range when available.",
  },
  {
    eyebrow: "Conversations",
    title: "Chats stay with the repository",
    body: "Start as many chats as you like per repository and pick up an earlier one from the sidebar whenever you return.",
  },
] as const;
