import { cn } from "@/lib/utils";

export type ChipTone = "ok" | "vi" | "err" | "pe" | "warn";

/**
 * The monospace status pill. The design builds these from a `--<tone>-bg /
 * -bd / -t` token trio, so each tone is one row in this map rather than a
 * bespoke class string. Also used by the repo overview and chat headers.
 */
const TONE_CLASS: Record<ChipTone, string> = {
  ok: "border-gm-ok-bd bg-gm-ok-bg text-gm-ok-t",
  vi: "border-gm-vi-bd bg-gm-vi-bg text-gm-vi-t",
  err: "border-gm-err-bd bg-gm-err-bg text-gm-err-t",
  pe: "border-gm-pe-bd bg-gm-pe-bg text-gm-pe-t",
  warn: "border-gm-warn-bd bg-gm-warn-bg text-gm-warn-t",
};

export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: ChipTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex self-start rounded-full border px-2.5 py-1 font-gm-mono text-gm-xs",
        TONE_CLASS[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
