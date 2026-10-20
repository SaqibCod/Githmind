import { MARQUEE_LANGUAGES } from "./landing-content";

function LanguageRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex gap-11 whitespace-nowrap pr-11 text-gm-3xl font-medium text-gm-muted"
      aria-hidden={ariaHidden}
    >
      {MARQUEE_LANGUAGES.map((lang) => (
        <span key={lang}>{lang}</span>
      ))}
    </div>
  );
}

export function LanguageMarquee() {
  return (
    <div className="flex animate-gm-rise flex-col gap-3.5 pt-4.5" style={{ animationDelay: "0.95s" }}>
      <span className="text-gm-xs tracking-gm-eyebrow text-gm-faint uppercase">
        Works with the languages in your repos
      </span>
      <div className="max-w-130 overflow-hidden gm-marquee-mask">
        {/* the row is duplicated so the -50% translate loops seamlessly */}
        <div className="flex w-max animate-gm-marquee">
          <LanguageRow />
          <LanguageRow ariaHidden />
        </div>
      </div>
    </div>
  );
}
