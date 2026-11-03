import { useEffect, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion"

const KEY = "maldet-preloaded"

function shouldShow() {
  if (typeof window === "undefined" || prefersReducedMotion()) return false
  try {
    return sessionStorage.getItem(KEY) !== "1"
  } catch {
    return true
  }
}

const STREAKS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 47) % 100}%`,
  delay: `${-((i * 0.37) % 1.6)}s`,
  duration: `${0.9 + ((i * 0.23) % 0.9)}s`,
  opacity: 0.25 + ((i * 0.13) % 0.6),
}))

/** Brief "initialising" screen, shown once per session (never with reduced motion). */
export default function Preloader() {
  const [visible] = useState(shouldShow)
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(!visible)

  useEffect(() => {
    if (!visible) return
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {
      // Ignore: the loader just shows again next visit.
    }
    const finish = window.setTimeout(() => setDone(true), 1150)
    const remove = window.setTimeout(() => setGone(true), 1800)
    return () => {
      window.clearTimeout(finish)
      window.clearTimeout(remove)
    }
  }, [visible])

  if (gone) return null

  return (
    <div className={`preloader stage ${done ? "done" : ""}`} aria-hidden="true">
      {STREAKS.map((s, i) => (
        <span
          key={i}
          className="streak"
          style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration, opacity: s.opacity }}
        />
      ))}
      <div className="relative w-full max-w-md">
        <p className="eyebrow mb-3">
          <span className="bracket">Initialising scan environment</span>
        </p>
        <div className="h-px w-full bg-line">
          <div className="preload-bar" />
        </div>
      </div>
    </div>
  )
}
