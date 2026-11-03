import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

export default function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const words = Array.from(el.querySelectorAll<HTMLElement>(".word"))
    let frame = 0
    let fullyLit = false

    const update = () => {
      frame = 0
      if (fullyLit) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      // Starts illuminating as soon as it scrolls into bottom 85% of viewport
      // Fully lights up all words when paragraph reaches upper-middle of screen (50% vh)
      const start = vh * 0.85
      const end = vh * 0.50
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const lit = Math.round(progress * words.length)

      words.forEach((w, i) => w.classList.toggle("on", i < lit))

      if (progress >= 1) {
        fullyLit = true
        words.forEach((w) => w.classList.add("on"))
      }
    }

    const onScroll = () => {
      if (!frame && !fullyLit) frame = requestAnimationFrame(update)
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

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden="true" className="word">
          {word}{" "}
        </span>
      ))}
    </p>
  )
}
