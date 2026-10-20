/**
 * Copy for the OAuth callback screen, from the design export
 * (docs/design/githMind UI Design.html → "githMind Callback").
 *
 * The design gives this screen exactly two states. They map onto the one
 * decision the page makes: `GET /api/auth/me` either returns a user (success,
 * straight on to the dashboard) or 401s (failure, back to sign-in). There is
 * no third state to design for — the page calls nothing else.
 */

export type CallbackState = "loading" | "failed";

export const CALLBACK_COPY: Record<
  CallbackState,
  { title: string; body: string }
> = {
  loading: {
    title: "Signing you in",
    body: "Setting up your session. This only takes a moment.",
  },
  failed: {
    title: "We could not sign you in",
    body: "GitHub approved the request, but your session could not be started. You will be sent back to the sign-in page.",
  },
};

export const CALLBACK_FAILURE = {
  /** The design states the status code outright rather than paraphrasing it. */
  detail: "Session could not be established (401)",
  action: "Back to sign in",
  href: "/login?error=session",
} as const;

/**
 * How long the failed state stays on screen before the page redirects itself.
 * The design's copy promises the user they "will be sent back", so the state
 * is a brief explanation rather than a dead end.
 */
export const CALLBACK_REDIRECT_DELAY_MS = 2500;

/** Staggered delays for the three loading dots. */
export const CALLBACK_DOT_DELAYS = ["0s", "0.2s", "0.4s"] as const;
