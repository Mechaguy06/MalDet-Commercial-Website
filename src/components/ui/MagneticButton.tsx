import { useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

export default function MagneticButton({
  children,
  onClick,
  href,
  to,
  variant = "primary",
  type = "button",
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  /** Internal site link (same tab). */
  to?: string
  variant?: "primary" | "secondary" | "light"
  type?: "button" | "submit"
  disabled?: boolean
}) {
  const ref = useRef<HTMLElement>(null)

  const handleMove = (event: React.MouseEvent) => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ""
  }

  if (to) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={`action-button action-button-${variant}`}
        href={to}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
        <span className="button-arrow" aria-hidden="true">
          →
        </span>
      </a>
    )
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={`action-button action-button-${variant}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
        <span className="button-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={`action-button action-button-${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      <span className="button-arrow" aria-hidden="true">
        →
      </span>
    </button>
  )
}
