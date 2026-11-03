export default function ActionButton({
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
  if (to) {
    return (
      <a
        className={`action-button action-button-${variant}`}
        href={to}
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
        className={`action-button action-button-${variant}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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
      className={`action-button action-button-${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <span className="button-arrow" aria-hidden="true">
        →
      </span>
    </button>
  )
}
