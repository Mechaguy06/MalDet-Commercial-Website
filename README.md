# MalDet — Commercial & Academic Showcase Website

<p align="center">
  <img src="public/assets/maldet-logo.png" alt="MalDet Logo" width="140" />
</p>

> **Development of an AI-Driven Malware Detection and Trust Scoring System for GitHub Repositories (MalDet)**  
> Final Year Project · Diploma in Cyber Security Technology · German-Malaysian Institute (GMI) · 2026

A standalone Astro 7 + React 19 (islands) + TypeScript + Tailwind CSS v4 commercial showcase website for **MalDet**, featuring three statically generated pages (`Overview`, `How It Works & Tools`, and `About Us & Team`) and direct links to the live MalDet scanner at **[https://maldet-fyp.my/](https://maldet-fyp.my/)**.

---

## Live Links

- **Live MalDet Scanner Application**: [https://maldet-fyp.my/](https://maldet-fyp.my/)
- **Live Scan History Ledger**: [https://maldet-fyp.my/history](https://maldet-fyp.my/history)
- **GitHub Repository**: [https://github.com/Mechaguy06/MalDet-Commercial-Website](https://github.com/Mechaguy06/MalDet-Commercial-Website)

---

## Website Structure (3 Pages)

1. **Page 1 — `Overview` (`/`)**
   - **Hero**: Full FYP title, direct scanner CTA, over a Matrix digital-rain canvas background.
   - **Key Metrics**: `181+` repositories scanned, `63,496` findings analysed, `6` detection engines, and `2` clear risk verdicts.
   - **The Problem & The MalDet Solution**: Explains the supply-chain risks of blind trust in public repositories, alert fatigue across fragmented tools, and how MalDet solves them via static multi-engine orchestration and Random Forest triage.

2. **Page 2 — `How It Works & Tools` (`/documentation`)**
   - **4-Stage Scanning Workflow**: `01 Fetch & Unpack` → `02 Multi-Engine Detect` → `03 Random Forest Triage` → `04 Dual Verdict & Score`.
   - **The 8 Detection & Triage Components**:
     - *Vulnerability Axis*: **Bandit**, **Semgrep**, **pip-audit**
     - *Malicious-Pattern Axis*: **YARA**, **ClamAV**, **GuardDog**, **Dependency Checker** *(custom-built for MalDet)*
     - *ML Triage*: **Risk Classifier** *(Random Forest model trained on real scan data)*
   - **Interactive Architecture Diagram**: Clickable node diagram illustrating data flow from the GitHub API to the MalDet Orchestrator, Random Forest Classifier, Dual-Axis Trust Scorer, and Local LLM & Web Console.
   - **User Interface Showcase**: Interactive browser mockups of the *One-Click Repository Scanner*, *Interactive Triage & Verdict Console*, and *Scan History & Verdict Ledger*.

3. **Page 3 — `About Us & Team` (`/contact`)**
   - **Project Team**:
     - **Sir Luqman** — Project Supervisor
     - **Haikal** — Team Lead & Core System Architect (`@Skidotus`)
     - **Ariff** — Project Team Member · Security & Detection Engines
     - **Aleena** — Project Team Member · AI Classifier & Data Triage
     - **Adam** — Project Team Member · Web Interface & Reporting
   - **Direct Access & Inquiry Form**: Validated demonstration contact form alongside direct links to launch the live MalDet scanner.

---

## Design & Theme System

 Shared design tokens and responsive styles live in `src/styles/global.css` (imported through `src/styles/main.css`), matching the exact aesthetic of the MalDet scanner:
- **Forest & Paper Palette**: Deep bottle-green forest surfaces (`#05110c`, `#0a1d15`, `#10291f`, `#193a2c`), warm ivory paper (`#f4f2eb`, `#fdfcf9`), emerald action buttons (`#1f5f43`), and glowing jade accents (`#a3d9b8`). Hero, pipeline and footer bands stay deep forest in both themes.
- **5-Tier Risk Colors**: `Safe` (`#6cc28a`), `Low` (`#8bb8d6`), `Medium` (`#e8b84a`), `High` (`#ee9055`), and `Critical` (`#e86a5a`).
- **Typography**: `Geist` (light 300 display headings with an upright mint accent phrase) and `Geist Mono` for bracketed eyebrows and scan telemetry.
- **Motion**: Session preloader with falling streaks, Matrix digital-rain canvas in the hero, masked line-rise headline, blur-rise scroll reveals, cursor spotlight on cards, scroll-linked word reveal, and a sticky scroll-driven pipeline whose particle form morphs (files → scan → split → shield).
- **Light & Dark Mode**: Supports smooth circular view-transition theme switching.

---

## Local Setup & Development

Use **Node.js 22 LTS** and **pnpm 10** (pinned in `.mise.toml`).

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

To typecheck and build for production:

```sh
pnpm run typecheck
pnpm run build
```

The production bundle is output to `dist/`.

---

## Deploying on Vercel

Import `https://github.com/Mechaguy06/MalDet-Commercial-Website` into [Vercel](https://vercel.com/new) with the Astro preset:

- **Framework Preset**: `Astro`
- **Node.js Version**: `22.x`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`

> **Note:** Page titles, descriptions and Open Graph tags are set per page in `src/pages/*.astro` and `src/layouts/BaseLayout.astro`. Old hash links (`/#/documentation`) redirect to the new paths.

---

## Project Structure

```
src/
  pages/        index.astro, documentation.astro, contact.astro (one real URL each)
  layouts/      BaseLayout.astro (SEO meta, fonts, theme/preloader boot script)
  components/   SiteShell.tsx (React island), ui/, layout/, home/, docs/, contact/
  views/        AboutPage, DocumentationPage, ContactPage (page bodies)
  data/         navigation.ts, content.ts (all copy and data)
  hooks/        useTheme, useLenis, useHeroSpotlight
  styles/       main.css, global.css
public/         favicons and images
```
