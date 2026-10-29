import React, { useEffect, useState } from "react"
import Lenis from "lenis"
import { motion, useReducedMotion, useScroll } from "motion/react"

type Page = "about" | "documentation" | "contact"

const MALDET_URL = "http://103.233.1.97:5000/"
const MALDET_SCAN_URL = "http://103.233.1.97:5000/#scan"
const MALDET_HISTORY_URL = "http://103.233.1.97:5000/history"
const MALDET_REPORT_201_URL = "http://103.233.1.97:5000/detail/201"
const MALDET_LOGO_SRC = "/assets/maldet-logo.png"

function getInitialPage(): Page {
  if (typeof window === "undefined") return "about"
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase()
  if (hash === "documentation" || hash === "tools" || hash === "how-it-works") return "documentation"
  if (hash === "contact" || hash === "team" || hash === "about-us") return "contact"
  return "about"
}

type RiskLevel = "Safe" | "Low" | "Medium" | "High" | "Critical"

function RiskSeal({ level }: { level: RiskLevel }) {
  const cls = `seal-badge seal-${level.toLowerCase()}`
  return <span className={cls}>{level}</span>
}

function LevelScale({ active }: { active: RiskLevel }) {
  const steps: RiskLevel[] = ["Safe", "Low", "Medium", "High", "Critical"]
  return (
    <div className="level-scale" aria-hidden="true">
      {steps.map((step) => {
        const key = step.toLowerCase()
        const isOn = step === active
        return (
          <span
            key={step}
            className={`level-scale__step level-scale__step--${key}${isOn ? " is-on" : ""}`}
          />
        )
      })}
    </div>
  )
}

/* ============================================================
   Authentic MalDet Data (from http://103.233.1.97:5000/)
   ============================================================ */

const PIPELINE_STEPS = [
  {
    n: "01",
    title: "Fetch",
    body: "Pull repository metadata and a shallow archive from GitHub."
  },
  {
    n: "02",
    title: "Unpack",
    body: "Extract into an isolated workspace; skip binaries and oversized files."
  },
  {
    n: "03",
    title: "Detect",
    body: "Run Bandit, Semgrep, pip-audit, YARA, ClamAV, GuardDog, and the dependency checker."
  },
  {
    n: "04",
    title: "Triage",
    body: "Score every finding with a Random Forest model to down-rank false positives."
  },
  {
    n: "05",
    title: "Score",
    body: "Roll findings into separate Vulnerability and Malicious-pattern levels and generate an LLM summary."
  }
]

const TOOLS_LIST = [
  {
    code: "Py",
    axis: "Vulnerability",
    axisClass: "axis-tag--vulnerability",
    name: "Bandit",
    desc: "Walks Python abstract syntax trees to catch risky calls such as eval, subprocess with a shell, weak cryptography, and hardcoded secrets."
  },
  {
    code: "Sg",
    axis: "Vulnerability",
    axisClass: "axis-tag--vulnerability",
    name: "Semgrep",
    desc: "Pattern-aware static analysis across Python, JavaScript, TypeScript, Go, Java, Ruby, and PHP using community security rulesets."
  },
  {
    code: "CV",
    axis: "Vulnerability",
    axisClass: "axis-tag--vulnerability",
    name: "pip-audit",
    desc: "Checks declared dependencies against the Python Packaging Advisory Database and OSV to flag packages with known CVEs."
  },
  {
    code: "YR",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    name: "YARA",
    desc: "Matches source files against custom rules for obfuscated payloads, reverse shells, credential harvesters, and encoded droppers."
  },
  {
    code: "AV",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    name: "ClamAV",
    desc: "Signature antivirus engine that catches known trojans, backdoors, and packed binaries committed into a repository."
  },
  {
    code: "GD",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    name: "GuardDog",
    desc: "DataDog's supply-chain heuristics for PyPI and npm packages — detects install-time code execution, exfiltration, and shady metadata."
  },
  {
    code: "Dp",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    name: "Dependency checker",
    desc: "Compares requirement files against popular package names using edit-distance and keyboard-layout rules to spot typosquatting."
  },
  {
    code: "ML",
    axis: "Triage",
    axisClass: "axis-tag--triage",
    name: "Risk classifier",
    desc: "A scikit-learn Random Forest trained on engineered features (file path, entropy, severity, engine agreement) to separate real issues from noise."
  }
]

interface SiemFinding {
  id: string
  severity: "HIGH" | "MEDIUM" | "LOW"
  sealLevel: RiskLevel
  engine: string
  category: string
  description: string
  location: string
  triageLabel: "Likely real" | "Uncertain" | "Likely noise"
  confidence: number
}

const SIEM_FINDINGS: SiemFinding[] = [
  {
    id: "f-1",
    severity: "HIGH",
    sealLevel: "High",
    engine: "Dependency Check",
    category: "Known CVE",
    description:
      "Vulnerability found in requests version 2.31.0: CVE-2026-59951 ( Requests-2.31.0.dist-info )",
    location: "requirements.txt · requests==2.31.0",
    triageLabel: "Likely real",
    confidence: 80
  },
  {
    id: "f-2",
    severity: "HIGH",
    sealLevel: "High",
    engine: "Dependency Check",
    category: "Known CVE",
    description:
      "Vulnerability found in werkzeug version 3.0.1: CVE-2026-114603 ( Werkzeug-3.0.1.dist-info )",
    location: "requirements.txt · werkzeug==3.0.1",
    triageLabel: "Likely real",
    confidence: 80
  },
  {
    id: "f-3",
    severity: "HIGH",
    sealLevel: "High",
    engine: "Semgrep",
    category: "SQL Injection",
    description:
      "Avoiding SQL string concatenation: untrusted input concatenated with raw SQL query can result in SQL Injection.",
    location: "scanner/db_helper.py:42",
    triageLabel: "Likely real",
    confidence: 78
  },
  {
    id: "f-4",
    severity: "HIGH",
    sealLevel: "High",
    engine: "YARA",
    category: "Suspicious Pattern",
    description:
      "YARA rule Base64_Encoded_Exec_Pattern matched in test fixture sample_payload_fixture.py.",
    location: "tests/fixtures/sample_payload_fixture.py:18",
    triageLabel: "Uncertain",
    confidence: 54
  },
  {
    id: "f-5",
    severity: "MEDIUM",
    sealLevel: "Medium",
    engine: "Bandit",
    category: "Subprocess Call",
    description:
      "B603: subprocess call — check for execution of untrusted input in repository archive unpacker.",
    location: "scanner/orchestrator.py:119",
    triageLabel: "Uncertain",
    confidence: 48
  },
  {
    id: "f-6",
    severity: "LOW",
    sealLevel: "Low",
    engine: "Bandit",
    category: "Assert Used",
    description:
      "B101: Use of assert detected. The enclosed code will be removed when compiling to optimised byte code.",
    location: "tests/test_classifier.py:27",
    triageLabel: "Likely noise",
    confidence: 14
  },
  {
    id: "f-7",
    severity: "LOW",
    sealLevel: "Low",
    engine: "YARA",
    category: "Heuristic String",
    description:
      "YARA rule Suspicious_Socket_Import matched inside documentation example snippet.",
    location: "docs/examples/socket_demo.md:12",
    triageLabel: "Likely noise",
    confidence: 11
  }
]

