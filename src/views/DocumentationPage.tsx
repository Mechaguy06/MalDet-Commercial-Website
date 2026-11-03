import { pagePath, MALDET_URL } from "@/data/navigation"
import { detectionTools, interfaceData } from "@/data/content"
import TiltCard from "@/components/ui/TiltCard"
import MarqueeBand from "@/components/ui/MarqueeBand"
import Brand from "@/components/ui/Brand"
import Reveal from "@/components/ui/Reveal"
import ActionButton from "@/components/ui/ActionButton"
import SectionHeading from "@/components/ui/SectionHeading"
import Workflow from "@/components/home/Workflow"
import Topology from "@/components/docs/Topology"
import InterfaceShowcase from "@/components/docs/InterfaceShowcase"

export default function DocumentationPage() {
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
              level={1}
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
                  Production VPS & Multi-Container <em>Architecture</em>
                </>
              }
              description="Click any component below to view its live endpoint, port security rules, and container isolation boundaries across WAN, Apache reverse proxy, and the Docker bridge network."
            />
          </Reveal>
          <Reveal delay={100}>
            <Topology />
          </Reveal>
          <p className="topology-caption">
            All repository scanning takes place statically on the MalDet server (
            <a href={MALDET_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
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
            <ActionButton variant="secondary" to={pagePath.contact}>
              About Us & Team
            </ActionButton>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
