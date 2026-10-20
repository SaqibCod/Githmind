import { HOW_IT_WORKS } from "./landing-content";

export function HowItWorks() {
  return (
    <section
      id="how"
      className="flex w-full max-w-310 flex-col gap-9 self-center px-5 py-14 sm:px-8 sm:pt-24 sm:pb-6"
    >
      <div className="flex max-w-140 flex-col gap-3">
        <span className="font-gm-mono text-gm-sm text-gm-accent-t">How it works</span>
        <h2 className="text-gm-d-lg leading-gm-display font-medium tracking-gm-tight text-gm-strong sm:text-gm-d-4xl">
          Three steps from sign-in to answer.
        </h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
        {HOW_IT_WORKS.map((item) => (
          <div
            key={item.step}
            className="flex flex-col gap-3.5 rounded-gm-4xl border border-gm-line p-7.5 transition-[transform,border-color] duration-350 hover:-translate-y-1 hover:border-gm-orange/45 gm-card-surface"
          >
            <div
              className={`font-gm-mono text-gm-sm ${
                item.accent === "violet" ? "text-gm-violet-t" : "text-gm-accent-t"
              }`}
            >
              {item.step}
            </div>
            <h3 className="text-gm-d-2xs font-medium text-gm-strong">{item.title}</h3>
            <p className="text-gm-md leading-gm-loose text-gm-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
