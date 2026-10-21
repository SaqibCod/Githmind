"use client";

import { useMemo, useState } from "react";

import { SearchIcon, SyncIcon } from "@/components/icons/nav-icons";
import { useRefreshRepos, useRepos } from "@/hooks/use-repos";
import { cn } from "@/lib/utils";

import { DASHBOARD_COPY, subtitleFor } from "./repo-list-content";
import { RepoRow } from "./repo-row";
import {
  RepoListEmpty,
  RepoListError,
  RepoListFrame,
  RepoListNoMatch,
  RepoListSkeleton,
  RepoSyncingNotice,
} from "./repo-list-states";

/**
 * The repositories screen. The design enumerates five states — loaded,
 * syncing, first load, zero repos and load error — plus a sixth for a filter
 * that matches nothing. They map onto the `useRepos()` query plus local
 * filter text; `useRefreshRepos()` drives the sync.
 */
export function RepoListView() {
  const { data: repos, isLoading, isError, refetch } = useRepos();
  const refresh = useRefreshRepos();
  const [query, setQuery] = useState("");

  const syncing = refresh.isPending;
  // memoised so the empty-array fallback keeps a stable identity across renders
  const all = useMemo(() => repos ?? [], [repos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? all.filter((r) => r.fullName.toLowerCase().includes(q)) : all;
  }, [all, query]);

  const hasData = !isLoading && !isError;
  const showEmpty = hasData && all.length === 0;
  const showNoMatch = hasData && all.length > 0 && filtered.length === 0;
  const showList = hasData && filtered.length > 0;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-gm-d-xl font-medium tracking-gm-tight text-gm-strong">
            {DASHBOARD_COPY.heading}
          </h1>
          <p className="text-gm-md text-gm-muted">
            {all.length > 0 ? subtitleFor(all.length) : DASHBOARD_COPY.emptySubtitle}
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          {/* h-11.5 (46px): the design gives both controls height:44px, but the
              label is content-box so its border adds 2px, while the button is
              a form control and already border-box at 44px */}
          <label className="flex h-11.5 flex-[1_1_100%] items-center gap-2 rounded-gm-md border border-gm-line2 bg-gm-pill px-3.5 text-gm-base text-gm-muted sm:flex-initial">
            <SearchIcon className="size-4 flex-none" />
            <input
              type="text"
              aria-label={DASHBOARD_COPY.filterPlaceholder}
              placeholder={DASHBOARD_COPY.filterPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full min-w-30 border-0 bg-transparent text-gm-base text-gm-text outline-0"
            />
          </label>

          <button
            type="button"
            onClick={() => refresh.mutate()}
            disabled={syncing}
            className="flex h-11 flex-[1_1_100%] items-center justify-center gap-2 rounded-gm-md border border-gm-line2 bg-gm-pill px-4.5 text-gm-base font-medium text-gm-text sm:flex-initial"
          >
            <SyncIcon className={cn("size-4 flex-none", syncing && "animate-gm-spin-fast")} />
            {syncing ? DASHBOARD_COPY.syncing : DASHBOARD_COPY.sync}
          </button>
        </div>
      </div>

      {syncing && <RepoSyncingNotice />}
      {isError && <RepoListError onRetry={() => void refetch()} />}
      {isLoading && <RepoListSkeleton />}

      {showList && (
        <RepoListFrame dimmed={syncing}>
          {filtered.map((repo) => (
            <RepoRow key={repo.id} repo={repo} />
          ))}
        </RepoListFrame>
      )}

      {showEmpty && <RepoListEmpty onSync={() => refresh.mutate()} />}
      {showNoMatch && <RepoListNoMatch />}
    </>
  );
}
