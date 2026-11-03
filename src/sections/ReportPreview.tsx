import { useEffect, useRef, useState } from "react"
import SectionIntro from "@/components/SectionIntro"
import { LEVELS, LEVEL_LABEL, LevelScale, RiskBadge, type Level } from "@/components/Risk"

type Finding = {
  engine: string
  finding: string
  location: string
  severity: Level
  real: boolean
}

const FINDINGS: Finding[] = [
  { engine: "GuardDog", finding: "Install script runs a shell command", location: "setup.py:14", severity: "medium", real: true },
  { engine: "Dependencies", finding: "Possible typosquat: “reqeusts” resembles “requests”", location: "requirements.txt:3", severity: "medium", real: true },
  { engine: "Dependencies", finding: "urllib3 1.26.4 — CVE-2023-43804", location: "requirements.txt:7", severity: "medium", real: true },
  { engine: "Semgrep", finding: "Possible hard-coded secret", location: "tests/fixtures/config.py:5", severity: "medium", real: false },
  { engine: "Bandit", finding: "B602 subprocess call with shell=True", location: "scripts/build.py:41", severity: "low", real: false },
  { engine: "YARA", finding: "Long base64-encoded string", location: "docs/assets/diagram.svg", severity: "low", real: false },
  { engine: "Dependencies", finding: "Loose version pin: click>=7", location: "requirements.txt:2", severity: "low", real: false },
]

const TREND: Level[] = ["high", "critical", "high", "medium", "medium", "medium"]

type Filter = "all" | "real" | "noise"

