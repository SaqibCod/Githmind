"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrentUser } from "@/hooks/use-auth";

import {
  CALLBACK_COPY,
  CALLBACK_DOT_DELAYS,
  CALLBACK_FAILURE,
  CALLBACK_REDIRECT_DELAY_MS,
  type CallbackState,
} from "./callback-content";
import { CallbackEmblem } from "./callback-emblem";

export function CallbackView() {
  const router = useRouter();
  const { data: user, isLoading, isFetched } = useCurrentUser();

  const settled = isFetched && !isLoading;
  const state: CallbackState = settled && !user ? "failed" : "loading";
  const { title, body } = CALLBACK_COPY[state];

  useEffect(() => {
    if (!settled) return;

    if (user) {
      router.replace("/dashboard");
      return;
    }

    // hold the failed state briefly so it is readable, then bounce back —
    // /login renders its own "session" banner from this param
    const t = setTimeout(
      () => router.replace(CALLBACK_FAILURE.href),
      CALLBACK_REDIRECT_DELAY_MS
    );
    return () => clearTimeout(t);
  }, [settled, user, router]);

  return (
    <div className="gm-motion gm-callback-tone flex min-h-svh flex-col items-center justify-center gap-7 px-5 py-8 text-center font-gm-sans text-gm-text sm:px-6 sm:py-10 gm-callback-glow">
      <CallbackEmblem state={state} />

      <div
        role="status"
        aria-live="polite"
        className="flex max-w-105 animate-gm-rise-sm flex-col items-center gap-2.5"
      >
        <h1 className="text-gm-d-sm font-medium tracking-gm-title text-gm-strong sm:text-gm-d-md">
          {title}
        </h1>
        <p className="text-gm-md leading-gm-loose text-gm-muted">{body}</p>
      </div>

      {state === "failed" ? (
        <div className="flex flex-col items-center gap-3.5">
          <div
            role="alert"
            className="rounded-gm-md border border-gm-err-bd bg-gm-err-bg px-4 py-2.5 text-gm-sm text-gm-err-t"
          >
            {CALLBACK_FAILURE.detail}
          </div>
          <Link
            href={CALLBACK_FAILURE.href}
            className="flex h-12 items-center justify-center rounded-full bg-gm-cta-bg px-6.5 text-gm-md font-semibold text-gm-cta-fg"
          >
            {CALLBACK_FAILURE.action}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1.5" aria-hidden="true">
          {CALLBACK_DOT_DELAYS.map((delay) => (
            <span
              key={delay}
              className="size-1.5 animate-gm-dots rounded-full bg-gm-orange"
              style={{ animationDelay: delay }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
