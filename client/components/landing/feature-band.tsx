import {
  FEATURE_CARDS,
  FEATURE_CHAT_DEMO,
  INDEXING_STATES,
} from "./landing-content";

/** Shared shell for the four cards in the band. `surface` picks the corner the
 *  card's radial tint sits in (see the gm-fcard-* utilities).
 *
 *  Note the min-heights: the design is content-box, so its `min-height: 340px`
 *  / `280px` exclude the 30px padding and 1px border. The border-box
 *  equivalents are 340+60+2 = 402 (min-h-100.5) and 280+60+2 = 342
 *  (min-h-85.5). */
function BandCard({
  surface,
  className,
  children,
}: {
  surface: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-gm-5xl border border-gm-fc-line p-7.5 text-gm-fc-t transition-[transform,border-color] duration-350 hover:-translate-y-1 hover:border-gm-orange/45 ${surface} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** Card 1 — a frozen chat exchange, down to the blinking stream caret. */
function ChatDemoCard() {
  return (
    <BandCard surface="gm-fcard-1" className="min-h-100.5 gap-4.5">
      <div className="font-gm-mono text-gm-xs text-gm-fc-f">{FEATURE_CHAT_DEMO.repo}</div>

      <div className="max-w-[82%] self-end rounded-[16px_16px_4px_16px] bg-gm-fc-bub px-4 py-3 text-gm-md">
        {FEATURE_CHAT_DEMO.question}
      </div>

      <div className="max-w-[94%] text-gm-md leading-gm-rich text-gm-fc-t">
        {FEATURE_CHAT_DEMO.answer}
        <span
          aria-hidden="true"
          className="ml-0.75 inline-block h-4 w-2 animate-gm-blink bg-gm-accent align-[-2px]"
        />
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {FEATURE_CHAT_DEMO.citations.map((c) => (
          <span
            key={c.path}
            className="animate-gm-chip rounded-gm-xs border border-gm-chip-bd bg-gm-chip-bg px-2.5 py-1.5 font-gm-mono text-gm-xs text-gm-chip-fg"
            style={{ animationDelay: c.delay }}
          >
            {c.path}
          </span>
        ))}
      </div>
    </BandCard>
  );
}

/** Card 2 — the indexing progress bar and its status vocabulary. */
function LiveIndexingCard() {
  const toneClass = {
    neutral: "border-gm-fc-line text-gm-fc-m",
    violet: "border-gm-violet/50 text-gm-violet-t",
    ok: "border-gm-ok-mid/50 text-gm-ok",
  } as const;

  return (
    <BandCard surface="gm-fcard-2" className="min-h-100.5 gap-4.5">
      <div className="flex items-center justify-between">
        <span className="font-gm-mono text-gm-xs text-gm-fc-f">Live indexing</span>
        <span className="rounded-full border border-gm-violet/40 bg-gm-violet/12 px-2.5 py-1 text-gm-xs text-gm-violet-t">
          INDEXING
        </span>
      </div>

      <div className="text-gm-d-2xl font-medium tracking-gm-tight">Files, then chunks</div>

      <div className="h-2.5 overflow-hidden rounded-full bg-gm-fc-track">
        <div className="h-full animate-gm-fill rounded-full gm-progress-fill" />
      </div>

      <p className="text-gm-md leading-gm-loose text-gm-fc-m">
        Follow progress as it happens. If a run finishes with gaps, you see a warning and can
        re-index to fill them.
      </p>

      <div className="mt-auto flex flex-wrap gap-2.5">
        {INDEXING_STATES.map((s) => (
          <span
            key={s.label}
            className={`rounded-full border px-3 py-1.5 text-gm-xs ${toneClass[s.tone]}`}
          >
            {s.label}
          </span>
        ))}
      </div>
    </BandCard>
  );
}

export function FeatureBand() {
  return (
    <section
      id="features"
      className="mt-10 flex flex-col items-center rounded-t-gm-band-sm text-gm-band-t sm:mt-20 sm:rounded-t-gm-band gm-band-surface"
    >
      <div className="flex w-full max-w-310 flex-col items-center gap-13 px-5 py-14 sm:px-8 sm:pt-24 sm:pb-26">
        <div className="flex max-w-160 flex-col items-center gap-4 text-center">
          <h2 className="text-gm-d-2xl leading-gm-tight font-medium tracking-gm-hero text-gm-band-t sm:text-gm-d-5xl">
            Code intelligence, reimagined
          </h2>
          <p className="text-gm-lg leading-gm-loose text-gm-band-m sm:text-gm-xl">
            Stop grepping through folders. Ask a question, read the answer, and jump straight to
            the lines that back it up.
          </p>
        </div>

        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5">
          <ChatDemoCard />
          <LiveIndexingCard />

          {FEATURE_CARDS.map((card, i) => (
            <BandCard
              key={card.eyebrow}
              surface={i === 0 ? "gm-fcard-3" : "gm-fcard-4"}
              className="min-h-85.5 gap-4"
            >
              <span className="font-gm-mono text-gm-xs text-gm-fc-f">{card.eyebrow}</span>
              <h3 className="text-gm-d-sm leading-gm-snug font-medium tracking-gm-snug">
                {card.title}
              </h3>
              <p className="text-gm-md leading-gm-loose text-gm-fc-m">{card.body}</p>
            </BandCard>
          ))}
        </div>
      </div>
    </section>
  );
}
