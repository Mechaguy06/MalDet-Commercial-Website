import { useEffect, useState } from "react"
import { type Page, navigation, pagePath, MALDET_URL } from "@/data/navigation"
import ThemeToggle from "@/components/ui/ThemeToggle"
import Brand from "@/components/ui/Brand"

export default function Header({
  page,
  theme,
  onToggleTheme,
}: {
  page: Page
  theme: "light" | "dark"
  onToggleTheme: (event: React.MouseEvent) => void
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        document.querySelector<HTMLButtonElement>(".menu-button")?.focus()
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open])

  return (
    <header className={`site-header ${scrolled || open ? "site-header-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand-button" href={pagePath.about} aria-label="MalDet home">
          <Brand />
        </a>
        <div
          id="primary-menu"
          className={`nav-links ${open ? "nav-links-open" : ""}`}
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${
                page === item.id ? "nav-link-active" : ""
              }`}
              href={item.path}
              aria-current={page === item.id ? "page" : undefined}
            >
              <span className="nav-link-text">{item.label}</span>
            </a>
          ))}
        </div>
        <div className="header-actions">
          <a
            href={MALDET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta-link"
            aria-label="Open live MalDet web scanner in a new tab"
          >
            <span className="header-cta-dot" aria-hidden="true" />
            <span>Open MalDet</span>
            <span className="header-cta-label-full">Scanner</span>
            <span aria-hidden="true">↗</span>
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="primary-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  )
}
