import { useState } from "react"
import Logo from "@/components/Logo"
import Placeholder from "@/components/Placeholder"
import { RiskBadge } from "@/components/Risk"
import SectionIntro from "@/components/SectionIntro"
import { LINKS } from "@/lib/site"

const POINTS = [
  "Shows whether the repository you're viewing has been scanned",
  "Displays its risk level at a glance, right on the page",
  "One click opens the full MalDet report",
]

function BrowserIcon({ variant }: { variant: "chrome" | "firefox" }) {
  // Generic browser glyphs, not the vendors' logos.
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {variant === "chrome" ? (
        <>
          <circle cx="10" cy="10" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 7.2h7M7.6 11.4 4 5.2M12.4 11.4 9 17.4" stroke="currentColor" strokeWidth="1.4" />
        </>
      ) : (
        <path d="M5 6.5c1.5 1 2 2.5 2 4 0 2 1.6 3.5 3.5 3.5 2.2 0 3.8-2 3.3-4.2-.4-1.6-2-2.6-3.6-2.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      )}
    </svg>
  )
}

function RepoPageMock() {
  const [scanned, setScanned] = useState(true)
  const repo = scanned ? "example-org/sample-cli" : "another-org/new-tool"

  return (
    <div data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
      <div role="group" aria-label="Example state" className="mb-3 flex gap-1 rounded-full bg-surface-2 p-1 sm:w-fit">
        {[
          [true, "Scanned repo"],
          [false, "Not yet scanned"],
        ].map(([value, label]) => (
          <button
            key={String(label)}
            type="button"
            aria-pressed={scanned === value}
            onClick={() => setScanned(value as boolean)}
            className={`flex-1 rounded-full px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors ${
              scanned === value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden" aria-live="polite">
        <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="min-w-0 flex-1 truncate rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
            github.com/{repo}
          </span>
          <span className="grid size-7 place-items-center rounded-lg border border-accent bg-accent-soft" title="MalDet extension">
            <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
              <path d="M16 3 5 7.5v7.7c0 6.8 4.6 11.8 11 13.6 6.4-1.8 11-6.8 11-13.6V7.5L16 3Z" fill="none" stroke="var(--accent-text)" strokeWidth="2.4" />
            </svg>
            <span className="sr-only">MalDet extension icon</span>
          </span>
        </div>

        <div className="p-5">
          <p className="font-mono text-sm">
            <span className="text-muted">{repo.split("/")[0]} /</span> <span className="font-medium">{repo.split("/")[1]}</span>
            <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[0.68rem] text-muted">Public</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-accent/40 bg-accent-soft p-4">
            <Logo className="text-sm" />
            {scanned ? (
              <>
                <RiskBadge level="medium" size="sm" />
                <span className="text-sm text-muted">
                  Scanned <Placeholder>date</Placeholder>
                </span>
                <a href="#report" className="ml-auto text-sm font-medium text-accent-text underline-offset-4 hover:underline">
                  View report →
                </a>
              </>
            ) : (
              <>
                <span className="text-sm text-muted">This repository hasn't been scanned yet.</span>
                <a href="#scan" className="ml-auto text-sm font-medium text-accent-text underline-offset-4 hover:underline">
                  Scan it →
                </a>
              </>
            )}
          </div>

          <div className="mt-5 space-y-2.5" aria-hidden="true">
            {[92, 74, 84, 58, 66].map((width, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="size-3 rounded-sm bg-line" />
                <span className="h-2 rounded-full bg-surface-2" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Extension() {
  return (
    <section id="extension" aria-labelledby="extension-title" className="border-y border-line bg-surface py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 [&>*]:min-w-0">
        <div>
          <SectionIntro
            id="extension-title"
            eyebrow="Browser extension"
            title="See the verdict before you clone."
            lead="The MalDet extension adds a small status bar to GitHub repository pages, so the trust check happens where you already are."
          />
          <ul className="-mt-4 space-y-3">
            {POINTS.map((point, i) => (
              <li key={point} data-reveal style={{ "--d": `${i * 80}ms` } as React.CSSProperties} className="flex gap-3">
                <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" className="mt-0.5 flex-none text-accent-text">
                  <path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
            <a href={LINKS.chromeStore} className="btn btn-primary">
              <BrowserIcon variant="chrome" />
              Add to Chrome
            </a>
            <a href={LINKS.firefoxStore} className="btn btn-ghost">
              <BrowserIcon variant="firefox" />
              Add to Firefox
            </a>
            <Placeholder>store links</Placeholder>
          </div>
        </div>
        <RepoPageMock />
      </div>
    </section>
  )
}
