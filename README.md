# MalDet — Commercial Website

Single-page marketing site for **MalDet**, which scans public GitHub repositories for malware, vulnerable dependencies and supply-chain attacks, sorts findings with ML triage, and gives each repository a trust score from Safe to Critical.

React 19 · Vite 8 · TypeScript · Tailwind CSS v4. No animation or UI libraries — the particle field is a small 2D-canvas component.

## Local development

Use **Node.js 22** and **pnpm 10** (pinned in `.mise.toml`).

```sh
pnpm install --frozen-lockfile
pnpm run dev        # http://localhost:8443
pnpm run typecheck
pnpm run build      # outputs dist/
```

## Structure

```
src/
  App.tsx               page composition
  index.css             design tokens (light/dark), component classes, motion
  lib/site.ts           scanner URL, external links, nav, repo-URL parsing
  lib/motion.ts         reduced-motion, reveal-on-scroll, spotlight helpers
  lib/theme.ts          theme toggle (circular view-transition reveal)
  components/           Header, Preloader, ParticleField, RepoForm, Risk badges/scale, …
  sections/             Hero, Problem, HowItWorks, Engines, ReportPreview,
                        Extension, Pricing, UseCases, Faq, Footer (CTA + footer)
```

Sections in page order: hero with repo-URL input and example report card → problem → how it works (scroll-pinned particle morph: files → scan → triage split → shield) → six detection engines → sample report (verdict, findings log, trend chart, API/CI snippets) → browser extension → pricing with comparison table → use cases → FAQ → footer CTA.

## Design system

- Every colour is a CSS token in `src/index.css`. Light ("paper") is the default; `[data-theme="dark"]` switches to "forest". `.stage` and `.code` always use the dark tokens, so hero bands and code snippets stay dark in both themes.
- Verdict scale tokens: `--risk-{safe,low,medium,high,critical}` (swatch), `-ink` (AA text), `-soft` (badge tint). Every text/background pair passes WCAG AA in both themes.
- Type: IBM Plex Sans (light 300 for display headings) and IBM Plex Mono for labels and telemetry.
- Motion respects `prefers-reduced-motion`: no preloader, static particle frames, content visible immediately.
- On mobile, the pricing comparison table and the findings log collapse into cards.

## Placeholders to replace before launch

Placeholders render as dashed amber chips (`<Placeholder>`), so they're easy to spot on the page.

| Where | What |
| --- | --- |
| Hero stats, FAQ | Typical / median scan time |
| Pricing | Free tier daily scan limit, Pro monthly price |
| FAQ "Is my code stored?" | Retention policy for checkouts and reports |
| Extension section | Chrome / Firefox store links (`LINKS` in `src/lib/site.ts`), example "Scanned" date |
| `src/lib/site.ts` | Docs, privacy, terms URLs; contact and sales emails (currently `@maldet.example`) |
| Sample report | API endpoint and GitHub Action names are illustrative (`api.maldet.example`, `maldet/scan-action`) |
| `src/lib/site.ts` | The form opens `SCANNER_URL?repo=…` — confirm the scanner reads the `repo` parameter |
| `.figma/make/site.json` | `openGraph.image` is relative; set it to an absolute URL once the domain is known |

## Deploying on Vercel

Import the repository into [Vercel](https://vercel.com/new) with the default Vite settings:

- **Framework Preset**: `Vite`
- **Node.js Version**: `22.x`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`

> Keep `.figma/make/site.json` committed: `vite.config.ts` imports it to inject the meta description, Open Graph tags and favicon at build time.
