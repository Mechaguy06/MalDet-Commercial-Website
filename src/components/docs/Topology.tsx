import { useState, useEffect } from "react"

export interface ArchNode {
  id: string
  label: string
  role: string
  zone: string
  endpoint: string
  protocol: string
  detail: string
  doc: string
  icon: "client" | "laptop" | "cloud" | "firewall" | "proxy" | "ssh" | "app" | "worker" | "db"
  popoverPlacement?: "top" | "bottom"
}

export const archNodes: Record<string, ArchNode> = {
  client_device: {
    id: "client_device",
    label: "Client Device",
    role: "Web browser + MalDet browser extension",
    zone: "INTERNET (WAN)",
    endpoint: "maldet-fyp.my / Chrome & Firefox Ext",
    protocol: "HTTPS / TCP 443 (HTTP 80 → 301)",
    detail: "User visits web scanner or triggers auto-scan via extension",
    doc: "End-user client operating through any modern browser or the companion MalDet extension. Initiates repository scans over TLS-encrypted HTTPS port 443.",
    icon: "client",
    popoverPlacement: "bottom",
  },
  dev_laptop: {
    id: "dev_laptop",
    label: "Developer Laptop (admin)",
    role: "Ollama qwen3.5:2b + backfill_summaries.py",
    zone: "INTERNET (WAN)",
    endpoint: "Direct SSH Key Auth",
    protocol: "SSH / TCP 8288",
    detail: "Local AI model inference & report summaries via SSH tunnel",
    doc: "Authorized developer workstation running local AI inference using Ollama (qwen3.5:2b). Securely connects over custom port 8288 to tunnel laptop:3307 directly to MySQL:3306 for writing summaries without exposing the database to the internet.",
    icon: "laptop",
    popoverPlacement: "bottom",
  },
  external_services: {
    id: "external_services",
    label: "External Services",
    role: "GitHub API, ClamAV, OSV/PyPI, Semgrep, Let's Encrypt",
    zone: "INTERNET (WAN)",
    endpoint: "api.github.com · OSV · ClamAV Mirrors",
    protocol: "Outbound HTTPS / TCP 443",
    detail: "Clone repo, virus signatures, CVE databases & SSL certs",
    doc: "Upstream services queried during inspection: GitHub REST API & shallow clone, ClamAV virus database mirror via freshclam, PyPI/OSV vulnerabilities for pip-audit, Semgrep community rules, and Let's Encrypt TLS certificates.",
    icon: "cloud",
    popoverPlacement: "bottom",
  },
  firewall: {
    id: "firewall",
    label: "Host Firewall",
    role: "UFW perimeter protection on Ubuntu 24.04 LTS",
    zone: "VPS HOST",
    endpoint: "103.233.1.97",
    protocol: "Allowed: TCP 80, 443, 8288 · Blocked: 22, 3306, 5000",
    detail: "Drops unauthorized ports; routes web to Apache & admin to SSH",
    doc: "Ubuntu host firewall (UFW/iptables). Only permits incoming web traffic on ports 80/443 and custom SSH on port 8288. All other ports (including default SSH 22, MySQL 3306, and Flask 5000) are blocked from WAN.",
    icon: "firewall",
    popoverPlacement: "bottom",
  },
  apache: {
    id: "apache",
    label: "Apache 2.4 Reverse Proxy",
    role: "TLS termination & port 80 → 443 redirect",
    zone: "VPS HOST",
    endpoint: "127.0.0.1:5000 (loopback)",
    protocol: "Apache 2.4 · mod_ssl · Let's Encrypt",
    detail: "Terminates HTTPS & proxies to internal Flask container",
    doc: "Apache 2.4 reverse proxy manages Let's Encrypt TLS certs, automatically upgrades port 80 requests to HTTPS (301 redirect), and reverse-proxies secure requests directly to the Flask WSGI application on 127.0.0.1:5000.",
    icon: "proxy",
    popoverPlacement: "bottom",
  },
  openssh: {
    id: "openssh",
    label: "OpenSSH Server",
    role: "TCP 8288 key auth gateway",
    zone: "VPS HOST",
    endpoint: "Port 8288",
    protocol: "OpenSSH 9.6 · Public-Key Auth",
    detail: "Provides encrypted SSH tunnel for AI summaries",
    doc: "Hardened OpenSSH service on custom port 8288 with password authentication disabled. Forwards secure SSH tunnel from developer laptop:3307 to db:3306 for local AI summary ingestion.",
    icon: "ssh",
    popoverPlacement: "bottom",
  },
  app_container: {
    id: "app_container",
    label: "App Container",
    role: "gunicorn + Flask (2 workers)",
    zone: "DOCKER BRIDGE",
    endpoint: "127.0.0.1:5000 (published locally only)",
    protocol: "Python 3.12 · Flask · Gunicorn WSGI",
    detail: "Serves web console, accepts scan jobs & queries database",
    doc: "Web application container running Flask with 2 Gunicorn workers. Exposes port 5000 exclusively on loopback (127.0.0.1) behind Apache. Connects to the database container over the Docker bridge network on TCP 3306.",
    icon: "app",
    popoverPlacement: "top",
  },
  worker_container: {
    id: "worker_container",
    label: "Worker Container (1 scan at a time)",
    role: "Bandit, Semgrep, YARA, ClamAV, GuardDog, pip-audit + Random Forest",
    zone: "DOCKER BRIDGE",
    endpoint: "Internal maldet_default network",
    protocol: "6 Static Analysis Engines + Scikit-Learn Classifier",
    detail: "Executes multi-engine analysis, triages noise & writes verdicts",
    doc: "Isolated analysis worker container executing one scan at a time for predictable server resource bounds. Orchestrates all 6 static security engines without executing repository code, evaluates findings with Random Forest ML to filter noise, and writes verdicts to MySQL.",
    icon: "worker",
    popoverPlacement: "top",
  },
  db_container: {
    id: "db_container",
    label: "DB Container (MySQL 8.0)",
    role: "172.18.0.2:3306 (not published to host)",
    zone: "DOCKER BRIDGE",
    endpoint: "Service name: db · Port 3306",
    protocol: "MySQL 8.0 · InnoDB",
    detail: "Internal database for scan ledgers, findings & AI summaries",
    doc: "Dedicated MySQL 8.0 container holding historical repository audits, findings, confidence ratings, and AI explanations. Its port 3306 is not published to the host, ensuring zero direct WAN exposure.",
    icon: "db",
    popoverPlacement: "top",
  },
}

