import { EmptyRepoIcon } from "@/components/icons/nav-icons";

import { DASHBOARD_COPY } from "./repo-list-content";

/** Shared frame for the list and its skeleton. */
export function RepoListFrame({
  children,
  dimmed,
  ...rest
}: {
  children: React.ReactNode;
  dimmed?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-gm-2xl border border-gm-line bg-gm-card"
      style={dimmed ? { opacity: 0.65 } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

/** First load. Four rows of pulsing bars standing in for the real content. */
export function RepoListSkeleton() {
  return (
    <RepoListFrame aria-busy="true" aria-label="Loading repositories">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="flex flex-wrap items-center gap-5 border-b border-gm-line p-6"
        >
          <div className="flex flex-1 basis-50 flex-col gap-3">
            <div className="h-3.5 w-3/5 max-w-55 animate-gm-pulse rounded-gm-xs bg-gm-skel" />
            <div className="h-3 w-4/5 animate-gm-pulse rounded-gm-xs bg-gm-skel2" />
          </div>
          <div className="h-6 w-21 animate-gm-pulse rounded-full bg-gm-skel" />
          <div className="h-10 w-24 animate-gm-pulse rounded-full bg-gm-skel" />
        </div>
      ))}
    </RepoListFrame>
  );
}

/** Account genuinely has no repositories. */
export function RepoListEmpty({ onSync }: { onSync: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-gm-2xl border border-dashed border-gm-line2 px-6 py-18 text-center">
      <EmptyRepoIcon className="size-11" />
      <h2 className="text-gm-d-2xs font-medium text-gm-strong">
        {DASHBOARD_COPY.emptyTitle}
      </h2>
      <p className="max-w-105 text-gm-md leading-gm-relaxed text-gm-muted">
        {DASHBOARD_COPY.emptyBody}
      </p>
      <button
        type="button"
        onClick={onSync}
        className="h-11.5 rounded-full bg-gm-cta-bg px-5.5 text-gm-base font-semibold text-gm-cta-fg"
      >
        {DASHBOARD_COPY.sync}
      </button>
    </div>
  );
}

/** Repositories exist, but the filter matched none of them. */
export function RepoListNoMatch() {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-gm-2xl border border-dashed border-gm-line2 px-6 py-14 text-center">
      <h2 className="text-gm-d-xs font-medium text-gm-strong">
        {DASHBOARD_COPY.noMatchTitle}
      </h2>
      <p className="text-gm-base text-gm-muted">{DASHBOARD_COPY.noMatchBody}</p>
    </div>
  );
}

export function RepoListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-gm-lg border border-gm-err-bd bg-gm-err-bg px-4.5 py-4 text-gm-base leading-gm-normal text-gm-err-t"
    >
      <span>{DASHBOARD_COPY.loadError}</span>
      <button
        type="button"
        onClick={onRetry}
        className="h-9.5 rounded-full border border-gm-err-bd px-4 text-gm-sm font-semibold text-gm-err-t"
      >
        {DASHBOARD_COPY.retry}
      </button>
    </div>
  );
}

/** Shown above the list while a refresh is in flight; the list stays visible
 *  underneath at reduced opacity. */
export function RepoSyncingNotice() {
  return (
    <div
      role="status"
      className="relative flex items-center gap-3 overflow-hidden rounded-gm-md border border-gm-vi-bd bg-gm-vi-bg px-4 py-3 text-gm-base text-gm-vi-t"
    >
      {DASHBOARD_COPY.syncingNotice}
      <span className="absolute bottom-0 left-0 h-0.5 w-2/5 animate-gm-shimmer gm-shimmer-bar" />
    </div>
  );
}
