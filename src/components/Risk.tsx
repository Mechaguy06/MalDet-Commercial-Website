export const LEVELS = ["safe", "low", "medium", "high", "critical"] as const
export type Level = (typeof LEVELS)[number]

export const LEVEL_LABEL: Record<Level, string> = {
  safe: "Safe",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

/** Text + tinted pill. Colour is never the only signal: the label is always present. */
export function RiskBadge({ level, size = "md" }: { level: Level; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
      style={{ background: `var(--risk-${level}-soft)`, color: `var(--risk-${level}-ink)` }}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: `var(--risk-${level})` }} />
      {LEVEL_LABEL[level]}
    </span>
  )
}

/** Five-step scale with the active level marked. */
export function LevelScale({ active }: { active: Level }) {
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label={`Risk scale, current level ${LEVEL_LABEL[active]}`}>
      {LEVELS.map((level) => {
        const on = level === active
        return (
          <li key={level} aria-current={on ? "true" : undefined} className="min-w-0">
            <span
              className="block h-1.5 rounded-full transition-opacity"
              style={{ background: `var(--risk-${level})`, opacity: on ? 1 : 0.28 }}
            />
            <span
              className={`mt-1.5 block truncate font-mono text-[0.68rem] tracking-wide ${on ? "font-medium" : ""}`}
              style={{ color: on ? `var(--risk-${level}-ink)` : "var(--muted)" }}
            >
              {LEVEL_LABEL[level]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
