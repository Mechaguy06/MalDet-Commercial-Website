export const problemCards = [
  {
    number: "01",
    title: "Lack of User-Friendly Security Tools",
    description:
      "Lack of user-friendly tools that provide clear and accessible security assessments for developers. Most existing security scanners are CLI-only utilities that output overwhelming raw logs, forcing developers to interpret complex vulnerability and malware alerts without a unified visual interface.",
  },
  {
    number: "02",
    title: "Undetected Pre-Execution Malware",
    description:
      "Developers lack effective tools to detect malicious code embedded in open-source repositories prior to execution. Attackers frequently conceal trojans, obfuscated payloads, typosquatted dependencies, and malicious install-time hooks inside public repositories and password-protected archives.",
  },
  {
    number: "03",
    title: "Manual & Time-Consuming Code Analysis",
    description:
      "Analysing source code to identify malicious behaviour requires significant manual effort and is time-consuming. Auditing thousands of files across multiple languages, dependencies, and nested archives by hand—and separating true threats from false-positive scanner noise—slows down development.",
  },
]

export const solutions = [
  {
    number: "01",
    title: "Web-Based Security Dashboard",
    description:
      "To design a web-based dashboard for developers to access repository security assessments. Provides a clean, zero-configuration web interface where users paste any public GitHub URL, track live scan progress, filter findings, and audit historical reports in one centralized ledger.",
  },
  {
    number: "02",
    title: "Malicious Code Detection Tool",
    description:
      "To develop a tool for malicious code detection in public GitHub repositories. Orchestrates six static analysis engines (Bandit, Semgrep, pip-audit, YARA, ClamAV, GuardDog) plus a custom Dependency Checker and Random Forest classifier to detect threats statically without executing untrusted code.",
  },
  {
    number: "03",
    title: "Risk Scoring & LLM Summary",
    description:
      "To implement a risk scoring system to evaluate repository threat levels, paired with a local LLM summary that explains key findings in plain English. Computes separated Vulnerability and Malicious-Pattern verdicts (Safe to Critical) deterministically before the local LLM summarizes the top risks.",
  },
]

export const workflow = [
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

export const detectionTools = [
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

export const interfaceData = [
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

export const team = [
  {
    initials: "SL",
    name: "Sir Luqman",
    role: "Project Supervisor",
    blurb: "Academic advisor guiding cybersecurity architecture, threat modeling methodology, and evaluation criteria.",
    supervisor: true,
    photo: "/assets/supervisor.jpg",
  },
  {
    initials: "HK",
    name: "Haikal Hakimi",
    role: "Team lead · Back-end developer",
    blurb: "Project team lead directing core system architecture, multi-engine scanner orchestration, Gunicorn WSGI and Flask APIs, Docker bridge isolation, and MySQL database pipelines.",
    photo: "/assets/haikal.jpg",
    email: "haikalhakimi.zolkifly@student.gmi.edu.my",
    github: "https://github.com/Skidotus",
    githubHandle: "@Skidotus",
  },
  {
    initials: "AR",
    name: "Abdul Ariff",
    role: "Front-end developer",
    blurb: "Front-end engineer building the interactive web console, responsive telemetry dashboards, real-time risk gauges, and mobile-optimized user interfaces.",
    photo: "/assets/ariff.jpg",
    email: "abdulariffaqil.abdulshukur@student.gmi.edu.my",
    github: "https://github.com/Mechaguy06",
    githubHandle: "@Mechaguy06",
  },
  {
    initials: "AL",
    name: "Aleena Syakila",
    role: "Technical writer & presenter",
    blurb: "Lead technical author and presenter formulating project briefs, cybersecurity audit guidelines, system documentation, and stakeholder presentations.",
    photo: "/assets/aleena.jpg",
    email: "aleena.julailey@student.gmi.edu.my",
  },
  {
    initials: "AD",
    name: "Adam Akmal",
    role: "Research & documentation support",
    blurb: "Cybersecurity research analyst evaluating CVE threat feeds, static detection benchmark datasets, engine false-positive thresholds, and audit ledger documentation.",
    photo: "/assets/adam.jpg",
    email: "adamakmal.mohdfaizal@student.gmi.edu.my",
  },
]

export const marqueeItems = [
  "AI-Driven Malware Detection",
  "GitHub Trust Scoring",
  "6 Detection Engines",
  "Random Forest Triage",
  "Vulnerability Verdict",
  "Malicious Pattern Verdict",
  "Supply-Chain Security",
  "Plain-English LLM Summary",
]

export const stats = [
  { value: 181, suffix: "+", label: "Repositories Scanned" },
  { value: 63496, suffix: "", label: "Findings Analysed" },
  { value: 6, suffix: "", label: "Detection Engines" },
  { value: 2, suffix: "", label: "Clear Risk Verdicts" },
]
