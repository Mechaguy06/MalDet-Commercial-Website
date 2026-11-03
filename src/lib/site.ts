/** Live MalDet scanner. The `repo` query parameter pre-fills the scan form. */
export const SCANNER_URL = "https://maldet-fyp.my/"

export const LINKS = {
  docs: "#docs",
  privacy: "#privacy",
  terms: "#terms",
  contact: "mailto:hello@maldet.example",
  sales: "mailto:sales@maldet.example?subject=MalDet%20Team%20plan",
  chromeStore: "#extension",
  firefoxStore: "#extension",
}

export const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#engines", label: "Engines" },
  { href: "#report", label: "Report" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

const GITHUB_REPO = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?(?:[#?].*)?$/i

/** Returns the canonical repo URL, or null if the input isn't a GitHub repository URL. */
export function normaliseRepoUrl(input: string): string | null {
  const match = input.trim().match(GITHUB_REPO)
  if (!match) return null
  return `https://github.com/${match[1]}/${match[2]}`
}

export function scanUrlFor(repoUrl: string): string {
  return `${SCANNER_URL}?repo=${encodeURIComponent(repoUrl)}`
}
