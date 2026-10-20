import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * The design's busy indicator: a single three-quarter arc. Used inside the
 * sign-in button while redirecting to GitHub, and on the settings sign-out
 * button.
 *
 * `components/ui/spinner.tsx` wraps lucide's `Loader2Icon`, which draws a
 * segmented ring rather than one arc — this matches the design instead.
 */
export function ArcSpinner({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("animate-gm-spin-fast", className)}
      {...props}
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
