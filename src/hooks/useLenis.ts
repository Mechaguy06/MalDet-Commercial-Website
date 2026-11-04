import { useEffect } from "react"
import Lenis from "lenis"
import { prefersReducedMotion } from "@/lib/motion"

export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    // On touch devices / mobile phones (Android / iOS), native momentum scrolling
    // is GPU-accelerated. Intercepting touch events with JavaScript causes
    // noticeable latency and stutter on phones.
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        window.innerWidth < 768)

    if (isTouch) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
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
