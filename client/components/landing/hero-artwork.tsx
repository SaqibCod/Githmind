import { HERO_NODES, HEXAGON_VERTICES } from "./landing-content";

const VIEW_BOX = "-70 -30 540 460";

/**
 * The hero illustration: a persistent rotating hexagon network, plus three
 * scenes that cross-fade on an 18s loop (cube → stacked plates → arches).
 *
 * All four layers share the same viewBox and are absolutely stacked, so the
 * scenes line up as one sits on top of the other. `gm-scene`/`gm-first` are
 * markers for the prefers-reduced-motion rule in globals.css, which pins the
 * first scene visible instead of leaving all three faded out.
 */
export function HeroArtwork() {
  return (
    <div className="relative aspect-540/460 w-full max-w-145">
      <div className="absolute inset-[14%] animate-gm-breathe rounded-full gm-halo" />

      <HexagonNetwork />
      <CubeScene />
      <PlatesScene />
      <ArchesScene />
    </div>
  );
}

function HexagonNetwork() {
  return (
    <svg
      viewBox={VIEW_BOX}
      className="absolute inset-0 size-full"
      role="img"
      aria-label="Network hexagon with orbiting nodes labelled Repos, Files, Chunks, Citations and Answers"
    >
      <defs>
        <filter id="gm-dotglow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* outer lattice, one very slow rotation */}
      <g
        className="animate-gm-spin-slow gm-view-box"
        style={{ transformOrigin: "200px 200px" }}
      >
        <g className="fill-none stroke-gm-net" strokeWidth={1}>
          <polygon points="200,2 371,101 371,299 200,398 29,299 29,101" />
          <polygon points="200,2 300,160 200,398 100,160" opacity={0.45} />
          <path
            d="M29 101 L150 190 M371 101 L250 190 M200 398 L200 240 M29 299 L140 230 M371 299 L260 230 M200 2 L200 150"
            opacity={0.5}
          />
        </g>
        <g className="fill-gm-node">
          {HEXAGON_VERTICES.map((v) => (
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

      {/* the ring the fast dot travels along */}
      <circle
        cx={200}
        cy={200}
        r={185}
        className="fill-none stroke-gm-net"
        strokeWidth={1}
      />
      <g
        className="animate-gm-spin-orbit gm-view-box"
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx={200} cy={15} r={5} className="fill-gm-orange" filter="url(#gm-dotglow)" />
        <circle cx={200} cy={15} r={3} className="fill-gm-node" />
      </g>

      {/* stage labels, each pulsing in turn */}
      <g>
        {HERO_NODES.map((n) => (
          <g key={n.label}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r={4}
              className="animate-gm-node gm-fill-box fill-gm-node"
              style={{ animationDelay: n.delay }}
            />
            <text
              x={n.x}
              y={n.y}
              textAnchor={n.anchor}
              className="animate-gm-lab fill-gm-strong font-gm-sans text-gm-d-2xs sm:text-gm-md"
              style={{ animationDelay: n.delay }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Scene 1 — an exploded isometric cube. */
function CubeScene() {
  return (
    <svg
      viewBox={VIEW_BOX}
      className="gm-scene gm-first absolute inset-0 size-full animate-gm-scene"
      style={{ animationDelay: "0s" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gm-a1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9a8" />
          <stop offset="1" stopColor="#d9822b" />
        </linearGradient>
        <linearGradient id="gm-a2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9aeff" />
          <stop offset="1" stopColor="#4a3bb5" />
        </linearGradient>
        <linearGradient id="gm-a3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f4f8" />
          <stop offset="1" stopColor="#7d7d8c" />
        </linearGradient>
        <linearGradient id="gm-a4" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#15151c" />
          <stop offset="1" stopColor="#3a3a48" />
        </linearGradient>
      </defs>
      <g className="animate-gm-bob gm-fill-box">
        <polygon points="200,92 290,142 200,192 110,142" fill="url(#gm-a3)" />
        <polygon points="110,142 200,192 200,296 110,246" fill="url(#gm-a2)" />
        <polygon points="290,142 200,192 200,296 290,246" fill="url(#gm-a1)" />
        <polygon points="200,296 290,246 200,330 110,246" fill="url(#gm-a4)" />
        <path
          d="M200 92 L290 142 L290 246 L200 330 L110 246 L110 142 Z M200 192 L200 330 M110 142 L200 192 L290 142"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth={1}
          fill="none"
        />
        <circle cx={200} cy={192} r={5} fill="#ffffff" className="animate-gm-twinkle" />
      </g>
    </svg>
  );
}

/** Scene 2 — six stacked plates, the topmost one highlighted. */
function PlatesScene() {
  // top face y-offset per plate; the stack is drawn bottom-up so the topmost
  // plate (the "current file") paints last and reads as highlighted
  const plates = [
    { y: 282, delay: "-2.5s", opacity: 0.6 },
    { y: 252, delay: "-2s", opacity: 0.7 },
    { y: 222, delay: "-1.5s", opacity: 0.8 },
    { y: 192, delay: "-1s", opacity: 0.9 },
    { y: 162, delay: "-0.5s", opacity: 1 },
  ];

  return (
    <svg
      viewBox={VIEW_BOX}
      className="gm-scene absolute inset-0 size-full animate-gm-scene"
      style={{ animationDelay: "6s" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gm-b1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f3f8" />
          <stop offset="1" stopColor="#7a7a8a" />
        </linearGradient>
        <linearGradient id="gm-b2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9a8" />
          <stop offset="1" stopColor="#b8601f" />
        </linearGradient>
        <linearGradient id="gm-b3" x1="0" y1="0" x2="0" y2="1">
          {/* stop-color has no Tailwind utility; the values are still tokens */}
          <stop offset="0" style={{ stopColor: "var(--gm-plate-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--gm-plate-b)" }} />
        </linearGradient>
      </defs>
      <g>
        {plates.map((p) => (
          <g
            key={p.y}
            className="animate-gm-plate gm-fill-box"
            style={{ animationDelay: p.delay }}
          >
            <polygon
              points={`110,${p.y} 155,${p.y + 22} 245,${p.y + 22} 290,${p.y} 290,${p.y - 12} 245,${p.y + 10} 155,${p.y + 10} 110,${p.y - 12}`}
              fill="url(#gm-b3)"
              stroke="rgba(45,212,191,0.6)"
              strokeWidth={1}
            />
            <polygon
              points={`110,${p.y - 12} 155,${p.y - 34} 245,${p.y - 34} 290,${p.y - 12} 245,${p.y + 10} 155,${p.y + 10}`}
              fill="url(#gm-b1)"
              opacity={p.opacity}
              className="stroke-gm-net"
            />
          </g>
        ))}
        {/* highlighted top plate */}
        <g className="animate-gm-plate gm-fill-box" style={{ animationDelay: "0s" }}>
          <polygon
            points="110,132 155,154 245,154 290,132 290,120 245,142 155,142 110,120"
            fill="url(#gm-b3)"
            stroke="rgba(245,166,91,0.8)"
            strokeWidth={1}
          />
          <polygon
            points="110,120 155,98 245,98 290,120 245,142 155,142"
            fill="url(#gm-b2)"
            className="stroke-gm-net"
          />
        </g>
      </g>
    </svg>
  );
}

/** Scene 3 — nested arches sweeping upward. */
function ArchesScene() {
  // each arch is 14px narrower and 24px shallower than the one outside it
  const arches = Array.from({ length: 7 }, (_, i) => ({
    d: `M${70 + i * 14} 320 C${70 + i * 14} ${90 + i * 24} ${330 - i * 14} ${90 + i * 24} ${330 - i * 14} 320`,
    delay: `${i * 0.2}s`,
  }));

  return (
    <svg
      viewBox={VIEW_BOX}
      className="gm-scene absolute inset-0 size-full animate-gm-scene"
      style={{ animationDelay: "12s" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gm-c1" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="320">
          <stop offset="0" stopColor="#e08a47" />
          <stop offset="0.5" stopColor="#3a4a7a" />
          <stop offset="1" stopColor="#0f1426" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#gm-c1)" strokeWidth={9} strokeLinecap="round">
        {arches.map((a) => (
          <path
            key={a.delay}
            d={a.d}
            className="animate-gm-arch gm-fill-box"
            style={{ animationDelay: a.delay }}
          />
        ))}
      </g>
      <path
        d="M90 250 C110 140 200 112 290 150"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
