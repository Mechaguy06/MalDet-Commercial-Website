import React, { useEffect, useState } from "react"
import Lenis from "lenis"

type Page = "about" | "documentation" | "contact"

const MALDET_URL = "http://103.233.1.97:5000/"
const MALDET_SCAN_URL = "http://103.233.1.97:5000/#scan"
const MALDET_HISTORY_URL = "http://103.233.1.97:5000/history"
const MALDET_REPORT_201_URL = "http://103.233.1.97:5000/detail/201"
const MALDET_LOGO_SRC = "/assets/maldet-logo.png"

function getInitialPage(): Page {
  if (typeof window === "undefined") return "about"
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase()
  if (hash === "documentation" || hash === "tools" || hash === "history" || hash === "scan") {
    return "documentation"
  }
  if (hash === "contact" || hash === "team") {
    return "contact"
  }
  return "about"
}

type RiskLevel = "Safe" | "Low" | "Medium" | "High" | "Critical"

function LevelScale({ active }: { active: RiskLevel }) {
  const steps: RiskLevel[] = ["Safe", "Low", "Medium", "High", "Critical"]
  return (
    <span className="level-scale" role="img" aria-label={`Level: ${active}`}>
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
    </span>
  )
}

/* ============================================================
   Authentic MalDet Data (from http://103.233.1.97:5000/)
   ============================================================ */

const TOOLS_DATA = [
  {
    icon: "bi-filetype-py",
    name: "Bandit",
    axis: "Vulnerability",
    axisClass: "axis-tag--vulnerability",
    desc: "Finds common security mistakes in Python code, such as shell injection, unsafe deserialisation and hard-coded passwords."
  },
  {
    icon: "bi-code-square",
    name: "Semgrep",
    axis: "Vulnerability",
    axisClass: "axis-tag--vulnerability",
    desc: "Pattern-based code analysis across many languages, using community security rules."
  },
  {
    icon: "bi-box-seam",
    name: "pip-audit",
    axis: "Vulnerability",
    axisClass: "axis-tag--vulnerability",
    desc: "Checks pinned Python dependencies against known CVE advisories, without installing or building anything."
  },
  {
    icon: "bi-fingerprint",
    name: "YARA",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    desc: "Matches files against signature rules for malware families, droppers and obfuscated payloads."
  },
  {
    icon: "bi-virus",
    name: "ClamAV",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    desc: "Open-source antivirus engine that scans every file, including ones inside extracted archives."
  },
  {
    icon: "bi-shield-lock",
    name: "GuardDog",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    desc: "Looks for supply-chain attack behaviour: data exfiltration, install hooks and suspicious downloads."
  },
  {
    icon: "bi-diagram-3",
    name: "Dependency checker",
    axis: "Malicious pattern",
    axisClass: "axis-tag--malicious-pattern",
    desc: "Built for MalDet. Flags typosquatted package names, direct-URL installs and unpinned versions."
  },
  {
    icon: "bi-cpu",
    name: "Risk classifier",
    axis: "Triage",
    axisClass: "axis-tag--triage",
    desc: "Built for MalDet. A Random Forest model trained on real scan data that rates each finding's likelihood of being real."
  }
]

const RECENT_SCANS = [
  {
    id: 201,
    name: "maldet",
    owner: "Skidotus",
    stars: 1,
    lang: "Python",
    vulnLevel: "Medium" as RiskLevel,
    vulnScore: 76,
    malLevel: "Medium" as RiskLevel,
    malScore: 17,
    date: "25 Oct 2026"
  },
  {
    id: 365,
    name: "artcraft",
    owner: "storytold",
    stars: 22936,
    lang: "Rust",
    vulnLevel: "Low" as RiskLevel,
    vulnScore: 3,
    malLevel: "Low" as RiskLevel,
    malScore: 6,
    date: "13 Oct 2026"
  },
  {
    id: 364,
    name: "gods-eye-view",
    owner: "bilawalsidhu",
    stars: 54046,
    lang: "JavaScript",
    vulnLevel: "Safe" as RiskLevel,
    vulnScore: 0,
    malLevel: "High" as RiskLevel,
    malScore: 63,
    date: "13 Oct 2026"
  },
  {
    id: 294,
    name: "agent-router",
    owner: "theagentrouter",
    stars: 2192,
    lang: "Go",
    vulnLevel: "Medium" as RiskLevel,
    vulnScore: 74,
    malLevel: "Low" as RiskLevel,
    malScore: 3,
    date: "07 Oct 2026"
  },
  {
    id: 14,
    name: "core",
    owner: "home-assistant",
    stars: 91283,
    lang: "Python",
    vulnLevel: "Safe" as RiskLevel,
    vulnScore: 0,
    malLevel: "High" as RiskLevel,
    malScore: 86,
    date: "07 Oct 2026"
  },
  {
    id: 11,
    name: "nextcloud-mcp-server",
    owner: "cbcoutinho",
    stars: 376,
    lang: "Python",
    vulnLevel: "Critical" as RiskLevel,
    vulnScore: 531,
    malLevel: "Medium" as RiskLevel,
    malScore: 21,
    date: "07 Oct 2026"
  },
  {
    id: 13,
    name: "clawmetry",
    owner: "vivekchand",
    stars: 424,
    lang: "Python",
    vulnLevel: "Critical" as RiskLevel,
    vulnScore: 584,
    malLevel: "Critical" as RiskLevel,
    malScore: 317,
    date: "07 Oct 2026"
  },
  {
    id: 12,
    name: "hongbomiao.com",
    owner: "hongbo-miao",
    stars: 299,
    lang: "Python",
    vulnLevel: "Critical" as RiskLevel,
    vulnScore: 1562,
    malLevel: "Low" as RiskLevel,
    malScore: 15,
    date: "07 Oct 2026"
  },
  {
    id: 7,
    name: "seclab-taskflow-agent",
    owner: "GitHubSecurityLab",
    stars: 262,
    lang: "Python",
    vulnLevel: "High" as RiskLevel,
    vulnScore: 86,
    malLevel: "Low" as RiskLevel,
    malScore: 2,
    date: "07 Oct 2026"
  },
  {
    id: 8,
    name: "pass-culture-main",
    owner: "pass-culture",
    stars: 194,
    lang: "Python",
    vulnLevel: "Safe" as RiskLevel,
    vulnScore: 0,
    malLevel: "Medium" as RiskLevel,
    malScore: 30,
    date: "07 Oct 2026"
  }
]

