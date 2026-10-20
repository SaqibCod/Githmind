import { LOGIN_HEX_VERTICES } from "./login-content";

/** The design's four face gradients, emitted under a caller-supplied prefix
 *  so the two artworks on this page never share gradient ids. */
function FaceGradients({ prefix }: { prefix: string }) {
  return (
    <>
      <linearGradient id={`${prefix}-a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd9a8" />
        <stop offset="1" stopColor="#d9822b" />
      </linearGradient>
      <linearGradient id={`${prefix}-v`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b9aeff" />
        <stop offset="1" stopColor="#4a3bb5" />
      </linearGradient>
      <linearGradient id={`${prefix}-s`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f4f4f8" />
        <stop offset="1" stopColor="#7d7d8c" />
      </linearGradient>
      <linearGradient id={`${prefix}-d`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#15151c" />
        <stop offset="1" stopColor="#3a3a48" />
      </linearGradient>
    </>
  );
}

/**
 * Desktop artwork: a rotating hexagon lattice with a single orbiting dot,
 * wrapped around the bobbing polyhedron. Hidden below 640px, where the
 * design swaps in `LoginMark` above the heading instead.
 */
export function LoginArtwork() {
  return (
    <div className="relative aspect-square w-full max-w-115">
      <div className="absolute inset-[12%] animate-gm-breathe rounded-full gm-halo" />

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 size-full"
        role="img"
        aria-label="Faceted amber and violet polyhedron inside a rotating network hexagon"
      >
        <defs>
          <FaceGradients prefix="gm-login" />
          <filter id="gm-login-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <g
          className="animate-gm-spin-slow gm-view-box"
          style={{ transformOrigin: "200px 200px" }}
        >
          <g className="fill-none stroke-gm-net" strokeWidth={1}>
            <polygon points="200,18 358,109 358,291 200,382 42,291 42,109" />
            <polygon points="200,60 322,130 322,270 200,340 78,270 78,130" opacity={0.5} />
            <path
              d="M42 109 L120 150 M358 109 L280 150 M200 382 L200 300 M42 291 L110 250 M358 291 L290 250 M200 18 L200 100"
              opacity={0.6}
            />
          </g>
          <g className="fill-gm-node">
            {LOGIN_HEX_VERTICES.map((v) => (
              <circle
                key={`${v.cx}-${v.cy}`}
                cx={v.cx}
                cy={v.cy}
                r={3}
                className="animate-gm-twinkle"
                style={{ animationDelay: v.delay }}
              />
            ))}
          </g>
        </g>

        <circle
          cx={200}
          cy={200}
          r={150}
          className="fill-none stroke-gm-net"
          strokeWidth={1}
        />
        <g
          className="animate-gm-spin-ring gm-view-box"
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle cx={200} cy={50} r={5} className="fill-gm-orange" filter="url(#gm-login-glow)" />
          <circle cx={200} cy={50} r={3} className="fill-gm-node" />
        </g>

        <g className="animate-gm-bob gm-fill-box">
          <polygon points="200,100 280,146 200,192 120,146" fill="url(#gm-login-s)" />
          <polygon points="120,146 200,192 200,284 120,238" fill="url(#gm-login-v)" />
          <polygon points="280,146 200,192 200,284 280,238" fill="url(#gm-login-a)" />
          <polygon points="200,284 280,238 200,330 120,238" fill="url(#gm-login-d)" />
          <path
            d="M200 100 L280 146 L280 238 L200 330 L120 238 L120 146 Z M200 192 L200 330 M120 146 L200 192 L280 146"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
            fill="none"
          />
          <circle cx={200} cy={192} r={5} fill="#ffffff" className="animate-gm-twinkle-fast" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Mobile stand-in for `LoginArtwork`: just the polyhedron, no lattice, shown
 * above the heading once the artwork column is dropped.
 */
export function LoginMark() {
  return (
    <svg viewBox="0 0 120 120" className="size-26" aria-hidden="true">
      <defs>
        <FaceGradients prefix="gm-mark" />
      </defs>
      <g className="animate-gm-bob gm-fill-box">
        <polygon points="60,18 94,37 60,56 26,37" fill="url(#gm-mark-s)" />
        <polygon points="26,37 60,56 60,96 26,77" fill="url(#gm-mark-v)" />
        <polygon points="94,37 60,56 60,96 94,77" fill="url(#gm-mark-a)" />
        <polygon points="60,96 94,77 60,108 26,77" fill="url(#gm-mark-d)" />
      </g>
    </svg>
  );
}
