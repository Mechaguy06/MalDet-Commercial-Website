import { useCallback, useState } from "react"
import { prefersReducedMotion } from "./motion"

export type Theme = "light" | "dark"

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> }
}

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = useCallback(
    (event?: React.MouseEvent) => {
      const next: Theme = theme === "light" ? "dark" : "light"
      const root = document.documentElement
      const apply = () => {
        root.dataset.theme = next
        setTheme(next)
        try {
          localStorage.setItem("maldet-theme", next)
        } catch {
          // Storage can be blocked; the theme still applies for this visit.
        }
      }

      const doc = document as ViewTransitionDoc
      if (!doc.startViewTransition || prefersReducedMotion()) {
        root.classList.add("theme-fade")
        apply()
        window.setTimeout(() => root.classList.remove("theme-fade"), 320)
        return
      }

      // Reveal the new theme as a circle growing from the toggle.
      const x = event?.clientX ?? window.innerWidth - 40
      const y = event?.clientY ?? 40
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      doc
        .startViewTransition(apply)
        .ready.then(() => {
          root.animate(
            { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
          )
        })
        .catch(() => {})
    },
    [theme],
  )

  return { theme, toggle }
}
