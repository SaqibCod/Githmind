import { AlertTriangleIcon } from "@/components/icons/alert-triangle-icon";
import { cn } from "@/lib/utils";

import { LOGIN_BANNERS, type LoginErrorKind } from "./login-content";

/**
 * The sign-in error/warning banner. The design gives the two states the same
 * geometry and only swaps the colour trio: a hard failure (GitHub refused) is
 * red, a recoverable one (session never started) is amber.
 */
export function LoginBanner({ kind }: { kind: LoginErrorKind }) {
  const { tone, message } = LOGIN_BANNERS[kind];

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-gm-lg border px-4 py-3.5 text-gm-base leading-gm-normal",
        tone === "error"
          ? "border-gm-err-bd bg-gm-err-bg text-gm-err-t"
          : "border-gm-warn-bd bg-gm-warn-bg text-gm-warn-t"
      )}
    >
      <AlertTriangleIcon className="mt-0.5 size-4.5 flex-none" />
      <span>{message}</span>
    </div>
  );
}
