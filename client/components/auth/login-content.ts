/**
 * Copy and state mapping for the sign-in page, taken from the design export
 * (docs/design/githMind UI Design.html → "githMind Sign in").
 *
 * The design's two banner states line up exactly with the two real error
 * params the backend and callback page produce:
 *   ?error=oauth_failed  — GitHub's success handler rejected the grant
 *                          (SecurityConfig sets this failure URL)
 *   ?error=session       — OAuth succeeded but /api/auth/me 401'd, so the
 *                          callback page bounced back here
 * Anything else is treated as no banner.
 */

export const LOGIN_COPY = {
  heading: "Welcome back",
  subheading:
    "Sign in with GitHub to index your repositories and start asking questions.",
  idleCta: "Continue with GitHub",
  busyCta: "Redirecting to GitHub...",
  scopeNote:
    "You will be sent to github.com and back. GithMind requests the read:user and repo scopes, which it needs to list and read your repositories, including private ones.",
} as const;

export type LoginErrorKind = "oauth_failed" | "session";

export const LOGIN_BANNERS: Record<
  LoginErrorKind,
  { tone: "error" | "warning"; message: string }
> = {
  oauth_failed: {
    tone: "error",
    message:
      "GitHub did not authorize the sign-in. Try again and accept the requested access.",
  },
  session: {
    tone: "warning",
    message: "You signed in, but we could not start your session. Please sign in again.",
  },
};

export function toLoginError(param: string | null): LoginErrorKind | null {
  return param === "oauth_failed" || param === "session" ? param : null;
}

/** Vertices of the slowly-rotating outer hexagon in the sign-in artwork. */
export const LOGIN_HEX_VERTICES = [
  { cx: 200, cy: 18, delay: "0s" },
  { cx: 358, cy: 109, delay: "0.6s" },
  { cx: 358, cy: 291, delay: "1.2s" },
  { cx: 200, cy: 382, delay: "1.8s" },
  { cx: 42, cy: 291, delay: "2.4s" },
  { cx: 42, cy: 109, delay: "0.3s" },
] as const;
