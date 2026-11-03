const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches
}