const RECENT_SCANS_LEDGER = [
  {
    id: 201,
    owner: "Skidotus",
    repo: "maldet",
    lang: "HTML",
    vulnLevel: "Medium" as RiskLevel,
    vulnScore: 76,
    malLevel: "Medium" as RiskLevel,
    malScore: 17,
    date: "25 Oct 2026"
  },
  {
    id: 200,
    owner: "storytold",
    repo: "artcraft",
    lang: "TypeScript",
    vulnLevel: "Safe" as RiskLevel,
    vulnScore: 0,
    malLevel: "Medium" as RiskLevel,
    malScore: 25,
    date: "20 Oct 2026"
  },
  {
    id: 199,
    owner: "bilawalsidhu",
    repo: "gods-eye-view",
    lang: "TypeScript",
    vulnLevel: "Low" as RiskLevel,
    vulnScore: 12,
    malLevel: "Medium" as RiskLevel,
    malScore: 16,
    date: "20 Oct 2026"
  },
  {
    id: 198,
    owner: "theagentrouter",
    repo: "agent-router",
    lang: "TypeScript",
    vulnLevel: "High" as RiskLevel,
    vulnScore: 100,
    malLevel: "High" as RiskLevel,
    malScore: 86,
    date: "20 Oct 2026"
  },
  {
    id: 197,
    owner: "home-assistant",
    repo: "core",
    lang: "Python",
    vulnLevel: "Safe" as RiskLevel,
    vulnScore: 0,
    malLevel: "Safe" as RiskLevel,
    malScore: 0,
    date: "20 Oct 2026"
  },
  {
    id: 196,
    owner: "cbcoutinho",
    repo: "nextcloud-mcp-server",
    lang: "Python",
    vulnLevel: "Medium" as RiskLevel,
    vulnScore: 28,
    malLevel: "High" as RiskLevel,
    malScore: 100,
    date: "20 Oct 2026"
  },
  {
    id: 195,
    owner: "vivekchand",
    repo: "clawmetry",
    lang: "Python",
    vulnLevel: "High" as RiskLevel,
    vulnScore: 100,
    malLevel: "High" as RiskLevel,
    malScore: 100,
    date: "20 Oct 2026"
  }
]

/* ============================================================
   Shared Closing Title Plate (Matches Live MalDet Bottom Plate)
   ============================================================ */