interface ConsoleEventItem {
  id: string
  sev: "high" | "medium" | "low"
  tool: string
  toolKey: string
  axis: string
  text: string
  loc: string
  conf: number
  isNoise: boolean
  snippet: string
}

const REPORT_201_EVENTS: ConsoleEventItem[] = [
  {
    id: "ev-1",
    sev: "high",
    tool: "Dependency checker",
    toolKey: "dependency_checker",
    axis: "Vulnerability",
    text: "CVE found: CVE-2026-59951 in mcp==1.29.0 — In affected versions, a Streamable HTTP transport session handling flaw allows unauthenticated request injection.",
    loc: "/requirements.txt:14",
    conf: 99,
    isNoise: false,
    snippet: "mcp==1.29.0"
  },
  {
    id: "ev-2",
    sev: "high",
    tool: "Dependency checker",
    toolKey: "dependency_checker",
    axis: "Vulnerability",
    text: "CVE found: CVE-2026-114603 in werkzeug==3.0.1 — Multipart form parser resource exhaustion when handling specially crafted boundary strings.",
    loc: "/requirements.txt:8",
    conf: 96,
    isNoise: false,
    snippet: "werkzeug==3.0.1"
  },
  {
    id: "ev-3",
    sev: "high",
    tool: "Semgrep",
    toolKey: "semgrep",
    axis: "Vulnerability",
    text: "Avoiding SQL string concatenation: untrusted input concatenated with raw SQL query can result in SQL Injection. In order to execute raw query safely, prepared statement should be used.",
    loc: "/backfill_summaries.py:64",
    conf: 78,
    isNoise: false,
    snippet: "cur.execute(sql, params)"
  },
  {
    id: "ev-4",
    sev: "high",
    tool: "Semgrep",
    toolKey: "semgrep",
    axis: "Vulnerability",
    text: "Avoiding SQL string concatenation: untrusted input concatenated with raw SQL query can result in SQL Injection. SQLAlchemy provides TextualSQL to easily use prepared statement.",
    loc: "/backfill_summaries.py:78",
    conf: 53,
    isNoise: false,
    snippet: "conn.execute(f\"SELECT * FROM scans WHERE id = {scan_id}\")"
  },
  {
    id: "ev-5",
    sev: "medium",
    tool: "Bandit",
    toolKey: "bandit",
    axis: "Vulnerability",
    text: "B603: subprocess call - check for execution of untrusted input in scanner archive extraction routine.",
    loc: "/scanner/unpack.py:52",
    conf: 48,
    isNoise: false,
    snippet: "subprocess.run([\"7z\", \"x\", f\"-p{password}\", archive_path], check=False)"
  },
  {
    id: "ev-6",
    sev: "high",
    tool: "YARA",
    toolKey: "yara",
    axis: "Malicious pattern",
    text: "YARA rule Suspicious_Base64_Exec matched inside YARA rule definition file (self-match on detection signatures).",
    loc: "/rules/malware_rules.yar:112",
    conf: 18,
    isNoise: true,
    snippet: "$b64_exec = /eval\\(base64\\.b64decode\\(/ nocase"
  },
  {
    id: "ev-7",
    sev: "low",
    tool: "Bandit",
    toolKey: "bandit",
    axis: "Vulnerability",
    text: "B101: Use of assert detected. The enclosed code will be removed when compiling to optimised byte code.",
    loc: "/tests/test_classifier.py:27",
    conf: 12,
    isNoise: true,
    snippet: "assert 0.0 <= confidence <= 1.0"
  }
]

/* ============================================================
   Closing Full Project Title Plate (Exact MalDet Component)
   ============================================================ */
