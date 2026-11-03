import { navigation, MALDET_URL } from "@/data/navigation"
import Brand from "@/components/ui/Brand"

export default function Footer() {
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
            <a key={item.id} href={item.path}>
              {item.label}
            </a>
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
              color: "rgba(255,255,255, 0.8)",
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
