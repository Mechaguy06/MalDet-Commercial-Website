# MalDet — Commercial & Academic Showcase Website

<p align="center">
  <img src="public/assets/maldet-logo.png" alt="MalDet Logo" width="140" />
</p>

> **Development of an AI-Driven Malware Detection and Trust Scoring System for GitHub Repositories (MalDet)**  
> Final Year Project · Diploma in Cyber Security Technology · German-Malaysian Institute (GMI) · 2026

A standalone React 19 + Vite 8 + TypeScript + Tailwind CSS v4 commercial showcase website for **MalDet**, featuring three hash-routed pages (`Overview`, `How It Works & Tools`, and `About Us & Team`) and direct links to the live MalDet scanner at **[http://103.233.1.97:5000/](http://103.233.1.97:5000/)**.

---

## Live Links

- **Live MalDet Scanner Application**: [http://103.233.1.97:5000/](http://103.233.1.97:5000/)
- **Live Scan History Ledger**: [http://103.233.1.97:5000/history](http://103.233.1.97:5000/history)
- **GitHub Repository**: [https://github.com/Mechaguy06/MalDet-Commercial-Website](https://github.com/Mechaguy06/MalDet-Commercial-Website)

---

## Website Structure (3 Pages)

1. **Page 1 — `Overview` (`#/about`)**
   - **Hero & Live Telemetry**: Full FYP title, direct scanner CTA, and a live preview card of Scan Report `#201` (`Skidotus/maldet`) showing separated **Vulnerability** and **Malicious-Pattern** risk gauges.
   - **Key Metrics**: `181+` repositories scanned, `63,496` findings analysed, `6` detection engines, and `2` clear risk verdicts.
   - **The Problem & The MalDet Solution**: Explains the supply-chain risks of blind trust in public repositories, alert fatigue across fragmented tools, and how MalDet solves them via static multi-engine orchestration and Random Forest triage.

2. **Page 2 — `How It Works & Tools` (`#/documentation`)**
   - **4-Stage Scanning Workflow**: `01 Fetch & Unpack` → `02 Multi-Engine Detect` → `03 Random Forest Triage` → `04 Dual Verdict & Score`.
   - **The 8 Detection & Triage Components**:
     - *Vulnerability Axis*: **Bandit**, **Semgrep**, **pip-audit**
     - *Malicious-Pattern Axis*: **YARA**, **ClamAV**, **GuardDog**, **Dependency Checker** *(custom-built for MalDet)*
     - *ML Triage*: **Risk Classifier** *(Random Forest model trained on real scan data)*
   - **Interactive Architecture Diagram**: Clickable node diagram illustrating data flow from the GitHub API to the MalDet Orchestrator, Random Forest Classifier, Dual-Axis Trust Scorer, and Local LLM & Web Console.
   - **User Interface Showcase**: Interactive browser mockups of the *One-Click Repository Scanner*, *Interactive Triage & Verdict Console*, and *Scan History & Verdict Ledger*.

3. **Page 3 — `About Us & Team` (`#/contact`)**
   - **Project Team**:
     - **Sir Luqman** — Project Supervisor
     - **Haikal** — Team Lead & Core System Architect (`@Skidotus`)
     - **Ariff** — Project Team Member · Security & Detection Engines
     - **Aleena** — Project Team Member · AI Classifier & Data Triage
     - **Adam** — Project Team Member · Web Interface & Reporting
   - **Direct Access & Inquiry Form**: Validated demonstration contact form alongside direct links to launch the live MalDet scanner.

---

## Design & Theme System

 Shared design tokens and responsive styles live in `styles/global.css` and `src/index.css`, matching the exact aesthetic of the MalDet scanner:
- **Forest & Paper Palette**: Deep bottle-green forest surfaces (`#05110c`, `#0a1d15`, `#10291f`, `#193a2c`), warm ivory paper (`#f4f2eb`, `#fdfcf9`), emerald action buttons (`#1f5f43`), and glowing jade accents (`#a3d9b8`).
- **5-Tier Risk Colors**: `Safe` (`#6cc28a`), `Low` (`#8bb8d6`), `Medium` (`#e8b84a`), `High` (`#ee9055`), and `Critical` (`#e86a5a`).
- **Typography**: `IBM Plex Serif` for display headings, `IBM Plex Sans` for body/UI copy, and `IBM Plex Mono` for scan telemetry.
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

Import `https://github.com/Mechaguy06/MalDet-Commercial-Website` into [Vercel](https://vercel.com/new) with the default Vite settings:

- **Framework Preset**: `Vite`
- **Node.js Version**: `22.x`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`

> **Note:** Keep the `.figma/make/site.json` file committed in the repository, as `vite.config.ts` imports it to populate HTML metadata and favicons during build.
