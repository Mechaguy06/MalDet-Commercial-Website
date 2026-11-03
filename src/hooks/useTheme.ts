import { useEffect, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion"

type Theme = "light" | "dark"

const STORAGE_KEY = "maldet-theme"

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode); the theme still applies.
  }
}

/**
 * The initial theme is applied to <html data-theme> by an inline script in the
 * layout head (no flash). The React state starts as "light" so server and
 * client markup match, then syncs from the DOM after hydration.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light")
  }, [])

  const toggleTheme = (event?: React.MouseEvent) => {
    const next: Theme = theme === "light" ? "dark" : "light"
    const root = document.documentElement
    type Doc = Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>
      }
    }
    const doc = document as Doc
    const applyTheme = () => {
      setTheme(next)
      root.dataset.theme = next
      storeTheme(next)
    }
    if (!doc.startViewTransition || prefersReducedMotion()) {
      root.classList.add("theme-transition")
      applyTheme()
      window.setTimeout(() => root.classList.remove("theme-transition"), 350)
      return
    }
    const x = event?.clientX ?? window.innerWidth - 48
    const y = event?.clientY ?? 48
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    const transition = doc.startViewTransition(applyTheme)
    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        )
      })
      .catch(() => {})
  }

  return { theme, toggleTheme }
}
