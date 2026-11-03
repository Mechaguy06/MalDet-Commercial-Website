import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

export default function WordReveal({ text, className = "" }: { text: string; className?: string }) {
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

      // Slowly lights up word-by-word as it scrolls into view (from 90% vh down to 50% vh)
      // When the paragraph reaches the center of the screen (50% vh), 100% of words are fully lit up
      const start = vh * 0.90
      const end = vh * 0.50
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
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
