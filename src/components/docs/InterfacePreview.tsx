import { MALDET_URL } from "@/data/navigation"
import { interfaceData } from "@/data/content"
import LevelScale from "@/components/home/LevelScale"

export default function InterfacePreview({ data }: { data: typeof interfaceData[number] }) {
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
            <span className="maldet-brand-badge" style={{ background: "rgba(163,217,184, 0.15)", color: "#a3d9b8", borderColor: "rgba(163,217,184, 0.3)" }}>
              Start here · Public GitHub Scanner
            </span>
            <h4 className="maldet-serif" style={{ fontSize: "1.45rem", margin: "0.65rem 0 0.35rem", color: "#f1f0e8" }}>
              Scan a repository
            </h4>
            <p style={{ margin: 0, color: "#a8b8ad", fontSize: "0.82rem" }}>
              Nothing from the repository is executed. Password-protected .zip, .7z, and .rar archives are unpacked automatically.
            </p>
          </div>

          <div style={{ display: "grid", gap: "0.65rem", background: "rgba(255,255,255,0.04)", padding: "1rem", borderRadius: "0.85rem", border: "1px solid rgba(255,255,255,0.12)" }}>
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
