import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion"

export default function CountUpStat({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setDisplay(value)
      return
    }
    let observer: IntersectionObserver | undefined
    let frame: number
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          observer?.disconnect()
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(eased * value))
            if (t < 1) frame = requestAnimationFrame(tick)
          }
          frame = requestAnimationFrame(tick)
        },
        { threshold: 0.4 },
      )
      observer.observe(el)
    } catch {
      setDisplay(value)
    }
    return () => {
      observer?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-value">
        {display.toLocaleString()}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
