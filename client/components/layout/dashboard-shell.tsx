"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GearIcon, GridIcon } from "@/components/icons/nav-icons";
import { GithMindMark } from "@/components/icons/githmind-mark";
import { useCurrentUser } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import { UserAvatar } from "./user-avatar";

/**
 * The signed-in app frame from the design: a sidebar of exactly two
 * destinations plus the current user, beside a scrolling main column.
 *
 * Below 640px the design turns the sidebar into a top bar — logo and user on
 * one row, the nav reflowing underneath as full-width segments (hence the
 * `order-3 w-full` on the nav and `flex-1` on its links).
 *
 * This is the shell for repositories, repo overview and settings. It is not
 * the older `AppShell` in this folder, which wraps the shadcn Sidebar and
 * still serves the pages that have not been ported yet.
 */

const NAV_ITEMS = [
  { label: "Repositories", href: "/dashboard", icon: GridIcon, exact: true },
  { label: "Settings", href: "/dashboard/setting", icon: GearIcon, exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  return (
    <div className="gm-motion gm-app-tone flex min-h-svh flex-wrap items-stretch font-gm-sans text-gm-text gm-app-glow">
      <div className="flex w-full flex-row flex-wrap items-center gap-3 border-b border-gm-line bg-gm-side px-4 py-3.5 sm:w-auto sm:min-w-50 sm:max-w-65 sm:flex-1 sm:basis-58 sm:flex-col sm:items-stretch sm:gap-7 sm:border-r sm:border-b-0 sm:px-4 sm:py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-gm-xl font-semibold text-gm-strong sm:px-2"
        >
          <GithMindMark className="size-6" />
          GithMind
        </Link>

        <nav className="order-3 flex w-full flex-row gap-1 text-gm-base sm:order-none sm:w-auto sm:flex-col">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center gap-3 rounded-gm-md px-3 sm:flex-none sm:justify-start",
                  active
                    ? "bg-gm-nav-on font-medium text-gm-nav-on-t"
                    : "text-gm-muted"
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 rounded-gm-lg sm:mt-auto sm:ml-0 sm:border sm:border-gm-line sm:p-3">
          <UserAvatar
            displayName={user?.displayName}
            username={user?.githubUsername ?? ""}
            avatarUrl={user?.avatarUrl}
            size={36}
            className="text-gm-sm"
          />
          <div className="hidden min-w-0 flex-col sm:flex">
            <span className="truncate text-gm-base font-medium text-gm-strong">
              {user?.displayName ?? " "}
            </span>
            <span className="truncate text-gm-xs text-gm-faint">
              {user ? `@${user.githubUsername}` : " "}
            </span>
          </div>
        </div>
      </div>

      <main className="flex min-w-0 shrink grow-999 basis-140 flex-col gap-5 px-4 pt-6 pb-8 sm:gap-7 sm:px-12 sm:py-10">
        {children}
      </main>
    </div>
  );
}
