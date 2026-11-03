export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark"
  onToggle: (event: React.MouseEvent) => void
}) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">
          <span className="theme-toggle-icon theme-toggle-icon-sun">☀</span>
          <span className="theme-toggle-icon theme-toggle-icon-moon">☾</span>
        </span>
        <span className="theme-toggle-stars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
    </button>
  )
}
