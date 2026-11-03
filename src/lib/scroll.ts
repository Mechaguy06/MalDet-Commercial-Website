export function scrollToPageTop() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  if (reducedMotion) {
    window.scrollTo({ top: 0, behavior: "instant" })
    return
  }
  const lenis = (window as any).__lenis
  if (lenis?.scrollTo) {
    lenis.scrollTo(0, { duration: 1.2 })
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}
