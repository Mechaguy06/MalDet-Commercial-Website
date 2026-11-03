import { useId, useState } from "react"
import { normaliseRepoUrl, scanUrlFor } from "@/lib/site"

/** The main call to action: paste a GitHub URL, open the scanner. */
export default function RepoForm({ label = "Scan repo", className = "" }: { label?: string; className?: string }) {
  const id = useId()
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const repo = normaliseRepoUrl(value)
    if (!repo) {
      setError("Enter a GitHub repository URL, like https://github.com/owner/repo")
      return
    }
    setError("")
    window.open(scanUrlFor(repo), "_blank", "noopener")
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <label htmlFor={`${id}-repo`} className="sr-only">
        GitHub repository URL
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
          >
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
          <input
            id={`${id}-repo`}
            className="field"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://github.com/owner/repo"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError("")
            }}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${id}-error` : `${id}-hint`}
          />
        </div>
        <button type="submit" className="btn btn-primary min-h-[3.25rem] px-6">
          {label}
          <span className="btn-arrow" aria-hidden="true">
            <svg viewBox="0 0 12 12" width="12" height="12">
              <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
      <p id={`${id}-error`} role="alert" className="mt-2 min-h-[1.25rem] text-sm" style={{ color: "var(--risk-critical-ink)" }}>
        {error}
      </p>
      <p id={`${id}-hint`} className="sr-only">
        Opens the MalDet scanner in a new tab.
      </p>
    </form>
  )
}
