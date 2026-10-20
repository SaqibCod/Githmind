import type { SVGProps } from "react";

/**
 * The design's alert glyph — a sharp-cornered warning triangle. It marks the
 * error and warning banners on sign-in, the OAuth callback, the dashboard,
 * the repo overview, chat and settings.
 *
 * lucide's `TriangleAlert` is the same idea but draws rounded corners, which
 * reads noticeably softer at 18px, so this keeps the design's own path.
 */
export function AlertTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}
