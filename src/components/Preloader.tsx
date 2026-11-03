import { useEffect, useState } from "react"

const KEY = "maldet-preloaded"

const STREAKS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 47) % 100}%`,
  delay: `${-((i * 0.37) % 1.6)}s`,
  duration: `${0.9 + ((i * 0.23) % 0.9)}s`,
  opacity: 0.25 + ((i * 0.13) % 0.6),
}))

/**
 * Brief "initialising" screen, shown once per session (never with reduced motion).
 * The markup is always server-rendered; CSS keeps it hidden unless the head script
 * set <html data-preload>, so server and client render the same tree.
 */
export default function Preloader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (!root.hasAttribute("data-preload")) {
      setGone(true)
      return
    }
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {
      // Ignore: the loader just shows again next visit.
    }
    const finish = window.setTimeout(() => setDone(true), 1150)
    const remove = window.setTimeout(() => {
      setGone(true)
      root.removeAttribute("data-preload")
    }, 1800)
    return () => {
      window.clearTimeout(finish)
      window.clearTimeout(remove)
    }
  }, [])

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
      <div className="preload-inner">
        <p className="eyebrow preload-label">Initialising scan environment</p>
        <div className="preload-track">
          <div className="preload-bar" />
        </div>
      </div>
    </div>
  )
}
