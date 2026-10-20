"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ArcSpinner } from "@/components/icons/arc-spinner";
import { GitHubIcon } from "@/components/icons/github-icon";
import { BrandLink } from "@/components/layout/brand-link";
import { useCurrentUser } from "@/hooks/use-auth";
import { getGithubLoginUrl } from "@/lib/api";

import { LoginArtwork, LoginMark } from "./login-artwork";
import { LoginBanner } from "./login-banner";
import { LOGIN_COPY, toLoginError } from "./login-content";

export function LoginView() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  const error = toLoginError(params.get("error"));
  const next = params.get("next") || "/dashboard";

  // the design's fourth state: the button stays busy for the whole top-level
  // navigation to github.com, which can take a beat on a cold connection
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(next.startsWith("/") ? next : "/dashboard");
    }
  }, [user, isLoading, next, router]);

  function startRedirect() {
    setRedirecting(true);
    window.location.href = getGithubLoginUrl();
  }

  return (
    <div className="gm-motion flex min-h-svh flex-wrap items-stretch font-gm-sans text-gm-text gm-login-glow">
      <div className="flex min-w-0 flex-1 basis-120 flex-col justify-between gap-7 px-5 pt-6 pb-8 sm:gap-10 sm:px-14 sm:py-10">
        <BrandLink />

        <div className="flex w-full max-w-100 animate-gm-rise-md flex-col gap-5.5">
          {/* the artwork column is dropped below 640px, so the mark stands in */}
          <div className="flex justify-start sm:hidden" aria-hidden="true">
            <LoginMark />
          </div>

          <h1 className="text-gm-d-2xl leading-gm-hero font-medium tracking-gm-tight text-gm-strong sm:text-gm-d-4xl">
            {LOGIN_COPY.heading}
          </h1>
          <p className="text-gm-lg leading-gm-relaxed text-gm-muted">
            {LOGIN_COPY.subheading}
          </p>

          {error && <LoginBanner kind={error} />}

          <button
            type="button"
            onClick={startRedirect}
            disabled={redirecting}
            aria-busy={redirecting}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gm-cta-bg text-gm-lg font-semibold text-gm-cta-fg disabled:opacity-80"
          >
            {redirecting ? (
              <>
                <ArcSpinner className="size-5" />
                <span>{LOGIN_COPY.busyCta}</span>
              </>
            ) : (
              <>
                <GitHubIcon className="size-5" />
                <span>{LOGIN_COPY.idleCta}</span>
              </>
            )}
          </button>

          <p className="text-gm-sm leading-gm-loose text-gm-faint">
            {LOGIN_COPY.scopeNote}
          </p>
        </div>

        {/* The column is space-between across three slots. The design's third
            slot is its "Preview state" switcher — a design-tool control with
            no app equivalent — so this holds its 32px open to keep the card
            at the vertical position the design gives it. */}
        <div aria-hidden="true" className="h-8" />
      </div>

      {/* basis-125 (500px), not the design's literal 420px: that column is
          content-box there, so its flex-basis excludes the 2x40px padding.
          480 + 500 against a 1280px viewport reproduces the 630/650 split. */}
      <div className="relative hidden min-w-0 flex-1 basis-125 items-center justify-center p-10 sm:flex">
        <LoginArtwork />
      </div>
    </div>
  );
}
