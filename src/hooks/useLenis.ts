import { useEffect } from "react"
import Lenis from "lenis"
import { prefersReducedMotion } from "@/lib/motion"

export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    })
    ;(window as any).__lenis = lenis
    let frame: number
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      ;(window as any).__lenis = undefined
    }
  }, [])
}