function ProjectTitlePlate() {
  return (
    <section
      className="section section--paper project-title-section"
      aria-labelledby="projectTitleFull"
    >
      <div className="site-container">
        <div className="title-plate">
          <h2 className="title-plate__text" id="projectTitleFull">
            Development of an AI‑Driven Malware Detection and Trust Scoring System for GitHub
            Repositories
          </h2>
          <p className="title-plate__meta">
            Final Year Project &middot; Diploma in Cyber Security Technology &middot;
            German-Malaysian Institute
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              href={MALDET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ribbon btn-pill"
            >
              Open Live MalDet Website <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   PAGE 1: OVERVIEW (Exact MalDet Hero, Stats, Project/Pipeline, Problem & Solution)
   ============================================================ */
function OverviewPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      {/* Exact MalDet Hero Section */}
      <section className="hero" id="overview" aria-labelledby="heroTitle">
        <div className="site-container">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--on-dark hero__eyebrow">
              Final Year Project &middot; Development of an AI‑Driven Malware Detection and Trust
              Scoring System for GitHub Repositories (MalDet)
            </p>
            <h1 className="hero__title" id="heroTitle">
              Know what a repository hides <em>before you run&nbsp;it.</em>
            </h1>
            <p className="hero__lede">
              MalDet scans a public GitHub repository with six detection engines, sorts real issues
              from noise with a machine-learning classifier, and gives you two clear verdicts: is
              the code <strong>vulnerable</strong>, and does it look <strong>malicious</strong>?
            </p>
            <div className="hero__actions">
              <a
                href={MALDET_SCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-pill btn-lg-pill"
              >
                Scan a repository
              </a>
              <button
                type="button"
                onClick={() => onNavigate("documentation")}
                className="btn btn-ghost-light btn-pill btn-lg-pill"
              >
                How it works
              </button>
            </div>
          </div>

          <div className="hero__preview">
            <article className="preview-card" aria-label="Most recent scan">
              <header className="preview-card__bar">
                <span className="preview-card__dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="preview-card__label">Latest scan</span>
                <span className="preview-card__time">25 Oct 2026</span>
              </header>
              <div className="preview-card__body">
                <div className="preview-card__repo">
                  <span className="preview-card__owner">Skidotus /</span>
                  <span className="preview-card__name">maldet</span>
                </div>
                <div className="preview-card__axes">
                  <div className="axis-panel">
                    <div className="axis-panel__head">
                      <span>Vulnerability</span>
                      <span className="seal-badge seal-medium">Medium</span>
                    </div>
                    <div className="axis-panel__score">
                      76<small>score</small>
                    </div>
                    <LevelScale active="Medium" />
                  </div>
                  <div className="axis-panel">
                    <div className="axis-panel__head">
                      <span>Malicious pattern</span>
                      <span className="seal-badge seal-medium">Medium</span>
                    </div>
                    <div className="axis-panel__score">
                      17<small>score</small>
                    </div>
                    <LevelScale active="Medium" />
                  </div>
                </div>
                <a
                  className="preview-card__link"
                  href={MALDET_REPORT_201_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open full report <i className="bi bi-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Exact MalDet Stats Section */}
      <section className="section section--paper stats" aria-labelledby="statsTitle">
        <div className="site-container">
          <div className="section-head section-head--center">
            <h2 className="section-title" id="statsTitle">
              One scan. Six engines. <em>Two verdicts.</em>
            </h2>
            <p className="section-lede">
              Running every tool by hand means reconciling six output formats and severity scales.
              MalDet does that work and reduces it to two numbers you can act on.
            </p>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-card__value">181</div>
              <div className="stat-card__label">Repositories scanned</div>
              <p>Every result is stored so you can compare a repository with its earlier scans.</p>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">63,496</div>
              <div className="stat-card__label">Findings analysed</div>
              <p>Each one is scored by the classifier for how likely it is to be a real issue.</p>
            </div>
            <div className="stat-card stat-card--split">
              <div className="stat-card__label">Worst verdict per repository</div>
              <ul className="verdict-tally">
                <li>
                  <span className="dot dot--safe" />
                  Safe<b>22</b>
                </li>
                <li>
                  <span className="dot dot--low" />
                  Low<b>36</b>
                </li>
                <li>
                  <span className="dot dot--medium" />
                  Medium<b>37</b>
                </li>
                <li>
                  <span className="dot dot--high" />
                  High<b>44</b>
                </li>
                <li>
                  <span className="dot dot--critical" />
                  Critical<b>42</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exact MalDet Project & Pipeline Section */}
      <section className="section section--paper" aria-labelledby="projectTitle">
        <div className="site-container project">
          <div className="project__copy">
            <p className="eyebrow">The project</p>
            <h2 className="section-title" id="projectTitle">
              A second opinion for
              <br />
              <em>code you didn&apos;t write.</em>
            </h2>
            <p className="section-lede">
              Developers clone, install and depend on public repositories every day, usually without
              reading them. Attackers know that and hide malware in packages, archives and install
              scripts. MalDet checks a repository for you before it reaches your machine.
            </p>

            <div className="accordion-list">
              <details className="accordion-item" open>
                <summary>
                  <i className="bi bi-bug" aria-hidden="true" />
                  Vulnerability verdict
                </summary>
                <p>
                  Insecure coding patterns an attacker could exploit, such as injection, weak crypto
                  or hard-coded secrets, plus known CVEs in the repository&apos;s pinned
                  dependencies.
                </p>
              </details>
              <details className="accordion-item">
                <summary>
                  <i className="bi bi-shield-exclamation" aria-hidden="true" />
                  Malicious-pattern verdict
                </summary>
                <p>
                  Signs that the code is meant to cause harm: malware signatures, obfuscated
                  payloads, typosquatted package names and install-time hooks. It is scored
                  separately, because a careless mistake and a deliberate attack are different
                  risks.
                </p>
              </details>
              <details className="accordion-item">
                <summary>
                  <i className="bi bi-funnel" aria-hidden="true" />
                  Noise filtering with machine learning
                </summary>
                <p>
                  Six engines on a large repository can produce tens of thousands of findings. A
                  Random Forest classifier gives each finding a confidence that it is real, and that
                  confidence weights the score instead of every alert counting the same.
                </p>
              </details>
              <details className="accordion-item">
                <summary>
                  <i className="bi bi-chat-square-text" aria-hidden="true" />
                  Plain-English summary
                </summary>
                <p>
                  A local language model explains the main findings in a short paragraph. It only
                  explains the results. The risk levels are decided before it sees anything, and it
                  may not change them.
                </p>
              </details>
            </div>
          </div>

          <div className="project__visual">
            <div className="pipeline-card">
              <p className="pipeline-card__title">How a scan runs</p>
              <ol className="pipeline">
                <li>
                  <span className="pipeline__n">01</span>
                  <div>
                    <b>Fetch</b>
                    <span>Repository metadata from the GitHub API, then a shallow clone.</span>
                  </div>
                </li>
                <li>
                  <span className="pipeline__n">02</span>
                  <div>
                    <b>Unpack</b>
                    <span>Archives are extracted, including password-protected ones.</span>
                  </div>
                </li>
                <li>
                  <span className="pipeline__n">03</span>
                  <div>
                    <b>Detect</b>
                    <span>Six engines inspect code, files and dependencies.</span>
                  </div>
                </li>
                <li>
                  <span className="pipeline__n">04</span>
                  <div>
                    <b>Triage</b>
                    <span>The classifier separates likely-real findings from noise.</span>
                  </div>
                </li>
                <li>
                  <span className="pipeline__n">05</span>
                  <div>
                    <b>Score</b>
                    <span>Two risk levels, from Safe to Critical, saved to your history.</span>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section (Using MalDet's .project Split, .stat-card & .pipeline-card) */}
      <section className="section section--white" aria-labelledby="problemSolutionTitle">
        <div className="site-container project">
          <div className="project__copy">
            <p className="eyebrow">Problem statement</p>
            <h2 className="section-title" id="problemSolutionTitle">
              Why checking public repositories is <em>hard by hand.</em>
            </h2>
            <p className="section-lede">
              Before MalDet, auditing an unfamiliar GitHub repository meant either trusting it
              blindly or spending hours configuring separate security linters and reading thousands
              of unranked alerts.
            </p>

            <div style={{ display: "grid", gap: "1rem", marginTop: "1.75rem" }}>
              <div className="stat-card">
                <div className="axis-panel__head" style={{ marginBottom: "0.4rem" }}>
                  <span className="stat-card__label" style={{ margin: 0, color: "var(--ink)" }}>
                    01 &middot; Hidden supply-chain malware
                  </span>
                  <span className="seal-badge seal-critical">Problem</span>
                </div>
                <p>
                  Malicious repositories disguise droppers, obfuscated payloads, typosquatted
                  dependencies, and password-protected archives inside ordinary-looking source trees.
                </p>
              </div>

              <div className="stat-card">
                <div className="axis-panel__head" style={{ marginBottom: "0.4rem" }}>
                  <span className="stat-card__label" style={{ margin: 0, color: "var(--ink)" }}>
                    02 &middot; Six tools, six formats &amp; alert fatigue
                  </span>
                  <span className="seal-badge seal-high">Problem</span>
                </div>
                <p>
                  Running Bandit, Semgrep, pip-audit, YARA, ClamAV, and GuardDog separately produces
                  tens of thousands of raw alerts — mostly triggered by harmless test files and
                  documentation snippets.
                </p>
              </div>

              <div className="stat-card">
                <div className="axis-panel__head" style={{ marginBottom: "0.4rem" }}>
                  <span className="stat-card__label" style={{ margin: 0, color: "var(--ink)" }}>
                    03 &middot; Bugs vs. deliberate attacks
                  </span>
                  <span className="seal-badge seal-medium">Problem</span>
                </div>
                <p>
                  A single combined score hides whether a repository merely has an outdated package
                  CVE or is actively attempting to steal credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="project__visual">
            <div className="pipeline-card">
              <p className="eyebrow eyebrow--on-dark">The MalDet solution</p>
              <p className="pipeline-card__title">How MalDet solves it</p>
              <ol className="pipeline">
                <li>
                  <span className="pipeline__n">
                    <i className="bi bi-layers" aria-hidden="true" />
                  </span>
                  <div>
                    <b>Unified 6-Engine Static Sandbox</b>
                    <span>
                      Clones shallowly and extracts archives without executing any repository code,
                      running all six engines plus custom dependency checks automatically.
                    </span>
                  </div>
                </li>
                <li>
                  <span className="pipeline__n">
                    <i className="bi bi-cpu" aria-hidden="true" />
                  </span>
                  <div>
                    <b>Random Forest False-Positive Triage</b>
                    <span>
                      Scores every finding for how likely it is to be real (`Likely real`,
                      `Uncertain`, `Likely noise`) so test-fixture noise never drowns out genuine
                      threats.
                    </span>
                  </div>
                </li>
                <li>
                  <span className="pipeline__n">
                    <i className="bi bi-shield-check" aria-hidden="true" />
                  </span>
                  <div>
                    <b>Two Independent Verdicts + Local LLM</b>
                    <span>
                      Reports separate Vulnerability and Malicious-pattern ratings (Safe to Critical)
                      alongside a plain-English summary written by a local LLM.
                    </span>
                  </div>
                </li>
              </ol>

              <div style={{ marginTop: "1.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a
                  href={MALDET_SCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ribbon btn-pill"
                >
                  Start a live scan
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate("documentation")}
                  className="btn btn-ghost-light btn-pill"
                >
                  See tools &amp; UI <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectTitlePlate />
    </>
  )
}

/* ============================================================
   PAGE 2: HOW IT WORKS, TOOLS & UI (Exact MalDet #tools, #scan, /detail/201, #history)
   ============================================================ */
function HowItWorksPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [archivePassword, setArchivePassword] = useState("infected")
  const [urlError, setUrlError] = useState<string | null>(null)

  const [sevFilter, setSevFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [toolFilter, setToolFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [hideNoise, setHideNoise] = useState<boolean>(false)
  const [openEventIds, setOpenEventIds] = useState<Record<string, boolean>>({ "ev-1": true })

  const toggleEvent = (id: string) => {
    setOpenEventIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleScanFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = repoUrl
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^(www\.)?github\.com\//, "")
      .replace(/\/+$/, "")
    if (!v) {
      setUrlError("Enter a GitHub repository URL.")
      return
    }
    if (v.split("/").length < 2 || !v.split("/")[1]) {
      setUrlError("That does not look like a repository. Example: https://github.com/owner/repo")
      return
    }
    setUrlError(null)
    window.open(MALDET_SCAN_URL, "_blank", "noopener,noreferrer")
  }

  const filteredEvents = REPORT_201_EVENTS.filter((ev) => {
    if (sevFilter !== "all" && ev.sev !== sevFilter) return false
    if (toolFilter !== "all" && ev.toolKey !== toolFilter) return false
    if (hideNoise && ev.isNoise) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!ev.text.toLowerCase().includes(q) && !ev.loc.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  })

  return (
    <>
      {/* 1. Exact MalDet #tools Section */}
      <section className="section section--white" id="tools" aria-labelledby="toolsTitle">
        <div className="site-container">
          <div className="section-head">
            <p className="eyebrow">Under the hood</p>
            <h2 className="section-title" id="toolsTitle">
              The tools <em>behind the verdict</em>
            </h2>
            <p className="section-lede">
              Established open-source security tools, each looking for something different, plus two
              components built for this project.
            </p>
          </div>

          <div className="tool-grid">
            {TOOLS_DATA.map((tool) => (
              <article key={tool.name} className="tool-card">
                <div className="tool-card__icon">
                  <i className={`bi ${tool.icon}`} aria-hidden="true" />
                </div>
                <h3 className="tool-card__name">{tool.name}</h3>
                <span className={`axis-tag ${tool.axisClass}`}>{tool.axis}</span>
                <p>{tool.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Exact MalDet #scan Section (Interactive Scanner UI) */}
      <section className="section section--paper" id="scan" aria-labelledby="scanTitle">
        <div className="site-container">
          <div className="scan-panel">
            <div className="scan-panel__copy">
              <p className="eyebrow eyebrow--on-dark">Start here</p>
              <h2 className="section-title section-title--on-dark" id="scanTitle">
                Scan a repository
              </h2>
              <p>
                Paste a public GitHub link. Scans run one at a time on the server and usually take a
                few minutes. It is safe to close the tab and come back.
              </p>
              <ul className="scan-panel__points">
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  Public repositories only
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  Nothing from the repository is executed
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  Results are saved to the history below
                </li>
              </ul>
            </div>

            <div className="scan-panel__form">
              <form onSubmit={handleScanFormSubmit} noValidate>
                <label htmlFor="repo_url" className="form-label-ledger form-label-ledger--on-dark">
                  Repository URL
                </label>
                <div className="url-field">
                  <i className="bi bi-github url-field__icon" aria-hidden="true" />
                  <input
                    type="text"
                    className="url-field__input"
                    id="repo_url"
                    name="repo_url"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value)
                      if (urlError) setUrlError(null)
                    }}
                    placeholder="https://github.com/owner/repo"
                    required
                    aria-invalid={urlError ? "true" : undefined}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <p className="form-hint" id="repoUrlHelp">
                  A full GitHub URL or the short form <code>owner/repo</code>.
                </p>
                {urlError && (
                  <p className="form-error" role="alert">
                    {urlError}
                  </p>
                )}

                <details className="advanced">
                  <summary>Advanced options</summary>
                  <label
                    htmlFor="archive_password"
                    className="form-label-ledger form-label-ledger--on-dark mt-3"
                  >
                    Archive password
                  </label>
                  <input
                    type="text"
                    className="url-field__input url-field__input--plain"
                    id="archive_password"
                    name="archive_password"
                    value={archivePassword}
                    onChange={(e) => setArchivePassword(e.target.value)}
                  />
                  <p className="form-hint" id="archiveHelp">
                    Used to open password-protected .zip, .7z and .rar files found in the
                    repository. <code>infected</code> is the usual convention for malware samples.
                  </p>
                </details>

                <button type="submit" className="btn btn-ribbon btn-pill btn-lg-pill w-100 mt-3">
                  <i className="bi bi-search me-2" aria-hidden="true" />
                  Run scan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Exact MalDet Report Console UI (/detail/201 SIEM-style dark console) */}
      <section className="console-page" aria-labelledby="consoleReportTitle">
        <div className="site-container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={MALDET_HISTORY_URL} target="_blank" rel="noopener noreferrer">
              Scan history
            </a>
            <i className="bi bi-chevron-right" aria-hidden="true" />
            <span>Skidotus</span>
            <i className="bi bi-chevron-right" aria-hidden="true" />
            <span aria-current="page">maldet</span>
          </nav>

          <header className="case-header">
            <div className="case-header__main">
              <p className="case-header__eyebrow">
                <span className="live-dot" aria-hidden="true" />
                Scan report &middot; User interface preview
              </p>
              <h2 className="case-header__title" id="consoleReportTitle">
                Skidotus / <strong>maldet</strong>
              </h2>
              <ul className="meta-chips">
                <li>
                  <a
                    href="https://github.com/Skidotus/maldet"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-github" aria-hidden="true" />
                    View on GitHub
                  </a>
                </li>
                <li>
                  <i className="bi bi-code-slash" aria-hidden="true" />
                  Python
                </li>
                <li>
                  <i className="bi bi-star" aria-hidden="true" />1 stars
                </li>
                <li>
                  <i className="bi bi-clock-history" aria-hidden="true" />
                  Scanned 25 Oct 2026, 17:44
                </li>
              </ul>
            </div>
            <div className="case-header__actions">
              <a
                href="http://103.233.1.97:5000/report/201"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-pill"
              >
                <i className="bi bi-file-earmark-text me-1" aria-hidden="true" />
                Report
              </a>
              <a
                href={MALDET_REPORT_201_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-pill"
              >
                <i className="bi bi-arrow-repeat me-1" aria-hidden="true" />
                Open Live #201
              </a>
            </div>
          </header>

          {/* Console Verdicts Grid (3 columns) */}
          <div className="console-grid console-grid--verdicts">
            <section className="console-panel verdict" aria-label="Vulnerability verdict">
              <header className="console-panel__head">
                <span className="console-panel__title">Vulnerability</span>
                <span className="seal-badge seal-medium">Medium</span>
              </header>
              <p className="verdict__question">Could an attacker exploit mistakes in this code?</p>
              <div className="verdict__score">
                <span className="verdict__number score-medium">76</span>
                <span className="verdict__unit">risk score</span>
              </div>
              <LevelScale active="Medium" />
              <p className="verdict__meaning">
                Real issues worth reviewing before you rely on this code.
              </p>
              <dl className="sev-counts">
                <div>
                  <dt>
                    <span className="dot dot--high" />
                    High
                  </dt>
                  <dd>8</dd>
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
                  <dd>25</dd>
                </div>
              </dl>
              <p className="console-panel__foot">Sources: Bandit, Semgrep, pip-audit</p>
            </section>

            <section className="console-panel verdict" aria-label="Malicious pattern verdict">
              <header className="console-panel__head">
                <span className="console-panel__title">Malicious pattern</span>
                <span className="seal-badge seal-medium">Medium</span>
              </header>
              <p className="verdict__question">
                Does this code look like it is trying to cause harm?
              </p>
              <div className="verdict__score">
                <span className="verdict__number score-medium">17</span>
                <span className="verdict__unit">risk score</span>
              </div>
              <LevelScale active="Medium" />
              <p className="verdict__meaning">
                Real issues worth reviewing before you rely on this code.
              </p>
              <dl className="sev-counts">
                <div>
                  <dt>
                    <span className="dot dot--high" />
                    High
                  </dt>
                  <dd>16</dd>
                </div>
                <div>
                  <dt>
                    <span className="dot dot--medium" />
                    Medium
                  </dt>
                  <dd>0</dd>
                </div>
                <div>
                  <dt>
                    <span className="dot dot--low" />
                    Low
                  </dt>
                  <dd>6</dd>
                </div>
              </dl>
              <p className="console-panel__foot">
                Sources: YARA, ClamAV, GuardDog, dependency checker
              </p>
            </section>

            <section className="console-panel" aria-label="Findings overview">
              <header className="console-panel__head">
                <span className="console-panel__title">Findings overview</span>
              </header>
              <div className="verdict__score">
                <span className="verdict__number">67</span>
                <span className="verdict__unit">total findings</span>
              </div>
              <div
                className="stack-bar"
                role="img"
                aria-label="16 likely real, 12 uncertain, 39 likely noise"
              >
                <span className="stack-bar__seg stack-bar__seg--real" style={{ width: "23.9%" }} />
                <span
                  className="stack-bar__seg stack-bar__seg--unsure"
                  style={{ width: "17.9%" }}
                />
                <span className="stack-bar__seg stack-bar__seg--noise" style={{ width: "58.2%" }} />
              </div>
              <dl className="sev-counts sev-counts--stack">
                <div>
                  <dt>
                    <span className="dot dot--real" />
                    Likely real
                  </dt>
                  <dd>16</dd>
                </div>
                <div>
                  <dt>
                    <span className="dot dot--unsure" />
                    Uncertain
                  </dt>
                  <dd>12</dd>
                </div>
                <div>
                  <dt>
                    <span className="dot dot--noise" />
                    Likely noise
                  </dt>
                  <dd>39</dd>
                </div>
              </dl>
              <p className="console-panel__foot">
                The risk classifier rates every finding for how likely it is to be a real issue.
                Likely noise still counts, just much less.
              </p>
            </section>
          </div>

          {/* Console Insight Grid (3 columns) */}
          <div className="console-grid console-grid--insight">
            <section
              className="console-panel console-panel--summary"
              aria-labelledby="summaryTitle"
            >
              <header className="console-panel__head">
                <h3 className="console-panel__title" id="summaryTitle">
                  What we found, in plain English
                </h3>
              </header>
              <p className="findings-summary">
                16 findings likely need attention, 39 look like noise. Most notable: CVE found:
                CVE-2026-59951 in mcp==1.29.0 — In affected versions, a Streamable HTTP session
                handling issue in requirements.txt (99% confidence), alongside raw SQL string
                concatenation in <code>/backfill_summaries.py</code>.
              </p>
            </section>

            <section className="console-panel" aria-labelledby="enginesTitle">
              <header className="console-panel__head">
                <h3 className="console-panel__title" id="enginesTitle">
                  Detections by engine
                </h3>
              </header>
              <ul className="engine-bars">
                <li>
                  <div className="engine-bars__label">
                    <span>Bandit</span>
                    <span className="engine-bars__n">32</span>
                  </div>
                  <div className="engine-bars__track">
                    <span style={{ width: "100.0%" }} />
                  </div>
                  <p className="engine-bars__hint">Python security linter &middot; Vulnerability</p>
                </li>
                <li>
                  <div className="engine-bars__label">
                    <span>YARA</span>
                    <span className="engine-bars__n">22</span>
                  </div>
                  <div className="engine-bars__track">
                    <span style={{ width: "68.8%" }} />
                  </div>
                  <p className="engine-bars__hint">
                    Malware signature rules &middot; Malicious pattern
                  </p>
                </li>
                <li>
                  <div className="engine-bars__label">
                    <span>Semgrep</span>
                    <span className="engine-bars__n">11</span>
                  </div>
                  <div className="engine-bars__track">
                    <span style={{ width: "34.4%" }} />
                  </div>
                  <p className="engine-bars__hint">
                    Pattern-based code analysis &middot; Vulnerability
                  </p>
                </li>
                <li>
                  <div className="engine-bars__label">
                    <span>Dependency checker</span>
                    <span className="engine-bars__n">2</span>
                  </div>
                  <div className="engine-bars__track">
                    <span style={{ width: "6.2%" }} />
                  </div>
                  <p className="engine-bars__hint">
                    CVEs, typosquats and risky installs &middot; Supply chain
                  </p>
                </li>
              </ul>
            </section>

            <section className="console-panel" aria-labelledby="trendTitle">
              <header className="console-panel__head">
                <h3 className="console-panel__title" id="trendTitle">
                  Score over time
                </h3>
              </header>
              <div className="trend-wrap">
                <svg
                  viewBox="0 0 280 150"
                  width="100%"
                  height="150"
                  role="img"
                  aria-label="Overall risk score for each scan of this repository"
                >
                  <line
                    x1="28"
                    y1="25"
                    x2="265"
                    y2="25"
                    stroke="rgba(241,240,232,0.08)"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="28"
                    y1="75"
                    x2="265"
                    y2="75"
                    stroke="rgba(241,240,232,0.08)"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="28"
                    y1="125"
                    x2="265"
                    y2="125"
                    stroke="rgba(241,240,232,0.08)"
                  />
                  <text x="4" y="29" fill="#9fb0a5" fontSize="10" fontFamily="IBM Plex Mono">
                    100
                  </text>
                  <text x="10" y="79" fill="#9fb0a5" fontSize="10" fontFamily="IBM Plex Mono">
                    50
                  </text>
                  <text x="16" y="129" fill="#9fb0a5" fontSize="10" fontFamily="IBM Plex Mono">
                    0
                  </text>
                  <polyline
                    fill="none"
                    stroke="#a3d9b8"
                    strokeWidth="2.5"
                    points="50,62 115,54 185,48 245,49"
                  />
                  <circle cx="50" cy="62" r="4" fill="#a3d9b8" />
                  <circle cx="115" cy="54" r="4" fill="#a3d9b8" />
                  <circle cx="185" cy="48" r="4" fill="#a3d9b8" />
                  <circle cx="245" cy="49" r="5" fill="#e8b84a" />
                </svg>
              </div>
              <p className="console-panel__foot">
                Overall score each time this repository was scanned.
              </p>
            </section>
          </div>

          {/* Interactive Findings Event Log */}
          <section className="console-panel console-panel--events" aria-labelledby="eventsTitle">
            <header className="events-head">
              <div>
                <h3 className="console-panel__title" id="eventsTitle">
                  Findings
                </h3>
                <p className="events-head__hint">
                  Highest severity first. Select a finding to see the code and what it means.
                </p>
              </div>
              <p className="events-count">
                Showing {filteredEvents.length} of {REPORT_201_EVENTS.length} sample findings (67 in
                full report)
              </p>
            </header>

            <div className="events-toolbar" role="search" aria-label="Filter findings">
              <label className="events-search">
                <i className="bi bi-search" aria-hidden="true" />
                <span className="visually-hidden">Search findings</span>
                <input
                  type="search"
                  placeholder="Search description or file…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <div className="seg" role="group" aria-label="Severity">
                <button
                  type="button"
                  className={`seg__btn${sevFilter === "all" ? " is-on" : ""}`}
                  onClick={() => setSevFilter("all")}
                >
                  All <span>67</span>
                </button>
                <button
                  type="button"
                  className={`seg__btn${sevFilter === "high" ? " is-on" : ""}`}
                  onClick={() => setSevFilter("high")}
                >
                  <span className="dot dot--high" />
                  High <span>24</span>
                </button>
                <button
                  type="button"
                  className={`seg__btn${sevFilter === "medium" ? " is-on" : ""}`}
                  onClick={() => setSevFilter("medium")}
                >
                  <span className="dot dot--medium" />
                  Medium <span>12</span>
                </button>
                <button
                  type="button"
                  className={`seg__btn${sevFilter === "low" ? " is-on" : ""}`}
                  onClick={() => setSevFilter("low")}
                >
                  <span className="dot dot--low" />
                  Low <span>31</span>
                </button>
              </div>

              <label className="events-select">
                <span className="visually-hidden">Engine</span>
                <select value={toolFilter} onChange={(e) => setToolFilter(e.target.value)}>
                  <option value="all">All engines (4)</option>
                  <option value="bandit">Bandit (32)</option>
                  <option value="yara">YARA (22)</option>
                  <option value="semgrep">Semgrep (11)</option>
                  <option value="dependency_checker">Dependency checker (2)</option>
                </select>
              </label>

              <button
                type="button"
                className="toggle-chip"
                aria-pressed={hideNoise}
                onClick={() => setHideNoise((prev) => !prev)}
              >
                <i className="bi bi-eye-slash" aria-hidden="true" />
                Hide likely noise <span>(39)</span>
              </button>
            </div>

            <div className="events-cols" aria-hidden="true">
              <span>Severity</span>
              <span>Engine</span>
              <span>Finding</span>
              <span>Location</span>
              <span>Confidence</span>
              <span />
            </div>

            <ol className="event-list">
              {filteredEvents.map((ev) => {
                const isOpen = !!openEventIds[ev.id]
                return (
                  <li
                    key={ev.id}
                    className={`event${ev.isNoise ? " event--noise" : ""}${
                      isOpen ? " is-open" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="event__row"
                      aria-expanded={isOpen}
                      onClick={() => toggleEvent(ev.id)}
                    >
                      <span className="event__sev">
                        <span className={`seal-badge seal-${ev.sev}`}>{ev.sev}</span>
                      </span>
                      <span className="event__tool">{ev.tool}</span>
                      <span className="event__text">{ev.text}</span>
                      <span className="event__loc">{ev.loc}</span>
                      <span className="event__conf">
                        <span className="conf-bar" aria-hidden="true">
                          <i style={{ width: `${ev.conf}%` }} />
                        </span>
                        <span>{ev.conf}%</span>
                      </span>
                      <i className="bi bi-chevron-down event__chev" aria-hidden="true" />
                    </button>

                    {isOpen && (
                      <div className="event__detail">
                        <dl className="event__facts">
                          <div>
                            <dt>Axis</dt>
                            <dd>{ev.axis}</dd>
                          </div>
                          <div>
                            <dt>File</dt>
                            <dd className="mono">{ev.loc}</dd>
                          </div>
                          <div>
                            <dt>Classifier confidence</dt>
                            <dd>
                              {ev.conf}% ({ev.isNoise ? "likely noise" : "likely real"})
                            </dd>
                          </div>
                        </dl>
                        <p className="event__full">{ev.text}</p>
                        <pre className="code-snippet">
                          <code>{ev.snippet}</code>
                        </pre>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        </div>
      </section>

      {/* 4. Exact MalDet #history Section */}
      <section className="section section--white" id="history" aria-labelledby="historyTitle">
        <div className="site-container">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow">Scan history</p>
              <h2 className="section-title" id="historyTitle">
                Recently <em>scanned</em>
              </h2>
              <p className="section-lede mb-0">The ten most recent repositories, newest first.</p>
            </div>

            <a
              href={MALDET_HISTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-parchment btn-pill"
            >
              View all 181 scans <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
            </a>
          </div>

          <div className="ledger-book">
            <div className="table-responsive">
              <table className="table table-ledger table-stack align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Repository</th>
                    <th scope="col">Language</th>
                    <th scope="col">Vulnerability</th>
                    <th scope="col">Malicious pattern</th>
                    <th scope="col">Scanned</th>
                    <th scope="col">
                      <span className="visually-hidden">Report</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SCANS.map((row) => (
                    <tr key={row.id}>
                      <td className="td-full">
                        <span className="repo-name">{row.name}</span>
                        <span className="repo-owner d-block">
                          {row.owner} &middot; <i className="bi bi-star-fill" aria-hidden="true" />{" "}
                          {row.stars}
                        </span>
                      </td>
                      <td className="td-hide-sm">{row.lang}</td>
                      <td data-label="Vulnerability">
                        <span className="axis-cell">
                          <span className={`seal-badge seal-${row.vulnLevel.toLowerCase()}`}>
                            {row.vulnLevel}
                          </span>
                          <span className={`score-${row.vulnLevel.toLowerCase()}`}>
                            {row.vulnScore}
                          </span>
                        </span>
                      </td>
                      <td data-label="Malicious pattern">
                        <span className="axis-cell">
                          <span className={`seal-badge seal-${row.malLevel.toLowerCase()}`}>
                            {row.malLevel}
                          </span>
                          <span className={`score-${row.malLevel.toLowerCase()}`}>
                            {row.malScore}
                          </span>
                        </span>
                      </td>
                      <td className="text-muted text-nowrap td-date">{row.date}</td>
                      <td className="text-end">
                        <a
                          href={`http://103.233.1.97:5000/detail/${row.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-parchment btn-pill row-action"
                          aria-label={`View report for ${row.owner}/${row.name}`}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <ProjectTitlePlate />
    </>
  )
}

/* ============================================================
   PAGE 3: ABOUT US & TEAM (Exact MalDet #about + Live Server Panel + Title Plate)
   ============================================================ */
function AboutPage() {
  return (
    <>
      {/* Exact MalDet #about Section */}
      <section className="section section--paper" id="about" aria-labelledby="aboutTitle">
        <div className="site-container about">
          <div className="about__copy">
            <p className="eyebrow">About us</p>
            <h1 className="section-title" id="aboutTitle">
              Built as a final year project, <em>made to be used.</em>
            </h1>
            <p className="section-lede">
              MalDet is a Final Year Project for the Diploma in Cyber Security Technology at the
              German-Malaysian Institute. It started from a simple question: how can a developer
              tell whether a public repository is safe to pull in without running six security tools
              and reading thousands of alerts?
            </p>
            <p className="section-lede">
              The answer is to combine the tools, filter out the noise, and keep two kinds of risk
              separate, because they need different responses.
            </p>

            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href={MALDET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ribbon btn-pill btn-lg-pill"
              >
                Open MalDet Scanner
              </a>
              <a
                href={MALDET_HISTORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-parchment btn-pill btn-lg-pill"
              >
                Browse Scan History <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="team">
            <div className="team-group">
              <h2 className="team-group__title">Project team</h2>
              <div className="team-grid team-grid--duo">
                <article className="team-card">
                  <div className="team-card__avatar" aria-hidden="true">
                    H
                  </div>
                  <div>
                    <p className="team-card__name">Haikal</p>
                    <p className="team-card__role">Team lead</p>
                    <a
                      className="team-card__link"
                      href="https://github.com/Skidotus"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-github" aria-hidden="true" /> GitHub
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </div>
                </article>

                <article className="team-card">
                  <div className="team-card__avatar" aria-hidden="true">
                    A
                  </div>
                  <div>
                    <p className="team-card__name">Ariff</p>
                    <p className="team-card__role">Team member 1</p>
                  </div>
                </article>

                <article className="team-card">
                  <div className="team-card__avatar" aria-hidden="true">
                    A
                  </div>
                  <div>
                    <p className="team-card__name">Aleena</p>
                    <p className="team-card__role">Team member 2</p>
                  </div>
                </article>

                <article className="team-card">
                  <div className="team-card__avatar" aria-hidden="true">
                    A
                  </div>
                  <div>
                    <p className="team-card__name">Adam</p>
                    <p className="team-card__role">Team member 3</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="team-group">
              <h2 className="team-group__title">Supervisor</h2>
              <div className="team-grid">
                <article className="team-card">
                  <div className="team-card__avatar" aria-hidden="true">
                    L
                  </div>
                  <div>
                    <p className="team-card__name">Sir Luqman</p>
                    <p className="team-card__role">Project supervisor</p>
                  </div>
                </article>
              </div>
            </div>

            <article className="team-card team-card--note">
              <i className="bi bi-mortarboard" aria-hidden="true" />
              <p>
                Diploma in Cyber Security Technology &middot; German-Malaysian Institute &middot;
                2026
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Direct MalDet Server Access Panel (Using MalDet's .scan-panel layout) */}
      <section className="section section--white" aria-labelledby="directAccessTitle">
        <div className="site-container">
          <div className="scan-panel">
            <div className="scan-panel__copy">
              <p className="eyebrow eyebrow--on-dark">Live deployment</p>
              <h2 className="section-title section-title--on-dark" id="directAccessTitle">
                Try MalDet on our server
              </h2>
              <p>
                The full MalDet web application is hosted live for academic evaluation and testing.
                Submit any public GitHub repository or inspect the 181 completed repository reports.
              </p>
              <ul className="scan-panel__points">
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  Live scanner at 103.233.1.97:5000
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  Full SIEM report console &amp; printable summaries
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  181 scanned repositories with 63,496 triaged findings
                </li>
              </ul>
            </div>

            <div className="scan-panel__form">
              <p className="form-label-ledger form-label-ledger--on-dark">Direct links</p>
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
                <a
                  href={MALDET_SCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ribbon btn-pill btn-lg-pill w-100"
                >
                  <i className="bi bi-search me-2" aria-hidden="true" />
                  Start a scan on MalDet
                </a>
                <a
                  href={MALDET_REPORT_201_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-light btn-pill btn-lg-pill w-100"
                >
                  <i className="bi bi-shield-check me-2" aria-hidden="true" />
                  View Report #201 (Skidotus/maldet)
                </a>
                <a
                  href={MALDET_HISTORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-light btn-pill btn-lg-pill w-100"
                >
                  <i className="bi bi-clock-history me-2" aria-hidden="true" />
                  View Full Scan History (181)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectTitlePlate />
    </>
  )
}

/* ============================================================
   ROOT APP SHELL (Exact MalDet Header & Footer)
   ============================================================ */
export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.0,
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
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      setPage(getInitialPage())
      setMobileNavOpen(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const navigateTo = (target: Page) => {
    window.location.hash = `#/${target}`
    setPage(target)
    setMobileNavOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="maldet-root">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Exact MalDet Header */}
      <header className="site-nav">
        <div className="site-container">
          <div className="site-nav__row">
            <button
              type="button"
              className="brand"
              onClick={() => navigateTo("about")}
              aria-label="MalDet home"
            >
              <img src={MALDET_LOGO_SRC} alt="MalDet logo" className="brand__logo" />
              <span className="brand__text">MalDet</span>
            </button>

            <button
              className="nav-toggler"
              type="button"
              aria-controls="navMain"
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation"
              onClick={() => setMobileNavOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>

            <nav
              className={`site-nav__links${mobileNavOpen ? " show" : ""}`}
              id="navMain"
              aria-label="Main"
            >
              <button
                type="button"
                onClick={() => navigateTo("about")}
                className={`site-nav__link${page === "about" ? " is-active" : ""}`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => navigateTo("documentation")}
                className={`site-nav__link${page === "documentation" ? " is-active" : ""}`}
              >
                Tools &amp; UI
              </button>
              <button
                type="button"
                onClick={() => navigateTo("contact")}
                className={`site-nav__link${page === "contact" ? " is-active" : ""}`}
              >
                About
              </button>
              <a
                className="btn btn-ribbon btn-pill site-nav__cta"
                href={MALDET_SCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a scan
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main">
        {page === "about" && <OverviewPage onNavigate={navigateTo} />}
        {page === "documentation" && <HowItWorksPage />}
        {page === "contact" && <AboutPage />}
      </main>

      {/* Exact MalDet Footer */}
      <footer className="site-footer">
        <div className="site-container">
          <div className="site-footer__panel">
            <div className="site-footer__grid">
              <div className="site-footer__brand">
                <button
                  type="button"
                  className="brand"
                  onClick={() => navigateTo("about")}
                >
                  <img src={MALDET_LOGO_SRC} alt="MalDet logo" className="brand__logo" />
                  <span className="brand__text">MalDet</span>
                </button>
                <p>
                  Static analysis and supply-chain risk scanning for public GitHub repositories,
                  before you clone, install or depend on them.
                </p>
              </div>
              <div>
                <h2 className="site-footer__heading">Project</h2>
                <ul className="site-footer__list">
                  <li>
                    <button type="button" onClick={() => navigateTo("about")}>
                      Overview
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => navigateTo("documentation")}>
                      Detection engines &amp; UI
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => navigateTo("contact")}>
                      About us
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="site-footer__heading">Scanner</h2>
                <ul className="site-footer__list">
                  <li>
                    <a href={MALDET_SCAN_URL} target="_blank" rel="noopener noreferrer">
                      Start a scan
                    </a>
                  </li>
                  <li>
                    <a href={`${MALDET_URL}#history`} target="_blank" rel="noopener noreferrer">
                      Recent scans
                    </a>
                  </li>
                  <li>
                    <a href={MALDET_HISTORY_URL} target="_blank" rel="noopener noreferrer">
                      Full history
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="site-footer__base">
              <span>
                &copy; 2026 MalDet &middot; Final Year Project, Diploma in Cyber Security
                Technology, German-Malaysian Institute
              </span>
              <span>For academic use only</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
