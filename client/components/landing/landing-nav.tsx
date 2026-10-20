import Link from "next/link";

import { BrandLink } from "@/components/layout/brand-link";

import { NAV_LINKS } from "./landing-content";

export function LandingNav() {
  return (
    <div className="flex min-h-21 animate-gm-rise flex-wrap items-center justify-between gap-4">
      <BrandLink />

      {/* the design drops the section links entirely below 640px rather than
          collapsing them into a menu */}
      <div className="hidden flex-wrap gap-7.5 text-gm-base text-gm-muted sm:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-gm-strong">
            {link.label}
          </Link>
        ))}
      </div>

      {/* h-11.5 (46px) = the design's 44px content box + its 1px border: the
          design is content-box here, Tailwind's preflight is border-box */}
      <Link
        href="/login"
        className="flex h-11.5 items-center gap-2 rounded-full border border-gm-line2 bg-gm-pill px-5 text-gm-base font-medium text-gm-strong"
      >
        Sign in
      </Link>
    </div>
  );
}
