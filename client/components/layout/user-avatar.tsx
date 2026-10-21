import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Two-character initials, matching the design's "SQ" treatment: one letter per
 * word, or the first two letters when the name is a single word.
 */
export function initialsOf(displayName: string | undefined, fallback: string) {
  const source = (displayName?.trim() || fallback).trim();
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean);
  const initials =
    parts.length > 1
      ? parts.slice(0, 2).map((p) => p[0]).join("")
      : source.slice(0, 2);

  return initials.toUpperCase();
}

/**
 * The design draws this as initials on a violet-to-amber gradient. GitHub
 * always gives us an avatar URL in practice, so the photo is preferred and the
 * gradient is the fallback — which is also the design's own "No avatar" state
 * on the settings screen.
 */
export function UserAvatar({
  displayName,
  username,
  avatarUrl,
  size,
  className,
}: {
  displayName?: string;
  username: string;
  avatarUrl?: string | null;
  /** rendered px, matched to the design (36 in the sidebar, 72 on settings) */
  size: number;
  className?: string;
}) {
  const initials = initialsOf(displayName, username);

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        className={cn("flex-none rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn(
        "flex flex-none items-center justify-center rounded-full font-semibold text-gm-avatar-fg gm-avatar-fill",
        className
      )}
    >
      {initials}
    </div>
  );
}
