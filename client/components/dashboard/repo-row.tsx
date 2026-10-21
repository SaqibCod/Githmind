import Link from "next/link";

import type { Repository } from "@/lib/api";
import { cn } from "@/lib/utils";

import {
  DASHBOARD_COPY,
  STATUS_PRESENTATION,
  hasIndexWarning,
  languageDotClass,
  progressLabel,
  repoActionHref,
} from "./repo-list-content";
import { StatusChip } from "./status-chip";

/**
 * One repository in the list. Three columns on desktop — identity, status,
 * action — that stack and go full-width below 640px.
 */
export function RepoRow({ repo }: { repo: Repository }) {
  const presentation = STATUS_PRESENTATION[repo.indexStatus];
  const indexing = repo.indexStatus === "INDEXING";
  const percent = repo.filesTotal
    ? Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100))
    : 0;

  return (
    // the design keeps the hairline on every row, including the last, where it
    // sits just inside the list's own rounded border
    <div className="flex animate-gm-rise-xs flex-wrap items-center gap-4 border-b border-gm-line px-4 py-4.5 hover:bg-gm-nav-on sm:px-6 sm:py-5">
      <div className="flex min-w-0 flex-1 basis-70 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={repoActionHref(repo)}
            className="text-gm-lg font-medium text-gm-strong"
          >
            {repo.fullName}
          </Link>
          {repo.isPrivate && (
            <span className="inline-flex items-center rounded-full border border-gm-line2 px-2 py-0.5 text-gm-2xs text-gm-muted">
              {DASHBOARD_COPY.privateLabel}
            </span>
          )}
        </div>

        {repo.description && (
          <div className="text-gm-base leading-gm-normal text-gm-muted">
            {repo.description}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3.5 font-gm-mono text-gm-xs text-gm-faint">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", languageDotClass(repo.language))} />
              {repo.language}
            </span>
          )}
          <span>{repo.defaultBranch}</span>
          {repo.htmlUrl && (
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gm-link"
            >
              {DASHBOARD_COPY.githubLink}
            </a>
          )}
        </div>
      </div>

      <div className="flex min-w-30 flex-[0_1_190px] flex-col gap-2">
        <StatusChip tone={presentation.tone}>{repo.indexStatus}</StatusChip>

        {indexing && (
          <div className="flex flex-col gap-1.5">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-gm-track"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full gm-progress-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="font-gm-mono text-gm-xs text-gm-faint">
              {progressLabel(repo)}
            </span>
          </div>
        )}

        {hasIndexWarning(repo) && (
          <span className="text-gm-xs text-gm-warn-t">{DASHBOARD_COPY.warning}</span>
        )}
      </div>

      <div className="flex flex-[1_1_100%] justify-end sm:flex-[0_0_130px]">
        <Link
          href={repoActionHref(repo)}
          className={cn(
            "inline-flex h-10.5 w-full items-center justify-center rounded-full px-4.5 text-gm-base font-semibold whitespace-nowrap sm:w-auto",
            presentation.primary
              ? "bg-gm-cta-bg text-gm-cta-fg"
              : "border border-gm-line2 text-gm-text"
          )}
        >
          {presentation.action}
        </Link>
      </div>
    </div>
  );
}