function ProjectTitlePlate() {
  return (
    <section className="section section--paper project-title-section">
      <div className="site-container">
        <div className="title-plate">
          <p className="eyebrow eyebrow--on-dark">Full project title</p>
          <h2 className="title-plate__text">
            Development of an AI‑Driven Malware Detection and Trust Scoring System for GitHub
            Repositories (MalDet)
          </h2>
          <p className="title-plate__meta">
            Final Year Project · Diploma in Cyber Security Technology · German‑Malaysian Institute ·
            2026
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              href={MALDET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ribbon btn-pill"
            >
              Open Live MalDet System ↗
            </a>
            <a
              href={MALDET_HISTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light btn-pill"
            >
              Browse 181 Scanned Repos ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   PAGE 1: OVERVIEW (Project Overview, Stats & Tally, Problem & Solution)
   ============================================================ */
function OverviewPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      {/* Hero — Deep Forest with Latest-Scan Preview Card */}
      <section className="hero">
        <div className="site-container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--on-dark hero__eyebrow">
              <span className="live-dot" aria-hidden="true" />
              Final Year Project · Diploma in Cyber Security Technology · German‑Malaysian Institute
            </p>
            <h1 className="hero__title">
              Know what a repository hides <em>before</em> you run it.
            </h1>
            <p className="hero__lede">
              <strong>MalDet</strong> scans public GitHub repositories with six detection engines,
              filters noise with a Random Forest classifier, and reports two separate verdicts —{" "}
              <strong>Vulnerability</strong> and <strong>Malicious pattern</strong> — so accidental
              bugs are never confused with supply‑chain attacks.
            </p>
            <div className="hero__actions">
              <a
                href={MALDET_SCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-lg-pill"
              >
                Scan a repository ↗
              </a>
              <button
                type="button"
                onClick={() => onNavigate("documentation")}
                className="btn btn-ghost-light btn-lg-pill"
              >
                How it works &amp; tools
              </button>
            </div>
          </div>

          {/* Authentic Latest-Scan Preview Card */}
          <aside className="preview-card" aria-label="Latest scan preview">
            <div className="preview-card__bar">
              <span className="preview-card__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="preview-card__label">Latest scan</span>
              <span className="preview-card__time">25 Oct 2026</span>
            </div>
            <div className="preview-card__body">
              <div className="preview-card__repo">
                <div>
                  <span className="preview-card__owner">Skidotus /</span>
                  <strong className="preview-card__name">maldet</strong>
                </div>
                <span className="seal-badge seal-low" style={{ textTransform: "none" }}>
                  HTML · Report #201
                </span>
              </div>

              <div className="preview-card__axes">
                <div className="axis-panel">
                  <div className="axis-panel__head">
                    <span>Vulnerability</span>
                    <RiskSeal level="Medium" />
                  </div>
                  <div className="axis-panel__score">
                    76<small>score</small>
                  </div>
                  <LevelScale active="Medium" />
                </div>

                <div className="axis-panel">
                  <div className="axis-panel__head">
                    <span>Malicious pattern</span>
                    <RiskSeal level="Medium" />
                  </div>
                  <div className="axis-panel__score">
                    17<small>score</small>
                  </div>
                  <LevelScale active="Medium" />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem"
                }}
              >
                <a
                  href={MALDET_REPORT_201_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-card__link"
                >
                  Open live report #201 →
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate("documentation")}
                  className="btn btn-outline-parchment btn-sm-pill"
                >
                  Inspect UI preview
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Live MalDet Statistics & Verdict Tally */}
      <section className="section section--paper">
        <div className="site-container">
          <div className="section-head section-head--center">
            <p className="eyebrow">At a glance</p>
            <h2 className="section-title">One scan. Six engines. Two verdicts.</h2>
            <p className="section-lede">
              Numbers below are read directly from the live MalDet scanner database at{" "}
              <a
                href={MALDET_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--green-text)", fontWeight: 600 }}
              >
                103.233.1.97:5000
              </a>{" "}
              and update with every completed scan.
            </p>
          </div>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-card__value">181</div>
              <div className="stat-card__label">Repositories scanned</div>
              <p>Public GitHub projects analysed end‑to‑end and stored with a full audit trail.</p>
            </div>

            <div className="stat-card">
              <div className="stat-card__value">63,496</div>
              <div className="stat-card__label">Findings analysed</div>
              <p>
                Individual signals triaged by the Random Forest classifier to separate real risk
                from test‑file noise.
              </p>
            </div>

            <div className="stat-card stat-card--split">
              <div className="stat-card__label">Worst verdict per repository</div>
              <ul className="verdict-tally">
                <li>
                  <span className="dot dot--safe" />
                  <span>Safe</span>
                  <b>22</b>
                </li>
                <li>
                  <span className="dot dot--low" />
                  <span>Low</span>
                  <b>36</b>
                </li>
                <li>
                  <span className="dot dot--medium" />
                  <span>Medium</span>
                  <b>37</b>
                </li>
                <li>
                  <span className="dot dot--high" />
                  <span>High</span>
                  <b>44</b>
                </li>
                <li>
                  <span className="dot dot--critical" />
                  <span>Critical</span>
                  <b>42</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs. Solution (Forest & Paper Ledger Comparison) */}
      <section className="section section--white">
        <div className="site-container">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">Why MalDet exists</p>
              <h2 className="section-title">
                The open‑source supply chain problem — and our <em>solution</em>.
              </h2>
              <p className="section-lede">
                Cloning an unfamiliar repository or installing its dependencies runs code on your
                machine immediately. Traditional single‑purpose linters either miss deliberate
                backdoors or bury developers under hundreds of false alarms.
              </p>
            </div>
            <a
              href={MALDET_SCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ribbon btn-pill"
            >
              Test a repository live ↗
            </a>
          </div>

          <div className="problem-solution-grid">
            {/* Left Ledger Column: The Problem */}
            <div className="ledger-column">
              <p className="eyebrow" style={{ color: "var(--critical-text)" }}>
                The Problem
              </p>
              <h3 className="section-title" style={{ fontSize: "1.65rem", marginBottom: "0.5rem" }}>
                Why checking unfamiliar GitHub code is broken today
              </h3>
              <p className="section-lede" style={{ fontSize: "0.95rem" }}>
                Students, researchers, and engineers routinely pull open‑source repositories
                without a practical way to audit what hides inside them.
              </p>

              <ul className="ledger-item-list">
                <li className="ledger-item">
                  <div className="ledger-item__head">
                    <span className="ledger-item__num">Problem 01</span>
                    <h3>Blind trust in public repositories</h3>
                  </div>
                  <p>
                    Attackers weaponize seemingly helpful repositories and dependencies with hidden
                    post‑install hooks, credential stealers, base64‑encoded reverse shells, and
                    typosquatted package names.
                  </p>
                </li>

                <li className="ledger-item">
                  <div className="ledger-item__head">
                    <span className="ledger-item__num">Problem 02</span>
                    <h3>Fragmented tools &amp; overwhelming alert fatigue</h3>
                  </div>
                  <p>
                    Running Bandit, Semgrep, YARA, ClamAV, pip‑audit, and GuardDog manually requires
                    six separate environments and produces thousands of low‑value warnings inside
                    test suites, docs, and vendored folders.
                  </p>
                </li>

                <li className="ledger-item">
                  <div className="ledger-item__head">
                    <span className="ledger-item__num">Problem 03</span>
                    <h3>Single scores conflate bugs with deliberate malware</h3>
                  </div>
                  <p>
                    A single blended "trust score" hides whether a repository simply has an outdated
                    dependency or contains an active data‑exfiltration trojan — two risks that
                    require completely different responses.
                  </p>
                </li>
              </ul>
            </div>

            {/* Right Ledger Column (Forest): The MalDet Solution */}
            <div className="ledger-column ledger-column--forest">
              <p className="eyebrow eyebrow--on-dark">The MalDet Solution</p>
              <h3
                className="section-title section-title--on-dark"
                style={{ fontSize: "1.65rem", marginBottom: "0.5rem" }}
              >
                Automated multi‑engine detection with <em>ML triage</em>
              </h3>
              <p
                className="section-lede"
                style={{ fontSize: "0.95rem", color: "var(--on-forest-muted)" }}
              >
                Paste any GitHub URL and MalDet orchestrates static analysis, supply‑chain checks,
                machine‑learning noise suppression, and plain‑English reporting in one workspace.
              </p>

              <ul className="ledger-item-list">
                <li className="ledger-item">
                  <div className="ledger-item__head">
                    <span className="ledger-item__num">Solution 01</span>
                    <h3>Isolated shallow‑archive unpack &amp; 6‑engine orchestration</h3>
                  </div>
                  <p>
                    MalDet downloads a shallow snapshot into a temporary sandbox — never executing
                    repository code — and runs Bandit, Semgrep, pip‑audit, YARA, ClamAV, GuardDog,
                    and the typosquat dependency checker in parallel.
                  </p>
                </li>

                <li className="ledger-item">
                  <div className="ledger-item__head">
                    <span className="ledger-item__num">Solution 02</span>
                    <h3>Scikit‑learn Random Forest false‑positive filter</h3>
                  </div>
                  <p>
                    Every raw finding is scored by a trained Random Forest classifier using file
                    path context, Shannon entropy, rule severity, and cross‑engine agreement to
                    label alerts as Likely real, Uncertain, or Likely noise.
                  </p>
                </li>

                <li className="ledger-item">
                  <div className="ledger-item__head">
                    <span className="ledger-item__num">Solution 03</span>
                    <h3>Dual‑axis verdicts + local Ollama LLM briefing</h3>
                  </div>
                  <p>
                    Findings roll into two independent 5‑level verdicts —{" "}
                    <strong style={{ color: "var(--on-forest)" }}>Vulnerability</strong> and{" "}
                    <strong style={{ color: "var(--on-forest)" }}>Malicious pattern</strong> — paired
                    with a concise, plain‑English executive summary generated locally via Ollama.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Authentic MalDet "About the project" Split + 5-Step Pipeline */}
      <section className="section section--paper">
        <div className="site-container project-split">
          <div className="project-split__lead">
            <p className="eyebrow">About the project</p>
            <h2 className="section-title">
              A second opinion for code you <em>didn&apos;t write</em>.
            </h2>
            <p className="section-lede">
              Developers install packages and clone repositories every day without time to read
              every line. Traditional scanners either drown you in hundreds of low‑value warnings or
              only check one angle.
            </p>
            <p className="section-lede">
              MalDet combines static code analysis, signature scanning, supply‑chain heuristics, and
              a trained machine‑learning classifier into a single workflow — then writes a short
              plain‑English summary you can act on.
            </p>

            <div className="accordion-list">
              <details className="accordion-item" open>
                <summary>
                  <span className="accordion-icon">V</span>
                  <span>Vulnerability verdict — accidental security weaknesses</span>
                </summary>
                <p>
                  Answers <em>&ldquo;Does this repo have accidental bugs or risky dependencies?&rdquo;</em>{" "}
                  Combines Bandit (Python AST), Semgrep (multi‑language rules), and pip‑audit
                  (known CVEs in dependencies) into a five‑level rating from Safe to Critical.
                </p>
              </details>

              <details className="accordion-item">
                <summary>
                  <span className="accordion-icon">M</span>
                  <span>Malicious‑pattern verdict — deliberate backdoors &amp; trojans</span>
                </summary>
                <p>
                  Answers <em>&ldquo;Does this repo look intentionally harmful?&rdquo;</em> Uses YARA
                  rules, ClamAV signatures, GuardDog supply‑chain heuristics, and typosquatting
                  checks to catch obfuscated payloads, reverse shells, credential stealers, and
                  suspicious install hooks.
                </p>
              </details>

              <details className="accordion-item">
                <summary>
                  <span className="accordion-icon">RF</span>
                  <span>Noise filtering with machine learning</span>
                </summary>
                <p>
                  Static scanners regularly flag test fixtures, documentation examples, and benign
                  utilities. A Random Forest classifier trained on finding metadata estimates the
                  probability that each alert is a genuine risk, so the report highlights what
                  matters first.
                </p>
              </details>

              <details className="accordion-item">
                <summary>
                  <span className="accordion-icon">AI</span>
                  <span>Plain‑English summary via local LLM</span>
                </summary>
                <p>
                  Every report includes a short narrative generated by a local Ollama model that
                  explains the headline findings in clear language — useful for students, reviewers,
                  and non‑specialists who want the bottom line before diving into raw findings.
                </p>
              </details>
            </div>
          </div>

          {/* 5-step pipeline card */}
          <div className="pipeline-card">
            <p className="eyebrow eyebrow--on-dark">Pipeline</p>
            <h3 className="pipeline-card__title">How a scan runs</h3>
            <ol className="pipeline">
              {PIPELINE_STEPS.map((step) => (
                <li key={step.n}>
                  <span className="pipeline__n">{step.n}</span>
                  <div>
                    <b>{step.title}</b>
                    <span>{step.body}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--forest-line)" }}>
              <button
                type="button"
                onClick={() => onNavigate("documentation")}
                className="btn btn-ribbon btn-pill"
                style={{ width: "100%" }}
              >
                Explore all 8 engines &amp; UI showcase →
              </button>
            </div>
          </div>
        </div>
      </section>

      <ProjectTitlePlate />
    </>
  )
}

/* ============================================================
   PAGE 2: HOW IT WORKS & TOOLS (Pipeline, 8 Tools, and Live UI Showcase)
   ============================================================ */
function HowItWorksPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [sevFilter, setSevFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL")
  const [hideNoise, setHideNoise] = useState<boolean>(false)
  const [repoInput, setRepoInput] = useState<string>("https://github.com/Skidotus/maldet")

  const filteredFindings = SIEM_FINDINGS.filter((item) => {
    if (sevFilter !== "ALL" && item.severity !== sevFilter) return false
    if (hideNoise && item.triageLabel === "Likely noise") return false
    return true
  })

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(MALDET_SCAN_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      {/* Compact Forest Hero */}
      <section className="hero hero--compact">
        <div className="site-container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--on-dark hero__eyebrow">
              <span className="live-dot" aria-hidden="true" />
              Architecture · Detection Engines · User Interface
            </p>
            <h1 className="hero__title">
              Under the hood of <em>MalDet</em>.
            </h1>
            <p className="hero__lede">
              Explore the <strong>eight detection and triage tools</strong> powering every scan, walk
              through the 5‑stage analysis pipeline, and test the live MalDet user interfaces — from
              the dark SIEM report console to the repository scan ledger.
            </p>
            <div className="hero__actions">
              <a
                href={MALDET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-lg-pill"
              >
                Open Live MalDet Scanner ↗
              </a>
              <a
                href={MALDET_REPORT_201_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-light btn-lg-pill"
              >
                View Live Report #201 ↗
              </a>
            </div>
          </div>

          {/* Pipeline Summary Card in Hero */}
          <div className="pipeline-card" style={{ border: "1px solid var(--forest-line)" }}>
            <p className="eyebrow eyebrow--on-dark">End-to-end execution</p>
            <h3 className="pipeline-card__title">5‑Stage Static &amp; ML Pipeline</h3>
            <ol className="pipeline">
              {PIPELINE_STEPS.map((step) => (
                <li key={step.n}>
                  <span className="pipeline__n">{step.n}</span>
                  <div>
                    <b>{step.title}</b>
                    <span>{step.body}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* The 8 Detection & Triage Tools Grid */}
      <section className="section section--white">
        <div className="site-container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Under the hood</p>
            <h2 className="section-title">The tools behind the verdict</h2>
            <p className="section-lede">
              MalDet orchestrates established open‑source security engines and feeds their normalized
              output into a custom machine‑learning triage layer.
            </p>
          </div>

          <div className="tool-grid">
            {TOOLS_LIST.map((tool) => (
              <article key={tool.name} className="tool-card">
                <div className="tool-card__top">
                  <span className="tool-card__icon">{tool.code}</span>
                  <span className={`axis-tag ${tool.axisClass}`}>{tool.axis}</span>
                </div>
                <h3 className="tool-card__name">{tool.name}</h3>
                <p>{tool.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* User Interface Showcase 1: Interactive Dark SIEM Report Console */}
      <section className="section section--paper">
        <div className="site-container">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">User Interface 01 · Report Detail Console</p>
              <h2 className="section-title">
                Interactive SIEM report console <em>(/detail/201)</em>
              </h2>
              <p className="section-lede">
                When a scan finishes, MalDet presents a dark forest SIEM console separating
                Vulnerability and Malicious‑pattern verdicts, ML triage distribution, local Ollama
                LLM narrative, engine breakdown bars, and filterable finding rows.
              </p>
            </div>
            <a
              href={MALDET_REPORT_201_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ribbon btn-pill"
            >
              Open Live Report #201 ↗
            </a>
          </div>

          <div className="siem-console-shell">
            {/* SIEM Console Header */}
            <header className="siem-header">
              <div>
                <p className="eyebrow eyebrow--on-dark" style={{ marginBottom: "0.2rem" }}>
                  Scan report #201
                </p>
                <h3 className="siem-title">
                  Skidotus / <strong>maldet</strong>
                </h3>
                <ul className="meta-chips">
                  <li>Language · HTML</li>
                  <li>0 stars</li>
                  <li>0 forks</li>
                  <li>Scanned 25 Oct 2026, 15:23</li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <a
                  href="https://github.com/Skidotus/maldet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-light btn-sm-pill"
                >
                  GitHub ↗
                </a>
                <a
                  href={MALDET_REPORT_201_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ribbon btn-sm-pill"
                >
                  View on MalDet Server ↗
                </a>
              </div>
            </header>

            {/* Row 1: Dual Verdicts + ML Triage Overview */}
            <div className="console-grid console-grid--verdicts">
              {/* Vulnerability Verdict Panel */}
              <article className="console-panel">
                <header className="console-panel__head">
                  <span className="console-panel__title">Vulnerability verdict</span>
                  <RiskSeal level="Medium" />
                </header>
                <p className="verdict__question">Does this repository contain security bugs?</p>
                <div className="verdict__score">
                  <span className="verdict__number">76</span>
                  <span className="verdict__unit">score · raw 159.4</span>
                </div>
                <LevelScale active="Medium" />
                <p className="console-panel__foot">Engines · Bandit, Semgrep, pip‑audit</p>
              </article>

              {/* Malicious Pattern Verdict Panel */}
              <article className="console-panel">
                <header className="console-panel__head">
                  <span className="console-panel__title">Malicious‑pattern verdict</span>
                  <RiskSeal level="Medium" />
                </header>
                <p className="verdict__question">Does this repository look intentionally harmful?</p>
                <div className="verdict__score">
                  <span className="verdict__number">17</span>
                  <span className="verdict__unit">score · raw 159.4</span>
                </div>
                <LevelScale active="Medium" />
                <p className="console-panel__foot">
                  Engines · YARA, ClamAV, GuardDog, Dependency checker
                </p>
              </article>

              {/* Findings Overview + ML Stack Bar */}
              <article className="console-panel">
                <header className="console-panel__head">
                  <span className="console-panel__title">Findings overview</span>
                  <span className="font-mono" style={{ fontSize: "0.78rem", color: "#9fb0a5" }}>
                    67 total
                  </span>
                </header>

                <dl className="sev-counts">
                  <div>
                    <dt>
                      <span className="dot dot--high" />
                      High
                    </dt>
                    <dd>24</dd>
                  </div>
                  <div>
                    <dt>
                      <span className="dot dot--medium" />
                      Medium
                    </dt>
                    <dd>12</dd>
                  </div>
                  <div>
                    <dt>
                      <span className="dot dot--low" />
                      Low
                    </dt>
                    <dd>31</dd>
                  </div>
                </dl>

                <div style={{ marginTop: "0.95rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      color: "#9fb0a5",
                      marginBottom: "0.35rem"
                    }}
                  >
                    <span>ML triage split</span>
                    <span className="font-mono">16 real · 12 unsure · 39 noise</span>
                  </div>
                  <div className="stack-bar" role="img" aria-label="ML triage breakdown">
                    <span className="stack-bar__seg--real" style={{ width: "23.9%" }} />
                    <span className="stack-bar__seg--unsure" style={{ width: "17.9%" }} />
                    <span className="stack-bar__seg--noise" style={{ width: "58.2%" }} />
                  </div>
                </div>
                <p className="console-panel__foot">
                  Random Forest down‑ranks 39 low‑confidence test/fixture alerts
                </p>
              </article>
            </div>

            {/* Row 2: Plain-English Summary + Detections by Engine */}
            <div className="console-grid console-grid--insight">
              <article className="console-panel">
                <header className="console-panel__head">
                  <span className="console-panel__title">Plain‑English summary</span>
                  <span className="seal-badge seal-low" style={{ textTransform: "none" }}>
                    Local Ollama LLM
                  </span>
                </header>
                <div className="llm-summary-box">
                  This repository was rated <strong>Medium</strong> for code vulnerabilities (score
                  76) and <strong>Medium</strong> for malicious patterns (score 17). Out of{" "}
                  <strong>67</strong> raw detections across Bandit, YARA, Semgrep, and Dependency
                  checker, the Random Forest classifier identified <strong>16 likely real</strong>{" "}
                  findings (primarily outdated pinned packages in{" "}
                  <code>requirements.txt</code> and SQL query string formatting) while filtering{" "}
                  <strong>39 likely noise</strong> alerts triggered by YARA rules and test fixtures.
                </div>
              </article>

              <article className="console-panel">
                <header className="console-panel__head">
                  <span className="console-panel__title">Detections by engine</span>
                  <span className="font-mono" style={{ fontSize: "0.76rem", color: "#9fb0a5" }}>
                    4 active engines
                  </span>
                </header>
                <ul className="engine-bars">
                  <li>
                    <div className="engine-bars__label">
                      <span>Bandit</span>
                      <span className="engine-bars__n">32</span>
                    </div>
                    <div className="engine-bars__track">
                      <span style={{ width: "47.8%" }} />
                    </div>
                  </li>
                  <li>
                    <div className="engine-bars__label">
                      <span>YARA</span>
                      <span className="engine-bars__n">22</span>
                    </div>
                    <div className="engine-bars__track">
                      <span style={{ width: "32.8%" }} />
                    </div>
                  </li>
                  <li>
                    <div className="engine-bars__label">
                      <span>Semgrep</span>
                      <span className="engine-bars__n">11</span>
                    </div>
                    <div className="engine-bars__track">
                      <span style={{ width: "16.4%" }} />
                    </div>
                  </li>
                  <li>
                    <div className="engine-bars__label">
                      <span>Dependency checker</span>
                      <span className="engine-bars__n">2</span>
                    </div>
                    <div className="engine-bars__track">
                      <span style={{ width: "6%" }} />
                    </div>
                  </li>
                </ul>
              </article>
            </div>

            {/* Row 3: Interactive Filterable Findings Stream */}
            <div className="siem-events-panel">
              <div className="siem-events-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span className="console-panel__title">Findings stream (sample from #201)</span>
                  <span className="font-mono" style={{ fontSize: "0.76rem", color: "#9fb0a5" }}>
                    Showing {filteredFindings.length} of {SIEM_FINDINGS.length} preview rows
                  </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", alignItems: "center" }}>
                  <div className="seg" role="group" aria-label="Filter by severity">
                    {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSevFilter(sev)}
                        className={`seg__btn${sevFilter === sev ? " is-on" : ""}`}
                      >
                        {sev !== "ALL" && (
                          <span className={`dot dot--${sev.toLowerCase()}`} />
                        )}
                        {sev === "ALL" ? "All" : sev.charAt(0) + sev.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setHideNoise((prev) => !prev)}
                    className={`seg__btn${hideNoise ? " is-on" : ""}`}
                    style={{
                      border: "1px solid rgba(241, 240, 232, 0.14)",
                      borderRadius: "999px"
                    }}
                  >
                    {hideNoise ? "✓ Hiding likely noise" : "Hide likely noise"}
                  </button>
                </div>
              </div>

              <div>
                {filteredFindings.map((f) => (
                  <div key={f.id} className="siem-event-row">
                    <div>
                      <RiskSeal level={f.sealLevel} />
                    </div>
                    <div>
                      <strong style={{ display: "block", color: "#eef0e8" }}>{f.engine}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#9fb0a5" }}>{f.category}</span>
                    </div>
                    <div>
                      <div style={{ color: "#eef0e8", marginBottom: "0.2rem" }}>
                        {f.description}
                      </div>
                      <code
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          color: "var(--green-glow)",
                          fontSize: "0.76rem"
                        }}
                      >
                        {f.location}
                      </code>
                    </div>
                    <div>
                      <span
                        className="axis-tag"
                        style={{
                          background:
                            f.triageLabel === "Likely real"
                              ? "rgba(163, 217, 184, 0.16)"
                              : f.triageLabel === "Uncertain"
                                ? "rgba(232, 184, 74, 0.14)"
                                : "rgba(255, 255, 255, 0.06)",
                          color:
                            f.triageLabel === "Likely real"
                              ? "var(--green-glow)"
                              : f.triageLabel === "Uncertain"
                                ? "var(--medium)"
                                : "#9fb0a5",
                          borderColor: "rgba(241, 240, 232, 0.12)"
                        }}
                      >
                        {f.triageLabel}
                      </span>
                    </div>
                    <div className="font-mono" style={{ fontSize: "0.78rem", color: "#eef0e8" }}>
                      <span className="conf-bar">
                        <i style={{ width: `${f.confidence}%` }} />
                      </span>
                      {f.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Interface Showcase 2: Authentic MalDet Repository Scan Panel */}
      <section className="section section--white">
        <div className="site-container">
          <div className="section-head">
            <p className="eyebrow">User Interface 02 · One‑Click Scanner Panel</p>
            <h2 className="section-title">
              Check any public GitHub repository <em>(#scan)</em>
            </h2>
            <p className="section-lede">
              The live MalDet scanner requires zero configuration. Users paste a repository URL and
              MalDet unpacks a shallow archive, executes all engines, and builds the dual‑axis
              report.
            </p>
          </div>

          <div className="scan-panel">
            <div className="scan-panel__copy">
              <p className="eyebrow eyebrow--on-dark">Try it now</p>
              <h3 className="section-title section-title--on-dark">
                Check a public GitHub repository
              </h3>
              <p>
                Paste any repository URL below. MalDet will unpack a shallow snapshot, run every
                detection engine, filter false positives with the Random Forest model, and build a
                full report.
              </p>
              <ul className="scan-panel__points">
                <li>
                  <span className="scan-panel__check">✓</span> No account or API key required
                </li>
                <li>
                  <span className="scan-panel__check">✓</span> Separate Vulnerability &amp;
                  Malicious‑pattern verdicts
                </li>
                <li>
                  <span className="scan-panel__check">✓</span> Full finding breakdown with file
                  locations and ML confidence
                </li>
              </ul>
            </div>

            <form onSubmit={handleScanSubmit} className="scan-panel__form">
              <label htmlFor="demo_repo_url" className="form-label-ledger">
                GitHub repository URL
              </label>
              <div className="url-field">
                <span className="url-field__icon" aria-hidden="true">
                  ⌘
                </span>
                <input
                  type="url"
                  id="demo_repo_url"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  className="url-field__input"
                  placeholder="https://github.com/owner/repository"
                  required
                />
              </div>
              <p className="form-hint">
                Example: <code>https://github.com/pallets/flask</code> or{" "}
                <code>https://github.com/Skidotus/maldet</code>
              </p>
              <button
                type="submit"
                className="btn btn-ribbon btn-lg-pill"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                Launch Scan on Live MalDet Server ↗
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* User Interface Showcase 3: Scan History Ledger Book */}
      <section className="section section--paper">
        <div className="site-container">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">User Interface 03 · Audit Trail Ledger</p>
              <h2 className="section-title">Recently scanned repositories</h2>
              <p className="section-lede">
                Every scan is archived in the warm‑ivory paper ledger book with its primary
                language, dual risk seals, numerical scores, and one‑click access to the full SIEM
                report.
              </p>
            </div>
            <a
              href={MALDET_HISTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-parchment btn-pill"
            >
              View all 181 scans ↗
            </a>
          </div>

          <div className="ledger-book">
            <div className="table-responsive">
              <table className="table-ledger">
                <thead>
                  <tr>
                    <th>Repository</th>
                    <th>Language</th>
                    <th>Vulnerability</th>
                    <th>Malicious pattern</th>
                    <th>Scanned</th>
                    <th style={{ textAlign: "right" }}>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SCANS_LEDGER.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="repo-cell">
                          <span className="repo-name">{row.repo}</span>
                          <span className="repo-owner">{row.owner}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--muted)" }}>{row.lang}</td>
                      <td>
                        <div className="axis-cell">
                          <RiskSeal level={row.vulnLevel} />
                          <span className={`score-${row.vulnLevel.toLowerCase()}`}>
                            {row.vulnScore}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="axis-cell">
                          <RiskSeal level={row.malLevel} />
                          <span className={`score-${row.malLevel.toLowerCase()}`}>
                            {row.malScore}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{row.date}</td>
                      <td style={{ textAlign: "right" }}>
                        <a
                          href={`http://103.233.1.97:5000/detail/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-parchment btn-sm-pill"
                        >
                          View ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate("about")}
              className="btn btn-outline-parchment btn-pill"
            >
              ← Back to Overview &amp; Problem/Solution
            </button>
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="btn btn-ribbon btn-pill"
            >
              Meet the GMI Project Team →
            </button>
          </div>
        </div>
      </section>

      <ProjectTitlePlate />
    </>
  )
}

/* ============================================================
   PAGE 3: ABOUT US & TEAM (GMI FYP Story, Team Members, Supervisor & Inquiry)
   ============================================================ */
function AboutUsTeamPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitted(true)
  }

  return (
    <>
      {/* Compact Forest Hero */}
      <section className="hero hero--compact">
        <div className="site-container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--on-dark hero__eyebrow">
              <span className="live-dot" aria-hidden="true" />
              About Us · German‑Malaysian Institute · 2026
            </p>
            <h1 className="hero__title">
              Built as a final year project, <em>made to be used</em>.
            </h1>
            <p className="hero__lede">
              MalDet was designed and built by a four‑student Cyber Security Technology team at the{" "}
              <strong>German‑Malaysian Institute (GMI)</strong> under the supervision of{" "}
              <strong>Sir Luqman</strong> to make open‑source repository auditing practical,
              transparent, and fast.
            </p>
            <div className="hero__actions">
              <a
                href={MALDET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-lg-pill"
              >
                Visit Live MalDet Website ↗
              </a>
              <a
                href="https://github.com/Skidotus/maldet"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-light btn-lg-pill"
              >
                GitHub Repository ↗
              </a>
            </div>
          </div>

          {/* Academic Credential Card */}
          <aside className="preview-card" aria-label="Academic project credentials">
            <div className="preview-card__bar">
              <span className="preview-card__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="preview-card__label">Academic Monograph</span>
              <span className="preview-card__time">GMI · 2026</span>
            </div>
            <div className="preview-card__body">
              <p className="eyebrow" style={{ marginBottom: "0.35rem" }}>
                Institution &amp; Programme
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  margin: "0 0 0.75rem",
                  color: "var(--ink)"
                }}
              >
                Diploma in Cyber Security Technology
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", margin: "0 0 1rem" }}>
                German‑Malaysian Institute (GMI) · Final Year Project 2026
              </p>
              <div className="preview-card__axes">
                <div className="axis-panel">
                  <div className="axis-panel__head">
                    <span>Project Team</span>
                    <span className="seal-badge seal-safe">4 Students</span>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      marginTop: "0.5rem",
                      color: "var(--ink)"
                    }}
                  >
                    Haikal, Ariff, Aleena &amp; Adam
                  </div>
                </div>
                <div className="axis-panel">
                  <div className="axis-panel__head">
                    <span>Supervisor</span>
                    <span className="seal-badge seal-low">Advisor</span>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      marginTop: "0.5rem",
                      color: "var(--ink)"
                    }}
                  >
                    Sir Luqman
                  </div>
                </div>
              </div>
              <a
                href={MALDET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-card__link"
              >
                Open live deployment at 103.233.1.97:5000 →
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Authentic MalDet About & Team Split Section */}
      <section className="section section--white">
        <div className="site-container about-split">
          <div className="about-split__story">
            <p className="eyebrow">About us</p>
            <h2 className="section-title">
              Built as a final year project, <em>made to be used</em>.
            </h2>
            <p className="section-lede">
              MalDet is a Final Year Project developed for the{" "}
              <strong>Diploma in Cyber Security Technology</strong> at the{" "}
              <strong>German‑Malaysian Institute (GMI)</strong>.
            </p>
            <p className="section-lede">
              Our goal was to turn research on software supply‑chain security and machine‑learning
              alert triage into a practical tool anyone can run in a browser — whether you are a
              student checking a project dependency, a lecturer reviewing submissions, or a
              developer auditing a library before adding it to requirements.
            </p>

            {/* Key Project Pillars */}
            <div
              style={{
                marginTop: "2rem",
                display: "grid",
                gap: "0.85rem"
              }}
            >
              <div className="axis-panel">
                <div className="axis-panel__head">
                  <span style={{ color: "var(--green-text)", fontWeight: 700 }}>
                    01 · Multi‑Engine Static Analysis
                  </span>
                  <span className="axis-tag axis-tag--vulnerability">6 Scanners + Typosquat</span>
                </div>
                <p style={{ margin: "0.45rem 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                  Unifies Bandit, Semgrep, pip‑audit, YARA, ClamAV, GuardDog, and edit‑distance
                  dependency checks inside a single sandboxed workflow.
                </p>
              </div>

              <div className="axis-panel">
                <div className="axis-panel__head">
                  <span style={{ color: "var(--green-text)", fontWeight: 700 }}>
                    02 · Machine‑Learning Alert Triage
                  </span>
                  <span className="axis-tag axis-tag--triage">Scikit‑Learn Random Forest</span>
                </div>
                <p style={{ margin: "0.45rem 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                  Trained on 63,496+ real repository findings to separate genuine vulnerabilities
                  and malware from harmless test‑suite and documentation matches.
                </p>
              </div>

              <div className="axis-panel">
                <div className="axis-panel__head">
                  <span style={{ color: "var(--green-text)", fontWeight: 700 }}>
                    03 · Dual‑Axis Trust Scoring &amp; Local LLM
                  </span>
                  <span className="axis-tag axis-tag--malicious-pattern">2 Separate Verdicts</span>
                </div>
                <p style={{ margin: "0.45rem 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                  Reports separate Vulnerability and Malicious‑pattern levels alongside a concise
                  plain‑English summary generated by a local Ollama model.
                </p>
              </div>
            </div>
          </div>

          {/* Authentic Team Cards (Directly from Live MalDet Site) */}
          <div className="team">
            <div className="team-group">
              <h3 className="team-group__title">Project team</h3>
              <div className="team-grid team-grid--duo">
                <div className="team-card">
                  <div className="team-card__avatar">H</div>
                  <div className="team-card__body">
                    <h4 className="team-card__name">Haikal</h4>
                    <p className="team-card__role">Team lead</p>
                    <p className="team-card__blurb">
                      Scanner orchestration, Random Forest triage pipeline, and dual‑axis scoring
                      architecture.
                    </p>
                    <a
                      href="https://github.com/Skidotus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-card__link"
                    >
                      github.com/Skidotus ↗
                    </a>
                  </div>
                </div>

                <div className="team-card">
                  <div className="team-card__avatar">A</div>
                  <div className="team-card__body">
                    <h4 className="team-card__name">Ariff</h4>
                    <p className="team-card__role">Team member 1</p>
                    <p className="team-card__blurb">
                      Static analysis integration (Bandit, Semgrep, pip‑audit) and vulnerability
                      scoring calibration.
                    </p>
                  </div>
                </div>

                <div className="team-card">
                  <div className="team-card__avatar">A</div>
                  <div className="team-card__body">
                    <h4 className="team-card__name">Aleena</h4>
                    <p className="team-card__role">Team member 2</p>
                    <p className="team-card__blurb">
                      Malicious‑pattern rule engineering (YARA, ClamAV, GuardDog) and supply‑chain
                      typosquat detection.
                    </p>
                  </div>
                </div>

                <div className="team-card">
                  <div className="team-card__avatar">A</div>
                  <div className="team-card__body">
                    <h4 className="team-card__name">Adam</h4>
                    <p className="team-card__role">Team member 3</p>
                    <p className="team-card__blurb">
                      SIEM report interface, local Ollama LLM executive summary integration, and
                      dataset evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="team-group">
              <h3 className="team-group__title">Supervisor</h3>
              <div className="team-grid">
                <div className="team-card">
                  <div className="team-card__avatar">L</div>
                  <div className="team-card__body">
                    <h4 className="team-card__name">Sir Luqman</h4>
                    <p className="team-card__role">Project supervisor</p>
                    <p className="team-card__blurb">
                      Academic advisor · Diploma in Cyber Security Technology, German‑Malaysian
                      Institute (GMI).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="team-card team-card--note">
              <div className="team-card__avatar">GMI</div>
              <div className="team-card__body">
                <p className="eyebrow" style={{ marginBottom: "0.2rem" }}>
                  Institution
                </p>
                <p>Diploma in Cyber Security Technology · German‑Malaysian Institute · 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Inquiry & Direct Live Access Section */}
      <section className="section section--paper">
        <div className="site-container about-split">
          <div>
            <p className="eyebrow">Get in touch or test live</p>
            <h2 className="section-title">
              Questions, academic review, or <em>live demonstration</em>.
            </h2>
            <p className="section-lede">
              Evaluating MalDet for a Final Year Project assessment, research collaboration, or
              open‑source security review? Jump straight into the live scanner or send a note to the
              project team.
            </p>

            <div className="ledger-book" style={{ marginTop: "1.75rem", padding: "1.5rem" }}>
              <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>
                Direct Live Endpoints
              </p>
              <ul className="verdict-tally" style={{ marginTop: "0.5rem" }}>
                <li>
                  <span className="dot dot--safe" />
                  <span>Live MalDet Web Application</span>
                  <b>
                    <a
                      href={MALDET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--green-text)", textDecoration: "none" }}
                    >
                      103.233.1.97:5000 ↗
                    </a>
                  </b>
                </li>
                <li>
                  <span className="dot dot--low" />
                  <span>Full Repository Scan History (181 repos)</span>
                  <b>
                    <a
                      href={MALDET_HISTORY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--green-text)", textDecoration: "none" }}
                    >
                      /history ↗
                    </a>
                  </b>
                </li>
                <li>
                  <span className="dot dot--medium" />
                  <span>Sample SIEM Report (#201 Skidotus/maldet)</span>
                  <b>
                    <a
                      href={MALDET_REPORT_201_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--green-text)", textDecoration: "none" }}
                    >
                      /detail/201 ↗
                    </a>
                  </b>
                </li>
                <li>
                  <span className="dot dot--high" />
                  <span>Team Lead GitHub Profile</span>
                  <b>
                    <a
                      href="https://github.com/Skidotus"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--green-text)", textDecoration: "none" }}
                    >
                      @Skidotus ↗
                    </a>
                  </b>
                </li>
              </ul>
            </div>
          </div>

          <div className="inquiry-card">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <span className="seal-badge seal-safe" style={{ marginBottom: "0.75rem" }}>
                  Inquiry Recorded
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 400,
                    margin: "0 0 0.5rem"
                  }}
                >
                  Thank you, {name}.
                </h3>
                <p style={{ color: "var(--muted)", margin: "0 0 1.5rem" }}>
                  Your message for the MalDet GMI Final Year Project team has been noted. You can
                  also run a live repository scan right now on our server.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <a
                    href={MALDET_SCAN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ribbon btn-pill"
                  >
                    Open Live Scanner ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setName("")
                      setEmail("")
                      setRepoUrl("")
                      setMessage("")
                    }}
                    className="btn btn-outline-parchment btn-pill"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="inquiry-grid">
                <div>
                  <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>
                    Project Inquiry
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      margin: "0 0 0.5rem"
                    }}
                  >
                    Send feedback or request a repository review
                  </h3>
                </div>

                <div className="inquiry-grid inquiry-grid--two">
                  <div>
                    <label htmlFor="inq_name" className="field-label">
                      Your Name *
                    </label>
                    <input
                      id="inq_name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Reviewer / Lecturer"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="inq_email" className="field-label">
                      Email Address *
                    </label>
                    <input
                      id="inq_email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@gmi.edu.my"
                      className="field-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inq_repo" className="field-label">
                    GitHub Repository URL (Optional)
                  </label>
                  <input
                    id="inq_repo"
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="field-input font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="inq_msg" className="field-label">
                    Message / Assessment Notes
                  </label>
                  <textarea
                    id="inq_msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your questions about the 6 detection engines, Random Forest triage model, or GMI FYP presentation..."
                    className="field-input"
                    style={{ minHeight: "110px", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button type="submit" className="btn btn-ribbon btn-pill">
                    Submit Inquiry
                  </button>
                  <a
                    href={MALDET_SCAN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-parchment btn-pill"
                  >
                    Or scan directly on MalDet ↗
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <ProjectTitlePlate />
    </>
  )
}

/* ============================================================
   ROOT APPLICATION SHELL (Authentic MalDet Header & Footer)
   ============================================================ */
export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    if (prefersReducedMotion) return
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true
    })
    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const onHashChange = () => {
      setPage(getInitialPage())
      setMobileMenuOpen(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 420)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navigateTo = (target: Page) => {
    window.location.hash = `#/${target}`
    setPage(target)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="app-root">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      {/* Authentic MalDet Frosted Forest Header */}
      <header className="site-nav">
        <div className="site-container site-nav__row">
          <button
            type="button"
            onClick={() => navigateTo("about")}
            className="brand"
            aria-label="MalDet Home"
          >
            <img src={MALDET_LOGO_SRC} alt="MalDet logo" className="brand__logo" />
            <span className="brand__text">MalDet</span>
            <span className="brand__badge">GMI FYP · 2026</span>
          </button>

          <button
            type="button"
            className="nav-toggler"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`site-nav__links${mobileMenuOpen ? " is-open" : ""}`}
            aria-label="Primary navigation"
          >
            <button
              type="button"
              onClick={() => navigateTo("about")}
              className={`site-nav__link${page === "about" ? " site-nav__link--active" : ""}`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => navigateTo("documentation")}
              className={`site-nav__link${
                page === "documentation" ? " site-nav__link--active" : ""
              }`}
            >
              How It Works &amp; Tools
            </button>
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className={`site-nav__link${page === "contact" ? " site-nav__link--active" : ""}`}
            >
              About Us &amp; Team
            </button>
            <a
              href={MALDET_SCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ribbon btn-pill site-nav__cta"
            >
              Start a scan ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main>
        {page === "about" && <OverviewPage onNavigate={navigateTo} />}
        {page === "documentation" && <HowItWorksPage onNavigate={navigateTo} />}
        {page === "contact" && <AboutUsTeamPage />}
      </main>

      {/* Authentic MalDet Floating Forest Footer */}
      <footer className="site-footer">
        <div className="site-container">
          <div className="site-footer__panel">
            <div className="site-footer__grid">
              <div className="site-footer__brand">
                <button
                  type="button"
                  onClick={() => navigateTo("about")}
                  className="brand"
                >
                  <img src={MALDET_LOGO_SRC} alt="MalDet logo" className="brand__logo" />
                  <span className="brand__text">MalDet</span>
                </button>
                <p>
                  AI‑driven malware detection and trust scoring for public GitHub repositories.
                  Final Year Project · German‑Malaysian Institute.
                </p>
              </div>

              <div>
                <div className="site-footer__heading">Commercial Showcase</div>
                <ul className="site-footer__list">
                  <li>
                    <button type="button" onClick={() => navigateTo("about")}>
                      Overview &amp; Problem/Solution
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => navigateTo("documentation")}>
                      How It Works, 8 Tools &amp; UI
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => navigateTo("contact")}>
                      About Us &amp; GMI Team
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <div className="site-footer__heading">Live MalDet Scanner</div>
                <ul className="site-footer__list">
                  <li>
                    <a href={MALDET_SCAN_URL} target="_blank" rel="noopener noreferrer">
                      Start a scan ↗
                    </a>
                  </li>
                  <li>
                    <a href={MALDET_REPORT_201_URL} target="_blank" rel="noopener noreferrer">
                      Sample Report (#201) ↗
                    </a>
                  </li>
                  <li>
                    <a href={MALDET_HISTORY_URL} target="_blank" rel="noopener noreferrer">
                      Full scan history (181) ↗
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="site-footer__base">
              <span>© 2026 MalDet Team · German‑Malaysian Institute</span>
              <span>Bandit · Semgrep · pip‑audit · YARA · ClamAV · GuardDog · Scikit‑Learn</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        type="button"
        aria-label="Scroll back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
      >
        ↑
      </button>
    </div>
  )
}
