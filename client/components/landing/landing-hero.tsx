import Link from "next/link";

import { GitHubIcon } from "@/components/icons/github-icon";

import { HeroArtwork } from "./hero-artwork";
import { LanguageMarquee } from "./language-marquee";
import { HERO_CAPTIONS } from "./landing-content";

export function LandingHero() {
  return (
    <div className="flex flex-wrap items-center gap-6 pt-7 pb-6 sm:pt-14">
      {/* copy */}
      <div className="flex min-w-0 flex-1 basis-115 flex-col gap-7">
        <h1 className="text-gm-d-3xl leading-gm-hero font-medium tracking-gm-hero text-gm-strong sm:text-gm-d-6xl lg:text-gm-hero lg:leading-gm-none">
          <span className="block animate-gm-rise" style={{ animationDelay: "0.15s" }}>
            Ask your codebase.
          </span>
          <span
            className="block animate-gm-rise text-gm-muted"
            style={{ animationDelay: "0.35s" }}
          >
            Get answers with receipts.
          </span>
        </h1>

        <p
          className="max-w-125 animate-gm-rise text-gm-lg leading-gm-relaxed text-gm-muted sm:text-gm-2xl"
          style={{ animationDelay: "0.55s" }}
        >
          GithMind indexes your GitHub repositories once, then answers questions in plain
          language. Every reply points to the files and lines it came from.
        </p>

        <div
          className="flex animate-gm-rise flex-wrap items-center gap-4.5"
          style={{ animationDelay: "0.75s" }}
        >
          {/* h-13.5 (54px) = the design's 52px content box + its 1px accent
              border; the plain link beside it has no border and stays 52px */}
          <Link
            href="/login"
            className="flex h-13.5 animate-gm-glow items-center gap-2.5 rounded-full border border-gm-accent px-7 text-gm-md font-medium text-gm-gb-fg gm-cta-glow"
          >
            <GitHubIcon className="size-4.5" />
            Continue with GitHub
          </Link>
          <Link
            href="#how"
            className="flex h-13 items-center gap-2 text-gm-md text-gm-soft"
          >
            See how it works <span aria-hidden="true">→</span>
          </Link>
        </div>

        <LanguageMarquee />
      </div>

      {/* artwork */}
      <div className="flex min-w-0 flex-1 basis-115 flex-col items-center gap-2">
        <HeroArtwork />

        {/* captions cross-fade in lockstep with the artwork scenes */}
        <div className="relative mt-1 h-13 w-full max-w-105">
          {HERO_CAPTIONS.map((caption, i) => (
            <div
              key={caption.text}
              className={`gm-cap absolute inset-x-0 animate-gm-cap text-center text-gm-md text-gm-soft${
                i === 0 ? " gm-first" : ""
              }`}
              style={{ animationDelay: caption.delay }}
            >
              {caption.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
