import { type FormEvent, useEffect, useRef, useState } from "react"
import Lenis from "lenis"

const MALDET_URL = "http://103.233.1.97:5000/"

type Page = "about" | "documentation" | "contact"
type FormField = "name" | "email" | "subject" | "message"

type NavigationItem = {
  id: Page
  label: string
}

const navigation: NavigationItem[] = [
  { id: "about", label: "Overview" },
  { id: "documentation", label: "How It Works & Tools" },
  { id: "contact", label: "About Us & Team" },
]

const problemCards = [
  {
    number: "01",
    title: "Blind Trust in Public Repositories",
    description:
      "Developers clone, install, and depend on public GitHub repositories every day without inspecting the source code. Attackers exploit this by hiding malware inside packages, compressed archives, and install-time hooks.",
  },
  {
    number: "02",
    title: "Fragmented Tools & Alert Fatigue",
    description:
      "Running six different static and supply-chain scanners manually requires reconciling incompatible output formats and wading through tens of thousands of unprioritized, noisy alerts.",
  },
  {
    number: "03",
    title: "Conflating Bugs with Deliberate Malware",
    description:
      "Traditional scanners lump accidental coding vulnerabilities together with deliberate backdoors and supply-chain attacks—even though a careless bug and an active trojan demand completely different responses.",
  },
]

const solutions = [
  {
    number: "01",
    title: "Six-Engine Static & Supply-Chain Orchestration",
    description:
      "Automatically clones public repositories, unpacks nested and password-protected archives, and runs Bandit, Semgrep, pip-audit, YARA, ClamAV, GuardDog, and a custom Dependency Checker without executing untrusted code.",
  },
  {
    number: "02",
    title: "ML-Powered Noise Triage (Random Forest)",
    description:
      "A trained Random Forest risk classifier evaluates every raw finding and assigns a confidence probability that the alert is genuine—weighting real threats heavily while filtering out false-positive noise.",
  },
  {
    number: "03",
    title: "Dual-Axis Verdicts & Plain-English Insight",
    description:
      "Separates security risk into two clear verdicts—Vulnerability and Malicious Pattern (scored Safe to Critical)—paired with a local LLM summary that explains the top findings in plain English without altering the deterministic score.",
  },
]

const workflow = [
  {
    number: "01",
    title: "Fetch & Unpack",
    description:
      "Retrieves repository metadata via the GitHub API, performs a shallow clone, and extracts nested archives (including password-protected samples).",
  },
  {
    number: "02",
    title: "Multi-Engine Detect",
    description:
      "Six specialized open-source engines plus our custom dependency checker inspect source code, binaries, and dependency manifests in parallel.",
  },
  {
    number: "03",
    title: "Random Forest Triage",
    description:
      "Our machine-learning classifier rates each finding's likelihood of being a real issue versus scanner noise, weighting the severity impact.",
  },
  {
    number: "04",
    title: "Dual Verdict & Score",
    description:
      "Computes separate Vulnerability and Malicious-Pattern risk scores (Safe to Critical), generates a plain-English summary, and logs to scan history.",
  },
]

const detectionTools = [
  {
    code: "PY",
    name: "Bandit",
    axis: "Vulnerability",
    axisType: "vulnerability",
    description:
      "Finds common security mistakes in Python code, such as shell injection, unsafe deserialization, and hard-coded passwords.",
  },
  {
    code: "SG",
    name: "Semgrep",
    axis: "Vulnerability",
    axisType: "vulnerability",
    description:
      "Pattern-based static code analysis across many programming languages, powered by community security rulesets.",
  },
  {
    code: "PA",
    name: "pip-audit",
    axis: "Vulnerability",
    axisType: "vulnerability",
    description:
      "Checks pinned Python dependencies against known CVE advisories without installing or building any package code.",
  },
  {
    code: "YR",
    name: "YARA",
    axis: "Malicious pattern",
    axisType: "malicious",
    description:
      "Matches repository files against signature rules for known malware families, droppers, and obfuscated payloads.",
  },
  {
    code: "AV",
    name: "ClamAV",
    axis: "Malicious pattern",
    axisType: "malicious",
    description:
      "Open-source antivirus engine that scans every file in the repository, including files inside extracted archives.",
  },
  {
    code: "GD",
    name: "GuardDog",
    axis: "Malicious pattern",
    axisType: "malicious",
    description:
      "Detects supply-chain attack behavior such as data exfiltration, malicious setup.py install hooks, and suspicious downloads.",
  },
  {
    code: "DC",
    name: "Dependency Checker",
    axis: "Malicious pattern",
    axisType: "malicious",
    description:
      "Built specifically for MalDet. Flags typosquatted package names, direct-URL installs, and unpinned dependency versions.",
  },
  {
    code: "ML",
    name: "Risk Classifier",
    axis: "ML Triage",
    axisType: "triage",
    description:
      "Built for MalDet. A Random Forest model trained on real scan data that rates each finding's likelihood of being real.",
  },
]

