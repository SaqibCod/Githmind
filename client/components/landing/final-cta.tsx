import Link from "next/link";

export function FinalCta() {
  return (
    <section id="start" className="flex flex-col items-center gm-start-glow">
      <div className="flex w-full max-w-310 flex-col items-center gap-7 px-5 py-14 text-center sm:px-8 sm:pt-26 sm:pb-10">
        <h2 className="max-w-175 text-gm-d-2xl leading-gm-hero font-medium tracking-gm-hero text-gm-strong sm:text-gm-d-6xl">
          Start with one repository.
        </h2>
        <p className="max-w-115 text-gm-lg leading-gm-loose text-gm-muted sm:text-gm-xl">
          Sign in, pick a repo, and ask your first question in a few minutes.
        </p>
        <Link
          href="/login"
          className="flex h-13.5 items-center gap-2.5 rounded-full bg-gm-cta-bg px-7.5 text-gm-md font-semibold text-gm-cta-fg"
        >
          Continue with GitHub <span aria-hidden="true">→</span>
        </Link>

        <footer className="mt-14 flex w-full flex-wrap justify-between gap-3 border-t border-gm-line pt-7 text-gm-sm text-gm-faint">
          <span>githMind</span>
          <span>Chat with your GitHub repositories</span>
        </footer>
      </div>
    </section>
  );
}
