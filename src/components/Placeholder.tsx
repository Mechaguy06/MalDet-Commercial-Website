/** Visibly marks copy that needs a real number or confirmed fact before launch. */
export default function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="ph" title="Placeholder — replace before launch">
      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
        <path d="M6 1v6M6 9.5v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>
        <span className="sr-only">Placeholder: </span>
        {children}
      </span>
    </span>
  )
}