const interfaceData = [
  {
    type: "scanner" as const,
    eyebrow: "01 · Repository ingestion interface",
    title: "One-Click Repository Scanner",
    description:
      "Designed for zero-configuration scanning. Paste any public GitHub URL or owner/repo shorthand, configure optional archive passwords, and launch a full sandboxed static analysis.",
    features: [
      [
        "Instant URL Validation",
        "Client and server-side validation catches malformed GitHub URLs before queuing a scan job.",
      ],
      [
        "Password-Protected Archive Support",
        "Automatically extracts .zip, .7z, and .rar archives using configurable passwords (defaulting to 'infected').",
      ],
      [
        "Safe Non-Execution Guarantee",
        "Repositories are shallow-cloned and statically analyzed—untrusted code is never executed on the host.",
      ],
      [
        "Asynchronous Queue Processing",
        "Scans run reliably on the server so users can close the tab and return anytime to view the completed report.",
      ],
    ],
  },
  {
    type: "console" as const,
    eyebrow: "02 · Dual-verdict report console",
    title: "Interactive Triage & Verdict Console",
    description:
      "Replaces overwhelming raw terminal dumps with a structured ledger console showing separated risk scores, ML noise breakdown, plain-English explanations, and filterable findings.",
    features: [
      [
        "Separated Dual-Axis Risk Gauges",
        "Displays distinct 5-tier badges (Safe, Low, Medium, High, Critical) and numeric scores for Vulnerability vs. Malicious Pattern.",
      ],
      [
        "ML Confidence Breakdown Bar",
        "Visualizes how many findings the Random Forest classifier rated as Likely Real, Uncertain, or Likely Noise.",
      ],
      [
        "Plain-English Local LLM Summary",
        "Summarizes the highest-confidence alerts in a concise paragraph while keeping risk scoring strictly deterministic.",
      ],
      [
        "Filterable Findings Log & Trend Chart",
        "Filter thousands of alerts by severity, engine, or noise toggle, and track risk score changes across rescans.",
      ],
    ],
  },
  {
    type: "history" as const,
    eyebrow: "03 · Audit ledger & comparison",
    title: "Scan History & Verdict Ledger",
    description:
      "Every repository scan is archived in a searchable ledger book, enabling developers and security teams to audit past verdicts and compare repositories over time.",
    features: [
      [
        "181+ Repositories Indexed",
        "Browse historical scans with language tags, GitHub star counts, and side-by-side dual-axis verdict seals.",
      ],
      [
        "One-Click Rescan & Version Tracking",
        "Trigger a fresh scan on any previously analyzed repository to verify if vulnerabilities were patched.",
      ],
      [
        "Exportable Full Reports",
        "Open dedicated printable report views for academic review, compliance documentation, or team sharing.",
      ],
      [
        "Verdict Distribution Analytics",
        "Tracks overall repository health across Safe, Low, Medium, High, and Critical risk tiers.",
      ],
    ],
  },
]

const team = [
  {
    initials: "SL",
    name: "Sir Luqman",
    role: "Project Supervisor",
    blurb: "Academic advisor guiding project methodology, cybersecurity architecture, and evaluation.",
    supervisor: true,
  },
  {
    initials: "HK",
    name: "Haikal",
    role: "Team Lead & Core System Architect",
    blurb: "Lead developer overseeing scanner orchestration, ML pipeline integration, and full-stack architecture.",
    github: "https://github.com/Skidotus",
  },
  {
    initials: "AR",
    name: "Ariff",
    role: "Project Team Member · Security & Detection Engines",
    blurb: "Responsible for static analysis tool integration, rule tuning, and vulnerability scoring.",
  },
  {
    initials: "AL",
    name: "Aleena",
    role: "Project Team Member · AI Classifier & Data Triage",
    blurb: "Focused on dataset preparation, Random Forest model training, and false-positive noise reduction.",
  },
  {
    initials: "AD",
    name: "Adam",
    role: "Project Team Member · Web Interface & Reporting",
    blurb: "Designed the forest-and-paper ledger interface, interactive report console, and scan history views.",
  },
]

const marqueeItems = [
  "AI-Driven Malware Detection",
  "GitHub Trust Scoring",
  "6 Detection Engines",
  "Random Forest Triage",
  "Vulnerability Verdict",
  "Malicious Pattern Verdict",
  "Supply-Chain Security",
  "Plain-English LLM Summary",
]

const stats = [
  { value: 181, suffix: "+", label: "Repositories Scanned" },
  { value: 63496, suffix: "", label: "Findings Analysed" },
  { value: 6, suffix: "", label: "Detection Engines" },
  { value: 2, suffix: "", label: "Clear Risk Verdicts" },
]

const useReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"
    const stored = window.localStorage.getItem("maldet-theme")
    if (stored === "light" || stored === "dark") return stored
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("maldet-theme", theme)
  }, [theme])

  const toggleTheme = (event?: React.MouseEvent) => {
    const next = theme === "light" ? "dark" : "light"
    const root = document.documentElement
    type Doc = Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>
      }
    }
    const doc = document as Doc
    const applyTheme = () => {
      setTheme(next)
      root.dataset.theme = next
      window.localStorage.setItem("maldet-theme", next)
    }
    if (!doc.startViewTransition || useReducedMotion()) {
      root.classList.add("theme-transition")
      applyTheme()
      window.setTimeout(() => root.classList.remove("theme-transition"), 350)
      return
    }
    const x = event?.clientX ?? window.innerWidth - 48
    const y = event?.clientY ?? 48
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    const transition = doc.startViewTransition(applyTheme)
    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        )
      })
      .catch(() => {})
  }

  return { theme, toggleTheme }
}

function ThemeToggle({
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

function useLenis() {
  useEffect(() => {
    if (useReducedMotion()) return
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    })
    ;(window as any).__lenis = lenis
    let frame: number
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      ;(window as any).__lenis = undefined
    }
  }, [])
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  )
}

