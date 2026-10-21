import type { SVGProps } from "react";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Sidebar "Repositories" — a 2x2 grid of rounded tiles. */
export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/** Sidebar "Settings" — a gear. */
export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

/** Filter field affordance. */
export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps} strokeLinejoin={undefined} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

/** "Sync with GitHub" — two chasing arrows; spins while syncing. */
export function SyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps} {...props}>
      <path d="M20 11a8 8 0 0 0-14.9-3M4 5v4h4M4 13a8 8 0 0 0 14.9 3M20 19v-4h-4" />
    </svg>
  );
}

/**
 * Empty-state glyph: an open wireframe hexagon. Unlike `GithMindMark` this is
 * a hollow outline with no coloured facets — the design uses it to say
 * "nothing here yet" rather than to brand the page.
 */
export function EmptyRepoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        fill="none"
        strokeWidth="1.2"
        className="stroke-gm-faint"
      />
      <path
        d="M3 7l9 5 9-5M12 12v10"
        fill="none"
        strokeWidth="1.2"
        className="stroke-gm-faint"
      />
    </svg>
  );
}
