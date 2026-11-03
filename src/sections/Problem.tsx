import { useEffect, useRef } from "react"
import { prefersReducedMotion, trackSpotlight } from "@/lib/motion"

const STATEMENT =
  "Every git clone and pip install is an act of trust. Usually it's deserved. But sometimes a package name is one letter off, an install script reaches for your tokens, or a payload waits inside an archive no scanner can open."

const RISKS = [
  {
    title: "Supply-chain attacks",
    body: "A trusted project picks up a malicious dependency or commit, and every project downstream inherits it without changing a line.",
    tag: "Upstream",
  },
  {
    title: "Typosquatting",
    body: "reqeusts instead of requests. Lookalike package names wait for a fast typist or a copy-pasted install command.",
    tag: "Dependencies",
  },
  {
    title: "Malicious packages",
    body: "Install hooks and setup scripts run the moment a package installs — before you've read a single line of the code.",
    tag: "Install time",
  },
  {
    title: "Malware hidden in archives",
    body: "Password-protected .zip, .7z and .rar files slip past scanners that can't open them. The payload rides along untouched.",
    tag: "Evasion",
  },
]

/** Lights the statement up word by word as it scrolls through the viewport. */
function useWordReveal() {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const words = Array.from(el.querySelectorAll<HTMLElement>(".word"))
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)))
      const lit = Math.round(progress * words.length)
      words.forEach((w, i) => w.classList.toggle("on", i < lit))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return ref
}

export default function Problem() {
  const statementRef = useWordReveal()

  return (
    <section aria-labelledby="problem-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p data-reveal className="eyebrow mb-8">
          <span className="bracket">The problem</span>
        </p>
        <h2 id="problem-title" className="sr-only">
          The risks hiding in open-source code
        </h2>
        <p
          ref={statementRef}
          className="display max-w-5xl text-[clamp(1.75rem,3.8vw,3.25rem)] !leading-[1.15]"
        >
          <span className="sr-only">{STATEMENT}</span>
          {STATEMENT.split(" ").map((word, i) => (
            <span key={i} aria-hidden="true" className="word">
              {word}{" "}
            </span>
          ))}
        </p>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
          {RISKS.map((risk, i) => (
            <li
              key={risk.title}
              data-reveal
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              onPointerMove={trackSpotlight}
              className="card spotlight flex flex-col p-6"
            >
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <h3 className="mt-8 text-xl font-medium tracking-tight">{risk.title}</h3>
              <p className="mt-3 flex-1 text-[0.95rem] text-muted">{risk.body}</p>
              <span className="eyebrow mt-6 !text-[0.68rem]">
                <span className="bracket">{risk.tag}</span>
              </span>
            </li>
          ))}
        </ul>

        <p data-reveal className="mt-12 max-w-2xl text-lg text-muted">
          Each risk needs a different tool, and each tool reports in its own format. MalDet runs them together and tells you
          which results deserve your attention.
        </p>
      </div>
    </section>
  )
}
