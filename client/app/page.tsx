import { FeatureBand } from "@/components/landing/feature-band";
import { FinalCta } from "@/components/landing/final-cta";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";

/**
 * Landing page, ported from docs/design/githMind UI Design.html → "githMind
 * Landing". Fully static: every motion in the design is CSS, so none of this
 * needs to be a Client Component.
 *
 * `gm-motion` is the hook the prefers-reduced-motion rule in globals.css
 * keys off — it must stay on the outermost element.
 */
export default function Home() {
  return (
    <div className="gm-motion flex min-h-svh flex-col overflow-hidden bg-gm-bg font-gm-sans text-gm-text">
      {/* nav + hero share one tinted backdrop */}
      <div className="relative flex flex-col items-center gm-hero-glow">
        <div className="flex w-full max-w-310 flex-col px-5 sm:px-8">
          <LandingNav />
          <LandingHero />
        </div>
      </div>

      <HowItWorks />
      <FeatureBand />
      <FinalCta />
    </div>
  );
}