function MagneticButton({
  children,
  onClick,
  href,
  variant = "primary",
  type = "button",
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "light"
  type?: "button" | "submit"
  disabled?: boolean
}) {
  const ref = useRef<HTMLElement>(null)

  const handleMove = (event: React.MouseEvent) => {
    const el = ref.current
    if (!el || useReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ""
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={`action-button action-button-${variant}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
        <span className="button-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={`action-button action-button-${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      <span className="button-arrow" aria-hidden="true">
        →
      </span>
    </button>
  )
}

function TiltCard({
  children,
  className = "",
  delay = 0,
  glare = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: React.MouseEvent) => {
    const el = ref.current
    if (!el || useReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rotateX = (py - 0.5) * -7
    const rotateY = (px - 0.5) * 7
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
    el.style.setProperty("--glare-x", `${px * 100}%`)
    el.style.setProperty("--glare-y", `${py * 100}%`)
    el.classList.add("tilt-active")
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ""
    el.classList.remove("tilt-active")
  }

  return (
    <div
      ref={ref}
      className={`reveal tilt-card ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  )
}

function CountUpStat({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (useReducedMotion()) {
      setDisplay(value)
      return
    }
    let observer: IntersectionObserver | undefined
    let frame: number
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          observer?.disconnect()
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(eased * value))
            if (t < 1) frame = requestAnimationFrame(tick)
          }
          frame = requestAnimationFrame(tick)
        },
        { threshold: 0.4 },
      )
      observer.observe(el)
    } catch {
      setDisplay(value)
    }
    return () => {
      observer?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-value">
        {display.toLocaleString()}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function MarqueeBand() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            {item}
            <i>◆</i>
          </span>
        ))}
      </div>
    </div>
  )
}

function useHeroSpotlight() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section || useReducedMotion()) return
    const onMove = (event: MouseEvent) => {
      section.style.setProperty("--spotlight-x", `${event.clientX}px`)
      section.style.setProperty("--spotlight-y", `${event.clientY}px`)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return ref
}

function Brand() {
  return (
    <span className="maldet-brand">
      <span className="maldet-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="22" height="22">
          <path
            d="M16 3.5l10 3.7V15c0 6.3-4.3 11.1-10 12.9C10.3 26.1 6 21.3 6 15V7.2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle
            cx="16"
            cy="14.5"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <path
            d="M19 17.5l3 3"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span>MalDet</span>
      <span className="maldet-brand-badge">Scanner</span>
    </span>
  )
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  href,
  variant = "primary",
  type = "button",
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "light"
  type?: "button" | "submit"
  disabled?: boolean
}) {
  if (href) {
    return (
      <a
        className={`action-button action-button-${variant}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <span className="button-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    )
  }

  return (
    <button
      className={`action-button action-button-${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <span className="button-arrow" aria-hidden="true">
        →
      </span>
    </button>
  )
}

function Header({
  page,
  onNavigate,
  theme,
  onToggleTheme,
}: {
  page: Page
  onNavigate: (page: Page) => void
  theme: "light" | "dark"
  onToggleTheme: (event: React.MouseEvent) => void
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [page])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        document.querySelector<HTMLButtonElement>(".menu-button")?.focus()
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open])

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <button
          className="brand-button"
          type="button"
          onClick={() => onNavigate("about")}
          aria-label="MalDet home"
        >
          <Brand />
        </button>
        <div
          id="primary-menu"
          className={`nav-links ${open ? "nav-links-open" : ""}`}
        >
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${
                page === item.id ? "nav-link-active" : ""
              }`}
              type="button"
              onClick={() => {
                onNavigate(item.id)
                setOpen(false)
              }}
              aria-current={page === item.id ? "page" : undefined}
            >
              <span className="nav-link-text">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="header-actions">
          <a
            href={MALDET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta-link"
            aria-label="Open live MalDet web scanner in a new tab"
          >
            <span className="header-cta-dot" aria-hidden="true" />
            <span>Open MalDet</span>
            <span className="header-cta-label-full">Scanner</span>
            <span aria-hidden="true">↗</span>
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="primary-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  )
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="site-footer">
      <div className="content-shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>
            Development of an AI-Driven Malware Detection and Trust Scoring
            System for GitHub Repositories. Static analysis and supply-chain
            risk scanning before you clone, install, or depend on public code.
          </p>
          <span className="academic-label">
            Diploma in Cyber Security Technology · German-Malaysian Institute · 2026
          </span>
        </div>
        <div className="footer-navigation">
          <p className="footer-title">Commercial Showcase</p>
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
          <a
            href={MALDET_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#a3d9b8",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.25rem 0",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            Launch Live MalDet App ↗
          </a>
          <a
            href={`${MALDET_URL}history`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(241, 240, 232, 0.8)",
              textDecoration: "none",
              padding: "0.25rem 0",
            }}
          >
            Live Scan History ↗
          </a>
        </div>
      </div>
      <div className="content-shell footer-bottom">
        <p>© {new Date().getFullYear()} MalDet. Final Year Project Commercial Showcase.</p>
        <p>Live Scanner: {MALDET_URL}</p>
      </div>
    </footer>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "center",
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  light?: boolean
  align?: "center" | "left"
}) {
  return (
    <div
      className={`section-heading section-heading-${align} ${
        light ? "section-heading-light" : ""
      }`}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}

function LevelScale({ active }: { active: "safe" | "low" | "medium" | "high" | "critical" }) {
  const steps: Array<"safe" | "low" | "medium" | "high" | "critical"> = [
    "safe",
    "low",
    "medium",
    "high",
    "critical",
  ]
  return (
    <span className="maldet-level-scale" role="img" aria-label={`Risk level: ${active}`}>
      {steps.map((step) => (
        <span
          key={step}
          className={`maldet-level-step maldet-level-step-${step} ${
            step === active ? "is-on" : ""
          }`}
        />
      ))}
    </span>
  )
}

function HeroVerdictPreviewCard() {
  return (
    <div className="maldet-hero-card" role="region" aria-label="Live MalDet scan report preview">
      <div className="maldet-hero-card-bar">
        <span className="maldet-hero-card-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <strong style={{ color: "var(--color-text)" }}>Latest Live Scan</strong>
        <span style={{ marginLeft: "auto" }}>Report #201 · 25 Oct 2026</span>
      </div>
      <div className="maldet-hero-card-body">
        <div className="maldet-repo-header">
          <div>
            <span className="maldet-repo-owner">github.com / Skidotus /</span>
            <h3 className="maldet-repo-title">maldet</h3>
          </div>
          <span className="maldet-brand-badge">Python · 6 Engines</span>
        </div>

        <div className="maldet-axes-grid">
          <div className="maldet-axis-box">
            <div className="maldet-axis-head">
              <span>Vulnerability</span>
              <span className="maldet-seal maldet-seal-medium">Medium</span>
            </div>
            <div className="maldet-axis-score">
              76<small>risk score</small>
            </div>
            <LevelScale active="medium" />
          </div>

          <div className="maldet-axis-box">
            <div className="maldet-axis-head">
              <span>Malicious pattern</span>
              <span className="maldet-seal maldet-seal-medium">Medium</span>
            </div>
            <div className="maldet-axis-score">
              17<small>risk score</small>
            </div>
            <LevelScale active="medium" />
          </div>
        </div>

        <div className="maldet-triage-strip">
          <div className="maldet-triage-head">
            <span>Random Forest Classifier (67 findings)</span>
            <span>16 Real · 12 Unsure · 39 Noise</span>
          </div>
          <div className="maldet-stack-bar" aria-hidden="true">
            <span className="maldet-stack-real" style={{ width: "24%" }} />
            <span className="maldet-stack-unsure" style={{ width: "18%" }} />
            <span className="maldet-stack-noise" style={{ width: "58%" }} />
          </div>
        </div>

        <div className="maldet-card-footer">
          <span style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            Bandit · Semgrep · YARA · ClamAV · GuardDog
          </span>
          <a href={`${MALDET_URL}detail/201`} target="_blank" rel="noopener noreferrer">
            Open live report ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function AboutPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const heroRef = useHeroSpotlight()

  return (
    <main className="page page-about">
      <section className="hero-section" ref={heroRef}>
        <div className="hero-grid-pattern" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-particles" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="content-shell hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              AI-Driven Malware Detection & Trust Scoring System
            </p>
            <h1>
              Know what a repository hides <em>before you run it.</em>
            </h1>
            <p className="hero-tagline">
              One Scan · Six Detection Engines · Two Clear Verdicts
            </p>
            <p className="hero-description">
              MalDet scans public GitHub repositories with six specialized
              detection engines, filters real issues from scanner noise using a
              Random Forest machine-learning classifier, and gives you two
              actionable verdicts: is the code <strong>vulnerable</strong>, and
              does it look <strong>malicious</strong>?
            </p>
            <div className="hero-actions">
              <MagneticButton href={MALDET_URL}>
                Launch MalDet Scanner
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                onClick={() => onNavigate("documentation")}
              >
                How It Works & Tools
              </MagneticButton>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-caption">
              <span className="status-dot" />
              Live Scanner Telemetry · {MALDET_URL}
            </div>
            <HeroVerdictPreviewCard />
          </div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <span />
          Scroll to explore
        </div>
      </section>

      <MarqueeBand />

      <section className="stats-section">
        <div className="content-shell stats-grid">
          {stats.map((stat) => (
            <CountUpStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      <section className="overview-section section-pad">
        <div className="content-shell overview-layout">
          <Reveal className="overview-copy">
            <SectionHeading
              eyebrow="Project overview"
              title={
                <>
                  A second opinion for <em>code you didn't write.</em>
                </>
              }
              align="left"
            />
            <p className="body-copy">
              Open-source software powers modern development, but pulling an
              unverified GitHub repository into your environment introduces
              both accidental security vulnerabilities and intentional
              supply-chain malware. MalDet automates multi-engine static
              inspection and machine-learning triage so developers can verify
              repository trustworthiness before cloning or installing.
            </p>
            <div className="trust-note">
              <span className="trust-icon" aria-hidden="true">
                ✓
              </span>
              <p>
                Zero-execution safety: MalDet inspects code, archives, and
                dependencies statically without running untrusted repository
                scripts.
              </p>
            </div>
          </Reveal>
          <Reveal className="process-visual" delay={100}>
            {["Fetch & Unpack", "6-Engine Scan", "ML Triage", "Dual Verdict"].map(
              (label, index) => (
                <div className="mini-step" key={label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{label}</p>
                  {index < 3 && <i aria-hidden="true">→</i>}
                </div>
              ),
            )}
          </Reveal>
        </div>
      </section>

      <section className="problem-section section-pad">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Why MalDet is needed"
              title={
                <>
                  The <em>Problem</em>
                </>
              }
              description="Modern software supply chains face growing threats from trojanized repositories, while developers struggle with fragmented security tooling."
              light
            />
          </Reveal>
          <div className="card-grid">
            {problemCards.map((card, index) => (
              <TiltCard
                className="feature-card feature-card-dark"
                delay={index * 80}
                key={card.title}
              >
                <span className="card-number">{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="objectives-section section-pad">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Our architecture & objectives"
              title={
                <>
                  The MalDet <em>Solution</em>
                </>
              }
              description="How MalDet transforms noisy multi-scanner output into clear, separated trust verdicts."
            />
          </Reveal>
          <div className="card-grid objectives-grid">
            {solutions.map((solution, index) => (
              <TiltCard
                className="feature-card objective-card"
                delay={index * 80}
                key={solution.title}
              >
                <div className="objective-icon" aria-hidden="true">
                  {solution.number}
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section section-pad">
        <Reveal className="content-shell closing-panel">
          <div>
            <p className="eyebrow">Ready to test a repository?</p>
            <h2>
              Scan any public GitHub repository <em>live right now.</em>
            </h2>
            <p>
              Paste a GitHub link into the live MalDet platform or explore how
              our six detection engines and Random Forest classifier work under
              the hood.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            <MagneticButton variant="light" href={MALDET_URL}>
              Open MalDet Website
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              onClick={() => onNavigate("documentation")}
            >
              Explore How It Works
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

function Workflow() {
  return (
    <div className="workflow-grid">
      {workflow.map((step, index) => (
        <Reveal className="workflow-step" delay={index * 70} key={step.title}>
          <div className="workflow-number">{step.number}</div>
          <div className="workflow-icon" aria-hidden="true">
            <span />
            <span />
          </div>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
          {index < workflow.length - 1 && (
            <div className="workflow-connector" aria-hidden="true">
              <i />
            </div>
          )}
        </Reveal>
      ))}
    </div>
  )
}

type TopologyViewMode = "physical" | "logical"

interface TopologyNodeSpec {
  id: string
  type: "monitor" | "switch" | "server" | "user"
  label: string
  role: string
  ip: string
  protocol: string
  detail: string
  documentation: string
}

const topologyNodes: TopologyNodeSpec[] = [
  {
    id: "pc",
    type: "monitor",
    label: "GitHub Repository Target",
    role: "Public source & archive ingestion",
    ip: "api.github.com",
    protocol: "HTTPS · Shallow Clone",
    detail: "Fetches metadata & extracts .zip/.7z/.rar",
    documentation:
      "MalDet connects to the public GitHub API to retrieve repository metadata (stars, primary language, owner) and performs a shallow clone into an isolated workspace. Nested archives—including password-protected malware samples—are safely unpacked before inspection.",
  },
  {
    id: "switch",
    type: "switch",
    label: "MalDet Orchestrator",
    role: "6-Engine Static Analysis Core",
    ip: "103.233.1.97:5000",
    protocol: "Gunicorn · Multi-Engine Pipeline",
    detail: "Bandit, Semgrep, pip-audit, YARA, ClamAV, GuardDog",
    documentation:
      "The central MalDet scanning controller coordinates six open-source detection engines alongside our custom Dependency Checker. It normalizes heterogeneous JSON and text outputs into a unified finding schema without executing any code from the target repository.",
  },
  {
    id: "server",
    type: "server",
    label: "Random Forest Classifier",
    role: "ML Noise Triage & Confidence Scoring",
    ip: "ML Triage Engine",
    protocol: "Scikit-Learn · Confidence Weighting",
    detail: "Rates findings as Likely Real, Uncertain, or Noise",
    documentation:
      "Six engines on a large repository can generate thousands of raw alerts. Our trained Random Forest model evaluates each finding's features and assigns a probability confidence score—ensuring high-confidence threats drive the verdict while likely noise is down-weighted.",
  },
  {
    id: "user1",
    type: "user",
    label: "Dual-Axis Trust Scorer",
    role: "Vulnerability & Malicious Verdicts",
    ip: "Verdict Engine",
    protocol: "5-Tier Scale (Safe → Critical)",
    detail: "Separates coding bugs from deliberate malware",
    documentation:
      "Computes two independent risk scores: the Vulnerability verdict (from Bandit, Semgrep, and pip-audit) and the Malicious-Pattern verdict (from YARA, ClamAV, GuardDog, and the Dependency Checker). Each axis receives a clear seal from Safe to Critical.",
  },
  {
    id: "user2",
    type: "user",
    label: "Local LLM & Web Console",
    role: "Plain-English Summary & Ledger",
    ip: "Web UI & History",
    protocol: "Deterministic Guardrails · SQLite/Ledger",
    detail: "Explains findings & stores historical reports",
    documentation:
      "A local language model translates technical findings into a concise plain-English paragraph for rapid review. By design, risk levels are locked before the LLM runs so it can never hallucinate or alter a verdict. Results are saved to the persistent scan history.",
  },
]

interface TopologyEdgeSpec {
  id: string
  from: string
  to: string
  d: string
  label: string
  duration: number
}

const topologyEdges: TopologyEdgeSpec[] = [
  { id: "pc-switch", from: "pc", to: "switch", d: "M 500 108 L 500 212", label: "Clone", duration: 2.2 },
  { id: "switch-server", from: "switch", to: "server", d: "M 500 280 L 500 320 L 212 320 L 212 360", label: "Findings", duration: 2.6 },
  { id: "switch-user1", from: "switch", to: "user1", d: "M 500 280 L 500 360", label: "Weights", duration: 2.0 },
  { id: "switch-user2", from: "switch", to: "user2", d: "M 500 280 L 500 320 L 788 320 L 788 360", label: "Report", duration: 2.8 },
]

const viewModeLabels: Record<TopologyViewMode, string> = {
  physical: "Architecture Flow",
  logical: "Triage Pipeline",
}

const edgeLabelPositions: Record<string, { x: number; y: number }> = {
  "pc-switch": { x: 514, y: 165 },
  "switch-server": { x: 330, y: 313 },
  "switch-user1": { x: 514, y: 330 },
  "switch-user2": { x: 650, y: 313 },
}

function TopologyNodeButton({
  node,
  tipOpen,
  onHover,
  onOpen,
  orientation = "vertical",
}: {
  node: TopologyNodeSpec
  tipOpen: boolean
  onHover: (id: string | null) => void
  onOpen: (id: string) => void
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <button
      type="button"
      className={`topo-node topo-node-${orientation} network-device network-device-${node.type}`}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={() => onOpen(node.id)}
      aria-haspopup="dialog"
      aria-describedby={tipOpen ? `tip-${node.id}` : undefined}
    >
      <span className={`topo-node-icon topo-icon-${node.type}`} aria-hidden="true">
        {node.type === "monitor" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 14.5z" />
            <path d="M9 20h6M12 16.5V20" />
            <path d="M7 8.5l2.5 2.5L7 13.5" />
          </svg>
        )}
        {node.type === "switch" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="3" y="7" width="18" height="10" rx="1.5" />
            <path d="M6.5 10.5v3M10 10.5v3M13.5 10.5v3M17 10.5v3" />
          </svg>
        )}
        {node.type === "server" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="4" y="3.5" width="16" height="7" rx="1.5" />
            <rect x="4" y="13.5" width="16" height="7" rx="1.5" />
            <path d="M7.5 7h.01M7.5 17h.01M11 7h6M11 17h6" />
          </svg>
        )}
        {node.type === "user" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="4" y="4" width="16" height="11" rx="1.5" />
            <path d="M2.5 19h19M12 15v4" />
          </svg>
        )}
      </span>
      <span className="topo-node-meta">
        <strong>{node.label}</strong>
        <span>{node.ip}</span>
      </span>
      <span className="topo-tip" id={`tip-${node.id}`} role="tooltip" data-open={tipOpen}>
        <strong>{node.label}</strong>
        <span>{node.ip} · {node.protocol}</span>
        <span className="topo-tip-role">{node.role}</span>
        <em>Click for architecture details</em>
      </span>
    </button>
  )
}

function Topology() {
  const [mode, setMode] = useState<TopologyViewMode>("physical")
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [hoverTip, setHoverTip] = useState<string | null>(null)

  const activeSpec = topologyNodes.find((n) => n.id === activeNode) ?? null
  const nodeSpec = (id: string) => topologyNodes.find((n) => n.id === id)!

  return (
    <div className="topology-wrap topo-mode-logical">
      <div className="topo-mode-toggle" role="tablist" aria-label="Architecture view mode">
        {(Object.keys(viewModeLabels) as TopologyViewMode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            className={`topo-tab ${mode === m ? "topo-tab-active" : ""}`}
            type="button"
            onClick={() => setMode(m)}
          >
            {viewModeLabels[m]}
          </button>
        ))}
      </div>

      <div
        className="logical-topology"
        role="img"
        aria-label="MalDet scanning architecture: GitHub repository target feeds into the MalDet Orchestrator, which coordinates the Random Forest Classifier, Dual-Axis Trust Scorer, and Local LLM & Web Console"
      >
        <svg className="logical-edges" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <radialGradient id="topo-particle" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="var(--color-primary)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {topologyEdges.map((edge) => {
            const mid = edgeLabelPositions[edge.id]
            return (
              <g key={edge.id}>
                <path d={edge.d} className="topo-edge-track" />
                <path
                  d={edge.d}
                  className="topo-edge-flow"
                  style={{ animationDuration: `${edge.duration}s` }}
                />
                {mid && (
                  <text x={mid.x} y={mid.y} className="topo-edge-label">
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}
          <g className="topo-particle-group" aria-hidden="true">
            {topologyEdges.map((edge) => (
              <circle key={`p-${edge.id}`} r="5" fill="url(#topo-particle)">
                <animateMotion dur={`${edge.duration}s`} repeatCount="indefinite" path={edge.d} />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.08;0.92;1"
                  dur={`${edge.duration}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        </svg>

        <div className="logical-node logical-node-pc">
          <TopologyNodeButton
            node={nodeSpec("pc")}
            tipOpen={hoverTip === "pc"}
            onHover={setHoverTip}
            onOpen={setActiveNode}
            orientation="horizontal"
          />
        </div>

        <div className="logical-lan">
          <span className="logical-lan-label">MalDet Sandbox & Scoring Engine</span>

          <div className="logical-node logical-node-switch">
            <TopologyNodeButton
              node={nodeSpec("switch")}
              tipOpen={hoverTip === "switch"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
              orientation="horizontal"
            />
          </div>

          <div className="logical-grid">
            <TopologyNodeButton
              node={nodeSpec("server")}
              tipOpen={hoverTip === "server"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
            />
            <TopologyNodeButton
              node={nodeSpec("user1")}
              tipOpen={hoverTip === "user1"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
            />
            <TopologyNodeButton
              node={nodeSpec("user2")}
              tipOpen={hoverTip === "user2"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
            />
          </div>
        </div>
      </div>

      <div
        className={`topo-drawer ${activeSpec ? "topo-drawer-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={activeSpec ? `${activeSpec.label} details` : undefined}
        hidden={!activeSpec}
      >
        {activeSpec && (
          <>
            <button
              className="topo-drawer-close"
              type="button"
              aria-label="Close details"
              onClick={() => setActiveNode(null)}
            >
              ✕
            </button>
            <p className="eyebrow">{activeSpec.role}</p>
            <h3>{activeSpec.label}</h3>
            <dl className="topo-spec-list">
              <div>
                <dt>Endpoint / Component</dt>
                <dd>{activeSpec.ip}</dd>
              </div>
              <div>
                <dt>Technology</dt>
                <dd>{activeSpec.protocol}</dd>
              </div>
              <div>
                <dt>Function</dt>
                <dd>{activeSpec.detail}</dd>
              </div>
            </dl>
            <p className="topo-drawer-doc">{activeSpec.documentation}</p>
          </>
        )}
      </div>
      {activeSpec && (
        <button
          className="topo-drawer-backdrop"
          type="button"
          aria-label="Close details"
          onClick={() => setActiveNode(null)}
        />
      )}
    </div>
  )
}

function InterfacePreview({ data }: { data: typeof interfaceData[number] }) {
  return (
    <div className="browser-frame" aria-label={`${data.title} interactive mockup`}>
      <div className="browser-toolbar" aria-hidden="true">
        <span />
        <span />
        <span />
        <div className="browser-url">
          {MALDET_URL}
          {data.type === "scanner"
            ? "#scan"
            : data.type === "console"
              ? "detail/201"
              : "history"}
        </div>
      </div>

      {data.type === "scanner" && (
        <div className="ui-mockup-canvas ui-mockup-dark">
          <div>
            <span className="maldet-brand-badge" style={{ background: "rgba(163, 217, 184, 0.15)", color: "#a3d9b8", borderColor: "rgba(163, 217, 184, 0.3)" }}>
              Start here · Public GitHub Scanner
            </span>
            <h4 className="maldet-serif" style={{ fontSize: "1.45rem", margin: "0.65rem 0 0.35rem", color: "#f1f0e8" }}>
              Scan a repository
            </h4>
            <p style={{ margin: 0, color: "#a8b8ad", fontSize: "0.82rem" }}>
              Nothing from the repository is executed. Password-protected .zip, .7z, and .rar archives are unpacked automatically.
            </p>
          </div>

          <div style={{ display: "grid", gap: "0.65rem", background: "rgba(255,255,255,0.04)", padding: "1rem", borderRadius: "0.85rem", border: "1px solid rgba(241,240,232,0.12)" }}>
            <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "#f1f0e8" }}>
              Repository URL
            </div>
            <div className="ui-mockup-urlbar">
              <span style={{ color: "#a3d9b8" }}>⌘</span>
              <span>https://github.com/Skidotus/maldet</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: "#a8b8ad" }}>
              <span>Archive password: <code style={{ color: "#a3d9b8" }}>infected</code></span>
              <span>6 Engines Ready</span>
            </div>
            <a
              href={`${MALDET_URL}#scan`}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-mockup-btn"
              style={{ textDecoration: "none" }}
            >
              Run scan on live server ↗
            </a>
          </div>
        </div>
      )}

      {data.type === "console" && (
        <div className="ui-mockup-canvas">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                SCAN REPORT #201
              </span>
              <h4 className="maldet-serif" style={{ margin: 0, fontSize: "1.25rem" }}>
                Skidotus / <strong>maldet</strong>
              </h4>
            </div>
            <span className="maldet-seal maldet-seal-medium">Medium Risk</span>
          </div>

          <div className="maldet-axes-grid" style={{ marginBottom: 0 }}>
            <div className="maldet-axis-box" style={{ padding: "0.75rem" }}>
              <div className="maldet-axis-head">
                <span>Vulnerability</span>
                <span className="maldet-seal maldet-seal-medium">Medium</span>
              </div>
              <div className="maldet-axis-score" style={{ fontSize: "1.6rem", margin: "0.35rem 0" }}>
                76<small>score</small>
              </div>
              <LevelScale active="medium" />
            </div>
            <div className="maldet-axis-box" style={{ padding: "0.75rem" }}>
              <div className="maldet-axis-head">
                <span>Malicious pattern</span>
                <span className="maldet-seal maldet-seal-medium">Medium</span>
              </div>
              <div className="maldet-axis-score" style={{ fontSize: "1.6rem", margin: "0.35rem 0" }}>
                17<small>score</small>
              </div>
              <LevelScale active="medium" />
            </div>
          </div>

          <div style={{ padding: "0.75rem", borderRadius: "0.65rem", background: "var(--color-lavender-mid)", fontSize: "0.78rem" }}>
            <strong>Plain-English LLM Summary:</strong> 16 findings likely need attention, 39 look like noise. Most notable: CVE-2026-59951 in requirements.txt (99% confidence).
          </div>
        </div>
      )}

      {data.type === "history" && (
        <div className="ui-mockup-canvas">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
              Recently Scanned Ledger (181 Total)
            </strong>
            <a
              href={`${MALDET_URL}history`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600 }}
            >
              View all ↗
            </a>
          </div>

          <table className="ui-mockup-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Lang</th>
                <th>Vulnerability</th>
                <th>Malicious</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Skidotus/maldet</strong></td>
                <td>Python</td>
                <td><span className="maldet-seal maldet-seal-medium">Medium 76</span></td>
                <td><span className="maldet-seal maldet-seal-medium">Medium 17</span></td>
              </tr>
              <tr>
                <td><strong>storytold/artcraft</strong></td>
                <td>Rust</td>
                <td><span className="maldet-seal maldet-seal-low">Low 3</span></td>
                <td><span className="maldet-seal maldet-seal-low">Low 6</span></td>
              </tr>
              <tr>
                <td><strong>bilawalsidhu/gods-eye</strong></td>
                <td>JS</td>
                <td><span className="maldet-seal maldet-seal-safe">Safe 0</span></td>
                <td><span className="maldet-seal maldet-seal-high">High 63</span></td>
              </tr>
              <tr>
                <td><strong>vivekchand/clawmetry</strong></td>
                <td>Python</td>
                <td><span className="maldet-seal maldet-seal-critical">Critical 584</span></td>
                <td><span className="maldet-seal maldet-seal-critical">Critical 317</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function InterfaceShowcase({
  data,
  reverse,
}: {
  data: typeof interfaceData[number]
  reverse: boolean
}) {
  return (
    <section
      className={`interface-showcase ${
        reverse ? "interface-showcase-reverse" : ""
      }`}
    >
      <Reveal className="interface-preview-wrap">
        <InterfacePreview data={data} />
      </Reveal>
      <Reveal className="interface-copy" delay={100}>
        <p className="eyebrow">{data.eyebrow}</p>
        <h2>{data.title}</h2>
        <p className="interface-description">{data.description}</p>
        <div className="feature-list">
          {data.features.map(([title, description], index) => (
            <div className="feature-row" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function DocumentationPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  return (
    <main className="page page-documentation">
      <section className="documentation-hero section-pad">
        <div className="documentation-pattern" aria-hidden="true" />
        <div className="hero-particles" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Scanning pipeline & workflow"
              title={
                <>
                  How <em>MalDet</em> Works
                </>
              }
              description="From pasting a GitHub repository URL to receiving separated Vulnerability and Malicious-Pattern verdicts, MalDet automates the entire static inspection and machine-learning triage pipeline."
              light
            />
          </Reveal>
          <Workflow />
          <Reveal className="approval-note">
            <div className="approval-icon" aria-hidden="true">
              <Brand />
            </div>
            <div>
              <h3>Deterministic Scoring with Plain-English AI Explanations</h3>
              <p>
                A local language model explains the main findings in a short
                paragraph, but the risk levels are decided deterministically
                before the LLM sees anything—ensuring AI never alters or
                hallucinates your security score.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <MarqueeBand />

      <section className="tools-section section-pad">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Under the hood · 8 specialized components"
              title={
                <>
                  The Tools <em>Behind the Verdict</em>
                </>
              }
              description="Six established open-source security engines—each inspecting a different risk vector—combined with two custom components built specifically for MalDet."
            />
          </Reveal>
          <div className="tools-grid">
            {detectionTools.map((tool, index) => (
              <TiltCard
                className="tool-engine-card"
                delay={index * 60}
                key={tool.name}
              >
                <div className="tool-engine-top">
                  <span className="tool-engine-icon" aria-hidden="true">
                    {tool.code}
                  </span>
                  <span className={`tool-axis-tag tool-axis-${tool.axisType}`}>
                    {tool.axis}
                  </span>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="topology-section section-pad">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Interactive system architecture"
              title={
                <>
                  Multi-Engine & ML <em>Triage Architecture</em>
                </>
              }
              description="Click any node below to inspect how MalDet ingests GitHub repositories, orchestrates six static engines, filters noise with Random Forest, and publishes dual verdicts."
            />
          </Reveal>
          <Reveal delay={100}>
            <Topology />
          </Reveal>
          <p className="topology-caption">
            All repository scanning takes place statically on the MalDet server (
            <a href={MALDET_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              {MALDET_URL}
            </a>
            ) without executing untrusted repository code.
          </p>
        </div>
      </section>

      <section className="interfaces-section section-pad">
        <div className="content-shell interfaces-shell">
          <Reveal>
            <SectionHeading
              eyebrow="User interface showcase"
              title={
                <>
                  Designed for <em>Clarity & Action</em>
                </>
              }
              description="Explore the three core interfaces of the MalDet web application: the repository scanner, the dual-verdict report console, and the historical audit ledger."
            />
          </Reveal>
          {interfaceData.map((data, index) => (
            <InterfaceShowcase
              data={data}
              reverse={index % 2 === 1}
              key={data.title}
            />
          ))}
        </div>
      </section>

      <section className="closing-section section-pad">
        <Reveal className="content-shell closing-panel">
          <div>
            <p className="eyebrow">Try the live scanner or meet the builders</p>
            <h2>
              Experience MalDet <em>in action.</em>
            </h2>
            <p>
              Launch the live MalDet scanner to inspect a GitHub repository
              yourself, or visit our team page to meet the creators behind the
              project.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            <ActionButton variant="light" href={MALDET_URL}>
              Open Live MalDet Scanner
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => onNavigate("contact")}>
              About Us & Team
            </ActionButton>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

function TeamCard({
  member,
  index,
}: {
  member: typeof team[number]
  index: number
}) {
  return (
    <TiltCard
      className={`team-card ${member.supervisor ? "team-card-supervisor" : ""}`}
      delay={index * 70}
    >
      <div
        className="team-avatar"
        aria-label={`${member.name} initial-based avatar`}
      >
        <span>{member.initials}</span>
      </div>
      <div className="team-card-copy">
        {member.supervisor && (
          <span className="supervisor-badge">Project Supervisor</span>
        )}
        <h3>{member.name}</h3>
        <p style={{ fontWeight: 600, color: member.supervisor ? "#a3d9b8" : "var(--color-primary)" }}>
          {member.role}
        </p>
        {member.blurb && <p style={{ marginTop: "0.45rem" }}>{member.blurb}</p>}
        <span className="team-photo-placeholder">
          Photo & full bio slot ready
        </span>
        {member.github && (
          <div style={{ marginTop: "0.65rem" }}>
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.82rem",
                fontWeight: 650,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              GitHub (@Skidotus) ↗
            </a>
          </div>
        )}
      </div>
    </TiltCard>
  )
}

function ContactForm() {
  const initialValues = { name: "", email: "", subject: "", message: "" }
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const validateField = (field: FormField, value: string) => {
    if (!value.trim()) return "This field is required."
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address."
    }
    if (field === "message" && value.trim().length < 10) {
      return "Please provide at least 10 characters."
    }
    return ""
  }

  const updateField = (field: FormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setSubmitted(false)
    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateField(field, value),
      }))
    }
  }

  const blurField = (field: FormField) => {
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field]),
    }))
  }

  const submitForm = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = Object.keys(values).reduce(
      (result, field) => {
        const key = field as FormField
        const message = validateField(key, values[key])
        if (message) result[key] = message
        return result
      },
      {} as Partial<Record<FormField, string>>,
    )
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
  }

  return (
    <form className="inquiry-form" onSubmit={submitForm} noValidate>
      <div className="form-row">
        <FormInput
          id="name"
          label="Name"
          value={values.name}
          error={errors.name}
          placeholder="Your name"
          onChange={(value) => updateField("name", value)}
          onBlur={() => blurField("name")}
        />
        <FormInput
          id="email"
          label="Email"
          value={values.email}
          error={errors.email}
          placeholder="name@example.com"
          type="email"
          onChange={(value) => updateField("email", value)}
          onBlur={() => blurField("email")}
        />
      </div>
      <FormInput
        id="subject"
        label="Subject"
        value={values.subject}
        error={errors.subject}
        placeholder="Feedback, collaboration, or repository inquiry"
        onChange={(value) => updateField("subject", value)}
        onBlur={() => blurField("subject")}
      />
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={values.message}
          placeholder="Write your message or question for the MalDet team..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => blurField("message")}
        />
        {errors.message && (
          <span className="field-error" id="message-error" role="alert">
            {errors.message}
          </span>
        )}
      </div>
      <div className="form-footer">
        <ActionButton type="submit">Send Inquiry</ActionButton>
        <p>Demonstration contact form · Or visit the live MalDet platform directly.</p>
      </div>
      {submitted && (
        <div className="form-feedback" role="status">
          <span aria-hidden="true">✓</span>
          <p>
            Thank you! Your inquiry has been validated. You can also test our
            scanner directly at{" "}
            <a href={MALDET_URL} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, textDecoration: "underline" }}>
              {MALDET_URL}
            </a>
            .
          </p>
        </div>
      )}
    </form>
  )
}

function FormInput({
  id,
  label,
  value,
  error,
  placeholder,
  type = "text",
  onChange,
  onBlur,
}: {
  id: FormField
  label: string
  value: string
  error?: string
  placeholder: string
  type?: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {error && (
        <span className="field-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

function ContactPage() {
  return (
    <main className="page page-contact">
      <section className="team-section section-pad">
        <div className="team-wave" aria-hidden="true" />
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="About us · German-Malaysian Institute (GMI)"
              title={
                <>
                  Built as a Final Year Project, <em>Made to Be Used.</em>
                </>
              }
              description="MalDet is a Final Year Project for the Diploma in Cyber Security Technology at the German-Malaysian Institute (2026). It started from a simple question: how can a developer tell whether a public repository is safe to pull in without running six security tools and reading thousands of alerts?"
            />
          </Reveal>
          <div className="team-grid">
            {team.map((member, index) => (
              <TeamCard member={member} index={index} key={member.name} />
            ))}
          </div>
        </div>
      </section>

      <MarqueeBand />

      <section className="inquiries-section section-pad">
        <div className="content-shell inquiry-layout">
          <Reveal className="inquiry-copy">
            <p className="eyebrow">Direct access & inquiries</p>
            <h2>
              Test MalDet Live or <em>Get in Touch</em>
            </h2>
            <p>
              Want to see our AI-Driven Malware Detection and Trust Scoring
              System in action? Open the live MalDet scanner directly or send
              our team a message using the inquiry form.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <ActionButton variant="light" href={MALDET_URL}>
                Launch MalDet Website ({MALDET_URL})
              </ActionButton>
            </div>
            <div className="privacy-note">
              <span aria-hidden="true">i</span>
              <p>
                Team member photos and extended project documentation slots are
                prepared and ready to be updated with your final assets.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      className={`back-to-top ${visible ? "back-to-top-visible" : ""}`}
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollToPageTop()}
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}

function getPageFromHash(): Page {
  const hash = window.location.hash.replace("#/", "")
  return navigation.some((item) => item.id === hash) ? (hash as Page) : "about"
}

function scrollToPageTop() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  if (reducedMotion) {
    window.scrollTo({ top: 0, behavior: "instant" })
    return
  }
  const lenis = (window as any).__lenis
  if (lenis?.scrollTo) {
    lenis.scrollTo(0, { duration: 1.2 })
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromHash)
  const { theme, toggleTheme } = useTheme()

  useLenis()

  useEffect(() => {
    const probe = () => {
      const lenis = (window as any).__lenis
      if (!lenis) setTimeout(probe, 100)
    }
    probe()
  }, [])

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash())
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  useEffect(() => {
    document.title = `MalDet — ${navigation.find((item) => item.id === page)?.label}`
    scrollToPageTop()

    if (
      typeof window.IntersectionObserver !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return

    let observer: IntersectionObserver | undefined
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible")
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 },
      )
      document
        .querySelectorAll(".reveal")
        .forEach((element) => observer?.observe(element))
    } catch {
      observer?.disconnect()
    }
    return () => observer?.disconnect()
  }, [page])

  const navigate = (nextPage: Page) => {
    if (nextPage === page) {
      scrollToPageTop()
      return
    }
    window.location.hash = `/${nextPage}`
  }

  return (
    <div className="app-shell">
      <div className="aurora" aria-hidden="true">
        <i className="aurora-blob aurora-blob-one" />
        <i className="aurora-blob aurora-blob-two" />
        <i className="aurora-blob aurora-blob-three" />
      </div>
      <ScrollProgress />
      <Header
        page={page}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="page-transition" key={page}>
        {page === "about" && <AboutPage onNavigate={navigate} />}
        {page === "documentation" && (
          <DocumentationPage onNavigate={navigate} />
        )}
        {page === "contact" && <ContactPage />}
      </div>
      <BackToTop />
      <Footer onNavigate={navigate} />
    </div>
  )
}