function FindingsLog() {
  const [filter, setFilter] = useState<Filter>("all")
  const rows = FINDINGS.filter((f) => filter === "all" || (filter === "real") === f.real)
  const counts = { all: FINDINGS.length, real: FINDINGS.filter((f) => f.real).length, noise: FINDINGS.filter((f) => !f.real).length }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h3 className="text-sm font-medium">Findings log</h3>
        <div role="group" aria-label="Filter findings" className="flex gap-1 rounded-full bg-surface-2 p-1">
          {(
            [
              ["all", "All"],
              ["real", "Likely real"],
              ["noise", "Likely noise"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                filter === key ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {label} <span className="opacity-60">{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="findings w-full text-left text-sm">
          <caption className="sr-only">
            Example findings, filtered to {filter === "all" ? "all findings" : filter === "real" ? "likely real findings" : "likely noise"}
          </caption>
          <thead>
            <tr className="eyebrow !text-[0.66rem]">
              <th scope="col" className="px-5 py-3 font-normal">Engine</th>
              <th scope="col" className="px-3 py-3 font-normal">Finding</th>
              <th scope="col" className="px-3 py-3 font-normal">Severity</th>
              <th scope="col" className="px-5 py-3 font-normal">Triage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.finding} className="border-t border-line align-top">
                <td className="px-5 py-3.5 font-mono text-xs text-muted">{f.engine}</td>
                <td data-cell="finding" className="px-3 py-3.5">
                  <span className="block">{f.finding}</span>
                  <span className="mt-0.5 block font-mono text-xs break-all text-muted">{f.location}</span>
                </td>
                <td className="px-3 py-3.5">
                  <RiskBadge level={f.severity} size="sm" />
                </td>
                <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                  {f.real ? (
                    <span style={{ color: "var(--accent-text)" }}>● Likely real</span>
                  ) : (
                    <span className="text-muted">○ Likely noise</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-5 py-3 font-mono text-xs text-muted">Showing 7 of 14 findings · ClamAV: no detections</p>
    </div>
  )
}

function TrendChart() {
  // Match the viewBox to the rendered width so labels stay 12px on phones.
  const [w, setW] = useState(640)
  const svgRef = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const ro = new ResizeObserver(([entry]) => setW(Math.max(300, Math.round(entry.contentRect.width))))
    ro.observe(svg)
    return () => ro.disconnect()
  }, [])
  const h = 220
  const pad = { l: 78, r: 24, t: 18, b: 34 }
  const x = (i: number) => pad.l + (i * (w - pad.l - pad.r)) / (TREND.length - 1)
  const y = (level: Level) => pad.t + ((4 - LEVELS.indexOf(level)) * (h - pad.t - pad.b)) / 4
  const path = TREND.map((level, i) => `${i ? "L" : "M"}${x(i)},${y(level)}`).join(" ")

  return (
    <div data-reveal className="px-5 py-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">Risk across rescans</h3>
        <span className="font-mono text-xs text-muted">6 scans</span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Risk level across six scans: ${TREND.map((l) => LEVEL_LABEL[l]).join(", ")}.`}
      >
        {LEVELS.map((level) => (
          <g key={level}>
            <line x1={pad.l} x2={w - pad.r} y1={y(level)} y2={y(level)} stroke="var(--line)" strokeDasharray="2 4" />
            <text x={pad.l - 14} y={y(level)} dy="0.35em" textAnchor="end" fontSize="12" fontFamily="var(--font-mono)" fill={`var(--risk-${level}-ink)`}>
              {LEVEL_LABEL[level]}
            </text>
          </g>
        ))}
        {TREND.map((_, i) => (
          <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="var(--muted)">
            #{i + 1}
          </text>
        ))}
        <path d={path} pathLength={1} className="trend-line" fill="none" stroke="var(--accent-text)" strokeWidth="2" strokeLinejoin="round" />
        {TREND.map((level, i) => (
          <circle
            key={i}
            className="trend-point"
            style={{ "--i": i } as React.CSSProperties}
            cx={x(i)}
            cy={y(level)}
            r="5.5"
            fill={`var(--risk-${level})`}
            stroke="var(--surface)"
            strokeWidth="2.5"
          />
        ))}
      </svg>
    </div>
  )
}

const SNIPPETS = [
  {
    key: "api",
    label: "REST API",
    code: [
      ["c", "# Start a scan"],
      ["", "curl -X POST https://api.maldet.example/v1/scans \\"],
      ["", '  -H "Authorization: Bearer $MALDET_TOKEN" \\'],
      ["", "  -d '{\"repo\": \"https://github.com/example-org/sample-cli\"}'"],
      ["", ""],
      ["c", "# → { \"id\": \"scn_…\", \"status\": \"queued\" }"],
    ],
  },
  {
    key: "ci",
    label: "GitHub Actions",
    code: [
      ["c", "# .github/workflows/maldet.yml"],
      ["", "- name: MalDet scan"],
      ["", "  uses: maldet/scan-action@v1"],
      ["", "  with:"],
      ["", "    token: ${{ secrets.MALDET_TOKEN }}"],
      ["", "    fail-on: high"],
    ],
  },
] as const

function CodeTabs() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + SNIPPETS.length) % SNIPPETS.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div data-reveal className="code overflow-hidden rounded-[1.25rem] border border-line bg-bg text-ink">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4">
        <div role="tablist" aria-label="Integration examples" className="flex" onKeyDown={onKeyDown}>
          {SNIPPETS.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={`tab-${s.key}`}
              aria-selected={active === i}
              aria-controls={`panel-${s.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`-mb-px border-b px-3 py-3.5 font-mono text-xs transition-colors ${
                active === i ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[0.68rem] text-muted">Illustrative</span>
      </div>
      {SNIPPETS.map((s, i) => (
        <div key={s.key} role="tabpanel" id={`panel-${s.key}`} aria-labelledby={`tab-${s.key}`} hidden={active !== i} tabIndex={0}>
          <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed">
            <code>
              {s.code.map(([kind, line], j) => (
                <span key={j} className="block" style={{ color: kind === "c" ? "var(--muted)" : undefined }}>
                  {line || " "}
                </span>
              ))}
            </code>
          </pre>
        </div>
      ))}
    </div>
  )
}

export default function ReportPreview() {
  return (
    <section id="report" aria-labelledby="report-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          id="report-title"
          eyebrow="Sample report"
          title="One page that tells you whether to trust it."
          lead="A verdict you can act on, the evidence behind it, and how it has changed since the last scan."
        />

        <div data-reveal className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </span>
            <span className="min-w-0 flex-1 truncate rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
              maldet / report / example-org/sample-cli
            </span>
            <span className="hidden font-mono text-xs text-muted sm:inline">Example data</span>
          </div>

          <div className="grid lg:grid-cols-12">
            <div className="border-line p-6 lg:col-span-4 lg:border-r">
              <p className="eyebrow !text-[0.66rem]">Verdict</p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="display text-5xl" style={{ color: "var(--risk-medium-ink)" }}>
                  Medium
                </span>
                <span className="text-sm text-muted">risk</span>
              </div>
              <div className="mt-5">
                <LevelScale active="medium" />
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-2 border-y border-line py-4 text-center">
                <div>
                  <dt className="font-mono text-[0.66rem] text-muted uppercase">Findings</dt>
                  <dd className="text-2xl font-light">14</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.66rem] text-muted uppercase">Likely real</dt>
                  <dd className="text-2xl font-light" style={{ color: "var(--accent-text)" }}>
                    3
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.66rem] text-muted uppercase">Noise</dt>
                  <dd className="text-2xl font-light text-muted">11</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-2xl bg-accent-soft p-4">
                <p className="eyebrow mb-2 flex items-center gap-2 !text-[0.66rem]">
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                    <path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4Z" fill="currentColor" />
                  </svg>
                  AI summary
                </p>
                <p className="text-[0.92rem] leading-relaxed">
                  A small Python command-line tool. Three findings look real: <code className="font-mono text-[0.85em]">setup.py</code> runs
                  a shell command during installation, the requirements list “reqeusts” — one letter from the popular “requests” package —
                  and the pinned urllib3 has a known vulnerability. The rest sit in tests, docs and a build script and look like noise.
                  Check the install script and that package name before installing.
                </p>
                <p className="mt-3 text-xs text-muted">The summary explains the verdict. It never changes it.</p>
              </div>
            </div>

            <div className="flex flex-col lg:col-span-8">
              <FindingsLog />
              <div className="border-t border-line">
                <TrendChart />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12 [&>*]:min-w-0">
          <div data-reveal className="lg:col-span-5">
            <h3 className="text-xl font-medium tracking-tight">The same report, wherever you work</h3>
            <p className="mt-3 text-muted">
              Pro adds API access, so scans can run from your own scripts. Team adds CI/CD integration, so a pull request that adds a
              risky dependency gets flagged before it merges.
            </p>
          </div>
          <div className="lg:col-span-7">
            <CodeTabs />
          </div>
        </div>
      </div>
    </section>
  )
}
