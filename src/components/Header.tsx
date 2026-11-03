import { useEffect, useState } from "react"
import Logo from "./Logo"
import { NAV } from "@/lib/site"
import { useTheme } from "@/lib/theme"

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === "dark"
  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        {dark ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
          </g>
        ) : (
          <path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full border pr-2 pl-4 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:pl-5 ${
          scrolled || open
            ? "border-line bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] shadow-[var(--shadow)]"
            : "border-[color-mix(in_srgb,var(--line)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)]"
        }`}
      >
        <a href="#top" className="rounded-full text-ink no-underline" aria-label="MalDet home">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm text-muted no-underline transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#scan" className="btn btn-primary hidden min-h-10 text-sm sm:inline-flex">
            Scan a repo
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path
                d={open ? "M5 5l10 10M15 5 5 15" : "M3 7h14M3 13h14"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="card mx-auto mt-2 max-w-5xl p-2 md:hidden"
      >
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-ink no-underline hover:bg-surface-2"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="p-2">
            <a href="#scan" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Scan a repo
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
