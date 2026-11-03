import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

export function useHeroSpotlight() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section || prefersReducedMotion()) return
    const onMove = (event: MouseEvent) => {
      section.style.setProperty("--spotlight-x", `${event.clientX}px`)
      section.style.setProperty("--spotlight-y", `${event.clientY}px`)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return ref
}
