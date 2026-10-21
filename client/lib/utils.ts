import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Font sizes from the githMind design scale (see `--text-gm-*` in
 * globals.css).
 *
 * tailwind-merge has to be told about these. It cannot tell `text-gm-xs` (a
 * size) from `text-gm-err-t` (a colour) on its own, so it filed both under
 * text-colour and dropped whichever came first — silently stripping the size
 * from any `cn()` call that set both. Listing the sizes explicitly puts them
 * in the font-size group, letting a size and a colour coexist.
 */
const GM_FONT_SIZES = [
  "gm-2xs", "gm-xs", "gm-sm", "gm-base", "gm-md", "gm-lg", "gm-xl",
  "gm-2xl", "gm-3xl",
  "gm-d-2xs", "gm-d-xs", "gm-d-sm", "gm-d-md", "gm-d-lg", "gm-d-xl",
  "gm-d-2xl", "gm-d-3xl", "gm-d-4xl", "gm-d-5xl", "gm-d-6xl",
  "gm-hero",
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...GM_FONT_SIZES] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
