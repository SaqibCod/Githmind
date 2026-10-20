import Link from "next/link";

import { GithMindMark } from "@/components/icons/githmind-mark";
import { cn } from "@/lib/utils";

/**
 * Mark + wordmark, linking home. The design repeats this on the landing
 * header, the sign-in page and the dashboard/chat sidebars; the only thing
 * that varies between them is the type size (18px on landing, 17px in the
 * sidebars), hence the `size` prop.
 */
export function BrandLink({
  size = "md",
  className,
  href = "/",
}: {
  size?: "sm" | "md";
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 font-semibold text-gm-strong",
        size === "md"
          ? "text-gm-2xl tracking-gm-slight"
          : "text-gm-xl",
        className
      )}
    >
      <GithMindMark className={size === "md" ? "size-6.5" : "size-6"} />
      <span>GithMind</span>
    </Link>
  );
}
