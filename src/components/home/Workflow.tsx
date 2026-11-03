import { useEffect, useRef, useState } from "react"
import ParticleField, { type Shape } from "@/components/ParticleField"
import { workflow } from "@/data/content"

const stages: { shape: Shape; caption: string }[] = [
  { shape: "files", caption: "Clone & unpack" },
  { shape: "scan", caption: "Multi-engine scan" },
  { shape: "split", caption: "Real vs noise" },
  { shape: "shield", caption: "Verdict" },
]

/** Fade + slide-up, driven by `seen`. Reduced motion always shows the final state. */
function reveal(seen: boolean, delay: "delay-0" | "delay-100" | "delay-200" | "delay-300") {
  return [
    "wf-reveal transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
    delay,
    seen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
  ].join(" ")
}

/**
 * Tracks which step is centred in the viewport (`active`) and which steps have
 * scrolled into view at least once (`seen`, so entry animations play only once).
 */
function useWorkflowSteps(count: number) {
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set())

  useEffect(() => {
    if (typeof window.IntersectionObserver !== "function") {
      setSeen(new Set(Array.from({ length: count }, (_, i) => i)))
      return
    }
    const indexOf = (target: Element) => Number((target as HTMLElement).dataset.index)

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(indexOf(entry.target))
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    const seenObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setSeen((prev) => new Set(prev).add(indexOf(entry.target)))
          seenObserver.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    )
    refs.current.forEach((el) => {
      if (!el) return
      activeObserver.observe(el)
      seenObserver.observe(el)
    })
    return () => {
      activeObserver.disconnect()
      seenObserver.disconnect()
    }
  }, [count])

  return { active, seen, refs }
}

/** Scroll-linked pipeline: the copy scrolls while a sticky particle form morphs per step. */
export default function Workflow() {
  const { active, seen, refs } = useWorkflowSteps(workflow.length)

  return (
    <div className="workflow-scroll">
      <ol className="workflow-steps">
        {workflow.map((step, index) => {
          const isActive = active === index
          const isSeen = seen.has(index)
          return (
            <li
              key={step.title}
              ref={(el) => {
                refs.current[index] = el
              }}
              data-index={index}
              className={`workflow-scroll-step ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="workflow-scroll-marker" aria-hidden="true">
                <span className="workflow-scroll-dot" />
                {step.number} / 0{workflow.length}
              </span>

              <div
                className={`${reveal(isSeen, "delay-0")} max-w-lg rounded-2xl border bg-black/20 p-6 backdrop-blur-md sm:p-8 ${
                  isActive
                    ? "border-[#a3d9b8]/30 shadow-[0_0_48px_-14px_rgba(163,217,184,0.4)]"
                    : "border-[#ffffff1a] shadow-none"
                }`}
              >
                <p
                  className={`${reveal(isSeen, "delay-100")} mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffffff1a] bg-[#ffffff0d] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#a3d9b8]`}
                >
                  <span className="relative flex size-1.5" aria-hidden="true">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#a3d9b8] opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-[#a3d9b8]" />
                  </span>
                  [ {step.number} · {stages[index].caption} ]
                </p>
                <h3
                  className={`${reveal(isSeen, "delay-200")} m-0 text-[clamp(1.7rem,3vw,2.5rem)] font-light leading-[1.1] tracking-[-0.03em] text-[#ffffff]`}
                >
                  {step.title}
                </h3>
                <p className={`${reveal(isSeen, "delay-300")} mt-4 leading-[1.7] text-[#ffffffcc]`}>
                  {step.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="workflow-stage" aria-hidden="true">
        <div className="workflow-stage-sticky">
          <div className="workflow-stage-canvas">
            {/* Soft jade glow behind the particles: "live data" pulse. */}
            <div className="pointer-events-none absolute inset-[6%] animate-glow-pulse rounded-full bg-[radial-gradient(circle_at_center,rgba(163,217,184,0.34)_0%,rgba(16,185,129,0.14)_42%,transparent_70%)] blur-2xl motion-reduce:animate-none" />
            <div className="absolute inset-0 animate-float-slow motion-reduce:animate-none">
              <ParticleField shape={stages[active].shape} center={[0.5, 0.5]} scale={0.38} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
