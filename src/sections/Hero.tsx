import { useEffect, useState } from "react"
import ParticleField from "@/components/ParticleField"
import Placeholder from "@/components/Placeholder"
import RepoForm from "@/components/RepoForm"
import { LevelScale, RiskBadge } from "@/components/Risk"
import { prefersReducedMotion } from "@/lib/motion"

const ENGINE_LOG = [
  { engine: "bandit", result: "2 findings" },
  { engine: "semgrep", result: "4 findings" },
  { engine: "yara", result: "1 finding" },
  { engine: "clamav", result: "clean" },
  { engine: "guarddog", result: "1 finding" },
  { engine: "dependencies", result: "6 findings" },
]

/** An example report that "runs" once on load, then holds its verdict. */
function HeroReportCard() {
  const [step, setStep] = useState(() => (prefersReducedMotion() ? ENGINE_LOG.length + 1 : 0))
  const complete = step > ENGINE_LOG.length

  useEffect(() => {
    if (complete) return
    const timer = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 1500 : 420)
    return () => window.clearTimeout(timer)
  }, [step, complete])

  return (
    <figure className="card relative w-full max-w-md overflow-hidden backdrop-blur-md [background:color-mix(in_srgb,var(--surface)_78%,transparent)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="min-w-0">
          <p className="eyebrow !text-[0.66rem]">Example report</p>
          <p className="truncate font-mono text-sm">example-org/sample-cli</p>
        </div>
        <span className="flex items-center gap-2 font-mono text-xs text-muted" aria-live="polite">
          <span
            className={`size-1.5 rounded-full ${complete ? "" : "pulse-dot"}`}
            style={{ background: complete ? "var(--risk-safe)" : "var(--accent)", color: "var(--accent)" }}
          />
          {complete ? "Scan complete" : "Scanning…"}
        </span>
      </div>

      <ol className="space-y-1 px-5 py-4 font-mono text-[0.8rem]" aria-label="Engine results">
        {ENGINE_LOG.map((row, i) => {
          const shown = i < step
          return (
            <li
              key={row.engine}
              className="flex items-center justify-between gap-4 transition-opacity duration-300"
              style={{ opacity: shown ? 1 : 0.28 }}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true" style={{ color: shown ? "var(--accent-text)" : "var(--muted)" }}>
                  {shown ? "✓" : "·"}
                </span>
                {row.engine}
              </span>
              <span className={`text-muted ${i === step - 1 && !complete ? "caret" : ""}`}>{shown ? row.result : "waiting"}</span>
            </li>
          )
        })}
      </ol>

      <div
        className="border-t border-line px-5 py-4 transition-[opacity,transform] duration-700"
        style={{ opacity: complete ? 1 : 0.35, transform: complete ? "none" : "translateY(4px)" }}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm text-muted">Risk level</span>
          <RiskBadge level="medium" />
        </div>
        <LevelScale active="medium" />
        <p className="mt-4 text-sm text-muted">
          ML triage: <span className="text-ink">3 likely real</span> · 11 likely noise
        </p>
      </div>
      <figcaption className="sr-only">
        Illustrative example: six engines report 14 findings, ML triage marks 3 as likely real, and the repository is rated Medium risk.
      </figcaption>
    </figure>
  )
}

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="stage relative isolate overflow-hidden">
      <div className="stage-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-55 lg:opacity-100">
        <ParticleField shape="sphere" interactive center={[0.74, 0.42]} centerMobile={[0.62, 0.24]} scale={0.34} />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pt-28 pb-8 sm:px-6 lg:px-8 lg:pt-36">
        <div className="grid flex-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:self-center">
            <p className="eyebrow fade-in mb-6 flex flex-wrap gap-x-3 gap-y-1">
              <span className="bracket">Static analysis</span>
              <span aria-hidden="true">·</span>
              <span className="bracket">ML triage</span>
              <span aria-hidden="true">·</span>
              <span className="bracket">Trust score</span>
            </p>
            <h1 id="hero-title" className="display text-[clamp(2.6rem,7vw,5.6rem)]">
              <span className="line-mask">
                <span style={{ "--d": "100ms" } as React.CSSProperties}>Know what a repo hides</span>
              </span>
              <span className="line-mask">
                <span className="text-accent-text" style={{ "--d": "220ms" } as React.CSSProperties}>
                  before you run it.
                </span>
              </span>
            </h1>
            <p className="fade-in mt-6 max-w-xl text-lg text-muted" style={{ "--d": "400ms" } as React.CSSProperties}>
              Paste a public GitHub URL. MalDet runs six detection engines, sorts real findings from noise with machine
              learning, and gives the repository a trust score you can read in plain English.
            </p>
            <div id="scan" className="fade-in mt-8 max-w-xl scroll-mt-32" style={{ "--d": "520ms" } as React.CSSProperties}>
              <RepoForm />
              <p className="text-sm text-muted">Free for public repositories. Opens the scanner in a new tab.</p>
            </div>
          </div>

          <div className="fade-in flex justify-center lg:col-span-5 lg:justify-end" style={{ "--d": "650ms" } as React.CSSProperties}>
            <HeroReportCard />
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-line md:grid-cols-4">
          {[
            { value: "6", label: "Detection engines" },
            { value: "5", label: "Risk levels, Safe → Critical" },
            { value: "1", label: "URL to start a scan" },
            { value: <Placeholder>~N min</Placeholder>, label: "Typical scan time" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col-reverse gap-1 border-line py-5 ${i % 2 ? "border-l pl-4" : ""} ${
                i === 2 ? "md:border-l md:pl-4" : ""
              } ${i < 2 ? "border-b md:border-b-0" : ""}`}
            >
              <dt className="font-mono text-[0.72rem] tracking-wide text-muted uppercase">{stat.label}</dt>
              <dd className="display text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
