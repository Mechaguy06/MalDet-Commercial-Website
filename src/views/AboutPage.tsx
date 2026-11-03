import FallingLogos from "@/components/FallingLogos"
import MatrixRain from "@/components/MatrixRain"
import { pagePath, MALDET_URL } from "@/data/navigation"
import { problemCards, solutions, stats } from "@/data/content"
import { useHeroSpotlight } from "@/hooks/useHeroSpotlight"
import MagneticButton from "@/components/ui/MagneticButton"
import TiltCard from "@/components/ui/TiltCard"
import CountUpStat from "@/components/ui/CountUpStat"
import MarqueeBand from "@/components/ui/MarqueeBand"
import Reveal from "@/components/ui/Reveal"
import SectionHeading from "@/components/ui/SectionHeading"
import WordReveal from "@/components/ui/WordReveal"

export default function AboutPage() {
  const heroRef = useHeroSpotlight()

  return (
    <main className="page page-about">
      <section className="hero-section stage" ref={heroRef}>
        <MatrixRain />
        <div className="hero-grid-pattern" aria-hidden="true" />

        <div className="content-shell hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              AI-Driven Malware Detection & Trust Scoring System
            </p>
            <h1>
              <span className="line-mask">
                <span style={{ "--d": "100ms" } as React.CSSProperties}>Know what a repository hides</span>
              </span>
              <span className="line-mask">
                <span style={{ "--d": "230ms" } as React.CSSProperties}>
                  <em>before you run it.</em>
                </span>
              </span>
            </h1>
            <p className="hero-tagline fade-in" style={{ "--d": "420ms" } as React.CSSProperties}>
              One Scan · Six Detection Engines · Two Clear Verdicts
            </p>
            <p className="hero-description fade-in" style={{ "--d": "520ms" } as React.CSSProperties}>
              MalDet scans public GitHub repositories with six specialized
              detection engines, filters real issues from scanner noise using a
              Random Forest machine-learning classifier, and gives you two
              actionable verdicts: is the code <strong>vulnerable</strong>, and
              does it look <strong>malicious</strong>?
            </p>
            <div className="hero-actions fade-in" style={{ "--d": "640ms" } as React.CSSProperties}>
              <MagneticButton href={MALDET_URL}>
                Launch MalDet Scanner
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                to={pagePath.documentation}
              >
                How It Works & Tools
              </MagneticButton>
            </div>
          </div>
        </div>

      </section>

      <MarqueeBand />

      <div className="commercial-showcase-zone">
        <FallingLogos />

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

      <section className="commercial-section section-pad">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Commercial · Watch in action"
              title={
                <>
                  See <em>MalDet</em> in Action
                </>
              }
              description="Discover how MalDet protects your development workflow with multi-engine scanning and intelligent threat detection."
            />
          </Reveal>
          <Reveal delay={120} className="commercial-video-wrapper">
            <div className="commercial-video-card">
              <div className="commercial-video-header">
                <div className="video-badge">
                  <span className="video-badge-dot" />
                  <span>MalDet Official Commercial</span>
                </div>
                <span className="video-resolution-pill">1080P HD</span>
              </div>
              <div className="commercial-video-frame">
                <video
                  className="commercial-video-element"
                  src="/assets/Maldet_Video_Commercial.mp4"
                  controls
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>

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
            <WordReveal
              className="body-copy"
              text="Open-source software powers modern development, but pulling an unverified GitHub repository into your environment introduces both accidental security vulnerabilities and intentional supply-chain malware. MalDet automates multi-engine static inspection and machine-learning triage so developers can verify repository trustworthiness before cloning or installing."
            />
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
                  Project <em>Objectives</em>
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
          <div className="closing-actions">
            <MagneticButton variant="light" href={MALDET_URL}>
              Open MalDet Website
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              to={pagePath.documentation}
            >
              Explore How It Works
            </MagneticButton>
          </div>
        </Reveal>
      </section>
        </main>
  )
}
