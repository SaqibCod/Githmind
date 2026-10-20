import { Suspense } from "react";

import { LoginView } from "@/components/auth/login-view";

/**
 * Sign-in, ported from docs/design/githMind UI Design.html → "githMind Sign in".
 *
 * `LoginView` reads `?error` and `?next` via useSearchParams, which opts the
 * route into client-side rendering and so must sit inside a Suspense boundary
 * — without one the production build fails its prerender pass.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-gm-bg" />}>
      <LoginView />
    </Suspense>
  );
}
