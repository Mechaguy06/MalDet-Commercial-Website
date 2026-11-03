import { useEffect, useRef, useState } from "react"
import ParticleField, { type Shape } from "@/components/ParticleField"
import { LevelScale } from "@/components/Risk"

type Step = {
  title: string
  body: string
  shape: Shape
  caption: string
  detail: React.ReactNode
}

const chip = "rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted"

const STEPS: Step[] = [
  {
    title: "Paste a GitHub URL",
    body: "MalDet clones the public repository and unpacks every archive it finds — including the password-protected ones attackers use to hide malware from scanners.",
    shape: "files",
    caption: "Clone & unpack",
    detail: (
      <ul className="flex flex-wrap gap-2" aria-label="Archive formats unpacked">
        {[".zip", ".7z", ".rar", ".tar.gz"].map((ext) => (
          <li key={ext} className={chip}>
            {ext}
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Six engines, one pass",
    body: "Bandit, Semgrep, YARA, ClamAV, GuardDog and the dependency checker run against the same checkout. Their results land in a single findings log, so you never compare six report formats.",
    shape: "scan",
    caption: "Multi-engine scan",
    detail: (
      <ul className="flex flex-wrap gap-2" aria-label="Engines">
        {["Bandit", "Semgrep", "YARA", "ClamAV", "GuardDog", "Dependencies"].map((name) => (
          <li key={name} className={chip}>
            {name}
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "ML triage",
    body: "A machine-learning classifier sorts every finding into likely-real or likely-noise. The few that matter rise to the top; the rest stay labelled and reviewable, not deleted.",
    shape: "split",
    caption: "Real vs noise",
    detail: (
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        <span className="rounded-full px-2.5 py-1" style={{ background: "var(--accent-soft)", color: "var(--accent-text)" }}>
          ● likely real
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 text-muted">○ likely noise</span>
      </div>
    ),
  },
  {
    title: "Trust score & summary",
    body: "The repository gets a risk level from Safe to Critical and an AI-written summary of what was found. The summary explains the verdict — it never changes it. Rescan any time to see how risk moves.",
    shape: "shield",
    caption: "Verdict",
    detail: (
      <div className="max-w-xs">
        <LevelScale active="low" />
      </div>
    ),
  },
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="stage relative isolate">
      <div className="stage-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
        <p data-reveal className="eyebrow mb-5">
          <span className="bracket">How it works</span>
        </p>
        <h2 id="how-title" data-reveal className="display max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)]">
          From URL to verdict in four steps.
        </h2>
      </div>

      <div className="mx-auto grid max-w-7xl gap-x-12 px-4 pb-24 sm:px-6 md:pb-32 lg:grid-cols-2 lg:px-8">
        <ol className="relative">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              data-index={i}
              className={`flex flex-col justify-center border-l border-line py-10 pl-6 transition-opacity duration-500 lg:min-h-[78vh] lg:py-0 lg:pl-10 ${
                active === i ? "" : "lg:opacity-75"
              }`}
              aria-current={active === i ? "step" : undefined}
            >
              <span
                className="mb-5 -ml-[calc(1.5rem+4.5px)] flex items-center gap-4 font-mono text-xs text-muted lg:-ml-[calc(2.5rem+4.5px)]"
                aria-hidden="true"
              >
                <span
                  className="size-2 rounded-full transition-colors duration-500"
                  style={{ background: active === i ? "var(--accent)" : "var(--line-strong)" }}
                />
                0{i + 1} / 04
              </span>
              <h3 className="display text-[clamp(1.6rem,3vw,2.4rem)]">{step.title}</h3>
              <p className="mt-4 max-w-md text-muted">{step.body}</p>
              <div className="mt-6">{step.detail}</div>
            </li>
          ))}
        </ol>

        <div className="hidden lg:block" aria-hidden="true">
          <div className="sticky top-0 flex h-screen flex-col justify-center">
            <div className="relative aspect-square w-full">
              <ParticleField shape={STEPS[active].shape} center={[0.5, 0.5]} scale={0.38} />
            </div>
            <p className="eyebrow mt-2 text-center">
              <span className="bracket">
                0{active + 1} · {STEPS[active].caption}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
