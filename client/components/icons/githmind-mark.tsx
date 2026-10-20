import type { SVGProps } from "react";

/**
 * The githMind hexagon mark from docs/design/githMind UI Design.html — an
 * outlined hexagon with a three-facet cube inside it.
 *
 * Not to be confused with `GithMindIcon`/`GithMindLogo` in `githMind-icon.tsx`,
 * which are leftover placeholder artwork (see CLAUDE.md).
 */
export function GithMindMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}>
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        fill="none"
        strokeWidth="1.6"
        className="stroke-gm-logo-ring"
      />
      <polygon points="12,7 16.5,9.5 12,12 7.5,9.5" className="fill-gm-logo" />
      <polygon points="7.5,9.5 12,12 12,17 7.5,14.5" className="fill-gm-violet" />
      <polygon points="16.5,9.5 12,12 12,17 16.5,14.5" className="fill-gm-orange" />
    </svg>
  );
}
