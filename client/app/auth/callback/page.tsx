import { CallbackView } from "@/components/auth/callback-view";

/**
 * OAuth return path, ported from docs/design/githMind UI Design.html →
 * "githMind Callback".
 *
 * The backend has already set the session cookie by the time GitHub lands
 * here — the URL carries no token or user data. The page's only job is to
 * call /api/auth/me and route onward, so all of its behaviour lives in the
 * client component.
 */
export default function AuthCallbackPage() {
  return <CallbackView />;
}
