import { GithMindMark } from "@/components/icons/githmind-mark";

import type { CallbackState } from "./callback-content";

/**
 * The logo inside a progress ring. While signing in, a quarter-arc sweeps
 * around a neutral track; on failure the arc disappears and the track turns
 * red, so the emblem itself carries the outcome.
 */
export function CallbackEmblem({ state }: { state: CallbackState }) {
  const failed = state === "failed";

  return (
    <div className="relative flex size-24 items-center justify-center">
      <div className="absolute -inset-7.5 animate-gm-breathe-lg rounded-full gm-halo" />

      <svg viewBox="0 0 96 96" className="absolute inset-0 size-24" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r="44"
          fill="none"
          strokeWidth="2"
          className={failed ? "stroke-gm-err-bd" : "stroke-gm-ring"}
        />
        {!failed && (
          <g className="animate-gm-spin-med" style={{ transformOrigin: "48px 48px" }}>
            <path
              d="M48 4 A44 44 0 0 1 92 48"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-gm-orange"
            />
          </g>
        )}
      </svg>

      <GithMindMark className="relative size-8.5" />
    </div>
  );
}
