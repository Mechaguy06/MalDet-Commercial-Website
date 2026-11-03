import { useState } from "react"

export type TopologyViewMode = "physical" | "logical"

export interface TopologyNodeSpec {
  id: string
  type: "monitor" | "switch" | "server" | "user"
  label: string
  role: string
  ip: string
  protocol: string
  detail: string
  documentation: string
}

export const topologyNodes: TopologyNodeSpec[] = [
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
    ip: "maldet-fyp.my",
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

export const viewModeLabels: Record<TopologyViewMode, string> = {
  physical: "Architecture Flow",
  logical: "Triage Pipeline",
}

export function TopologyNodeButton({
  node,
  tipOpen,
  onHover,
  onOpen,
  orientation = "vertical",
  tipPlacement = "top",
  mode = "physical",
}: {
  node: TopologyNodeSpec
  tipOpen: boolean
  onHover: (id: string | null) => void
  onOpen: (id: string) => void
  orientation?: "vertical" | "horizontal"
  tipPlacement?: "top" | "bottom"
  mode?: TopologyViewMode
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
        <span>{mode === "logical" ? node.protocol : node.ip}</span>
        {mode === "logical" && (
          <small className="topo-node-subdetail">{node.detail}</small>
        )}
      </span>
      <span
        className={`topo-tip topo-tip-${tipPlacement}`}
        id={`tip-${node.id}`}
        role="tooltip"
        data-open={tipOpen ? "true" : undefined}
      >
        <strong>{node.label}</strong>
        <span>{node.ip} · {node.protocol}</span>
        <span className="topo-tip-role">{node.role}</span>
        <em>Click for architecture details</em>
      </span>
    </button>
  )
}

export default function Topology() {
  const [mode, setMode] = useState<TopologyViewMode>("physical")
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [hoverTip, setHoverTip] = useState<string | null>(null)

  const activeSpec = topologyNodes.find((n) => n.id === activeNode) ?? null
  const nodeSpec = (id: string) => topologyNodes.find((n) => n.id === id)!

  const branchEdges = [
    {
      id: "switch-server",
      d: "M 450 0 L 450 44 L 150 44 L 150 96",
      label: mode === "logical" ? "63,496 RAW ALERTS" : "FINDINGS",
      lx: 290,
      ly: 34,
      duration: 2.6,
    },
    {
      id: "switch-user1",
      d: "M 450 0 L 450 96",
      label: mode === "logical" ? "ML WEIGHTS" : "WEIGHTS",
      lx: 462,
      ly: 72,
      duration: 2.0,
    },
    {
      id: "switch-user2",
      d: "M 450 0 L 450 44 L 750 44 L 750 96",
      label: mode === "logical" ? "LOCKED VERDICTS" : "REPORT",
      lx: 610,
      ly: 34,
      duration: 2.8,
    },
  ]

  return (
    <div className={`topology-wrap topo-mode-${mode}`}>
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
        <div className="logical-node logical-node-pc">
          <TopologyNodeButton
            node={nodeSpec("pc")}
            tipOpen={hoverTip === "pc"}
            onHover={setHoverTip}
            onOpen={setActiveNode}
            orientation="horizontal"
            tipPlacement="bottom"
            mode={mode}
          />
        </div>

        {/* Dedicated vertical connector between GitHub Target and Sandbox */}
        <div className="topo-connector-vertical-wrap" aria-hidden="true">
          <svg className="topo-connector-vertical" viewBox="0 0 240 68">
            <defs>
              <radialGradient id="topo-particle-top" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="40%" stopColor="var(--color-primary)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M 120 0 L 120 68" className="topo-edge-track" />
            <path
              d="M 120 0 L 120 68"
              className="topo-edge-flow"
              style={{ animationDuration: "2.2s" }}
            />
            <text x="132" y="38" className="topo-edge-label">
              {mode === "logical" ? "SHALLOW ARCHIVE" : "CLONE"}
            </text>
            <g className="topo-particle-group">
              <circle r="5" fill="url(#topo-particle-top)">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 120 0 L 120 68" />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
        </div>

        <div className="logical-lan">
          <span className="logical-lan-label">MalDet Sandbox &amp; Scoring Engine</span>

          <div className="logical-node logical-node-switch">
            <TopologyNodeButton
              node={nodeSpec("switch")}
              tipOpen={hoverTip === "switch"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
              orientation="horizontal"
              tipPlacement="top"
              mode={mode}
            />
          </div>

          {/* Dedicated 3-way branch connector between Orchestrator and the 3 bottom engines */}
          <div className="topo-connector-branch-wrap" aria-hidden="true">
            <svg className="topo-connector-branch" viewBox="0 0 900 96" preserveAspectRatio="none">
              <defs>
                <radialGradient id="topo-particle" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="var(--color-primary)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </radialGradient>
              </defs>
              {branchEdges.map((edge) => (
                <g key={edge.id}>
                  <path d={edge.d} className="topo-edge-track" />
                  <path
                    d={edge.d}
                    className="topo-edge-flow"
                    style={{ animationDuration: `${edge.duration}s` }}
                  />
                  <text
                    x={edge.lx}
                    y={edge.ly}
                    textAnchor={edge.id === "switch-user1" ? "start" : "middle"}
                    className="topo-edge-label"
                  >
                    {edge.label}
                  </text>
                </g>
              ))}
              <g className="topo-particle-group">
                {branchEdges.map((edge) => (
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
          </div>

          <div className="logical-grid">
            <TopologyNodeButton
              node={nodeSpec("server")}
              tipOpen={hoverTip === "server"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
              tipPlacement="top"
              mode={mode}
            />
            <TopologyNodeButton
              node={nodeSpec("user1")}
              tipOpen={hoverTip === "user1"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
              tipPlacement="top"
              mode={mode}
            />
            <TopologyNodeButton
              node={nodeSpec("user2")}
              tipOpen={hoverTip === "user2"}
              onHover={setHoverTip}
              onOpen={setActiveNode}
              tipPlacement="top"
              mode={mode}
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