function NodeIcon({ type }: { type: ArchNode["icon"] }) {
  switch (type) {
    case "client":
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M2 18h20v2H2z" />
          <circle cx="12" cy="10" r="1.5" />
        </svg>
      )
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      )
    case "firewall":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v6M15 9v6M9 15v6" />
        </svg>
      )
    case "proxy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" />
        </svg>
      )
    case "ssh":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      )
    case "app":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    case "worker":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    case "db":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="arch-svg-icon">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
  }
}

export default function Topology() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveNode(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const renderNodeButton = (nodeId: string) => {
    const node = archNodes[nodeId]
    if (!node) return null
    const isActive = activeNode === nodeId

    return (
      <div className={`arch-node-wrapper ${isActive ? "is-active" : ""}`} key={node.id}>
        <button
          type="button"
          className={`arch-node-card ${isActive ? "arch-node-card-active" : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            setActiveNode(isActive ? null : node.id)
          }}
          aria-expanded={isActive}
        >
          <div className="arch-node-top">
            <span className="arch-node-icon-shell">
              <NodeIcon type={node.icon} />
            </span>
            <span className="arch-node-click-pill">
              {isActive ? "Close" : "Click for info"}
            </span>
          </div>
          <h4 className="arch-node-title">{node.label}</h4>
          <p className="arch-node-role">{node.role}</p>
        </button>

        {isActive && (
          <div
            className={`arch-exact-popover placement-${node.popoverPlacement || "bottom"}`}
            role="dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="arch-popover-notch" />
            <div className="arch-popover-header">
              <div className="arch-popover-title-row">
                <span className="arch-popover-zone-badge">{node.zone}</span>
                <button
                  type="button"
                  className="arch-popover-close-btn"
                  onClick={() => setActiveNode(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <h4 className="arch-popover-name">{node.label}</h4>
              <p className="arch-popover-sub">{node.role}</p>
            </div>

            <div className="arch-popover-body">
              <div className="arch-popover-tags">
                <div className="arch-tag-group">
                  <span className="arch-tag-lbl">Protocol / Ports</span>
                  <span className="arch-tag-val">{node.protocol}</span>
                </div>
                <div className="arch-tag-group">
                  <span className="arch-tag-lbl">Endpoint</span>
                  <span className="arch-tag-val">{node.endpoint}</span>
                </div>
              </div>

              <div className="arch-popover-section">
                <span className="arch-tag-lbl">Functionality</span>
                <p className="arch-popover-text">{node.detail}</p>
              </div>

              <div className="arch-popover-section">
                <span className="arch-tag-lbl">Architecture Details</span>
                <p className="arch-popover-doc">{node.doc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="arch-diagram-shell" onClick={() => setActiveNode(null)}>
      {/* ===== ZONE 1: INTERNET (WAN) ===== */}
      <div className="arch-zone-card arch-wan-zone">
        <div className="arch-zone-header">
          <div className="arch-zone-title">
            <span className="arch-zone-indicator" />
            <span>INTERNET (WAN)</span>
          </div>
          <div className="arch-dns-pill">
            <span>DNS:</span> <strong>maldet-fyp.my</strong> → <code>A 103.233.1.97</code>
          </div>
        </div>

        <div className="arch-wan-grid">
          {renderNodeButton("client_device")}
          {renderNodeButton("dev_laptop")}
          {renderNodeButton("external_services")}
        </div>

        <div className="arch-wan-flows">
          <div className="arch-flow-col">
            <span className="arch-flow-line" />
            <span className="arch-flow-label">HTTPS / TCP 443 (HTTP 80 → 301)</span>
            <span className="arch-flow-arrow">↓</span>
          </div>
          <div className="arch-flow-col">
            <span className="arch-flow-line" />
            <span className="arch-flow-label">SSH / TCP 8288</span>
            <span className="arch-flow-arrow">↓</span>
          </div>
          <div className="arch-flow-col">
            <span className="arch-flow-line arch-flow-dashed" />
            <span className="arch-flow-label">Outbound HTTPS / TCP 443 (clone repo, API, signatures)</span>
            <span className="arch-flow-arrow">↑</span>
          </div>
        </div>
      </div>

      {/* ===== ZONE 2: VPS — Ubuntu 24.04 LTS ===== */}
      <div className="arch-zone-card arch-vps-zone">
        <div className="arch-zone-header">
          <div className="arch-zone-title">
            <span className="arch-zone-indicator indicator-vps" />
            <span>VPS — Ubuntu 24.04 LTS (4 GB RAM / 100 GB disk)</span>
          </div>
          <div className="arch-vps-meta">
            <span>Public IP: <strong>103.233.1.97</strong></span>
            <span>·</span>
            <span>Domain: <strong>maldet-fyp.my</strong></span>
          </div>
        </div>

        {/* VPS Host Ingress Layer */}
        <div className="arch-vps-host-grid">
          {renderNodeButton("firewall")}
          {renderNodeButton("apache")}
          {renderNodeButton("openssh")}
        </div>

        {/* VPS Host to Docker Bridge Interconnects */}
        <div className="arch-bridge-flows">
          <div className="arch-flow-col">
            <span className="arch-flow-label">HTTP (loopback) 127.0.0.1:5000</span>
            <span className="arch-flow-arrow">↓</span>
          </div>
          <div className="arch-flow-col">
            <span className="arch-flow-label arch-dashed-lbl">SSH tunnel laptop:3307 → db:3306 (AI summaries)</span>
            <span className="arch-flow-arrow">↓</span>
          </div>
        </div>

        {/* Docker Bridge Network Boundary */}
        <div className="arch-docker-boundary">
          <div className="arch-docker-header">
            <span className="arch-docker-badge">
              <span className="arch-docker-dot" />
              Docker bridge network <code>maldet_default</code> (172.18.0.0/16)
            </span>
          </div>

          <div className="arch-docker-grid">
            {renderNodeButton("app_container")}
            {renderNodeButton("worker_container")}
            {renderNodeButton("db_container")}
          </div>

          <div className="arch-docker-connections">
            <div className="arch-internal-flow">
              <span>app container → TCP 3306 → db container</span>
              <span>·</span>
              <span>worker container → TCP 3306 → db container</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Network Rules */}
      <div className="arch-legend-bar">
        <div className="arch-legend-items">
          <span className="arch-legend-item">
            <span className="legend-line legend-solid" /> Solid line = inbound request
          </span>
          <span className="arch-legend-item">
            <span className="legend-line legend-dashed" /> Dashed line = outbound connection or SSH tunnel
          </span>
        </div>
        <p className="arch-legend-note">
          App and worker reach MySQL by the service name <code>db</code> on the internal network. Only Apache (80/443) and SSH (8288) face the internet.
        </p>
      </div>
    </div>
  )
}
