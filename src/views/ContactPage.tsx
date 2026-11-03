import { MALDET_URL } from "@/data/navigation"
import { team } from "@/data/content"
import MarqueeBand from "@/components/ui/MarqueeBand"
import Reveal from "@/components/ui/Reveal"
import ActionButton from "@/components/ui/ActionButton"
import SectionHeading from "@/components/ui/SectionHeading"
import TeamCard from "@/components/contact/TeamCard"

export default function ContactPage() {
  return (
    <main className="page page-contact">
      <section className="team-section section-pad">
        <div className="team-wave" aria-hidden="true" />
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              eyebrow="About us · German-Malaysian Institute (GMI)"
              level={1}
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
        <div className="content-shell inquiry-expanded">
          <Reveal className="inquiry-copy">
            <p className="eyebrow">Direct platform access · Live web application</p>
            <h2>
              Test MalDet <em>Live Right Now</em>
            </h2>
            <p>
              Want to see our AI-Driven Malware Detection and Trust Scoring
              System in action? Open the live MalDet scanner directly to inspect
              any public GitHub repository with six static engines and ML triage.
            </p>
            <div className="inquiry-expanded-actions" style={{ marginTop: "1.5rem" }}>
              <ActionButton variant="light" href={MALDET_URL}>
                Launch MalDet Website ({MALDET_URL})
              </ActionButton>
              <ActionButton variant="secondary" href={`${MALDET_URL}history`}>
                Browse Live Scan History
              </ActionButton>
            </div>
            <div className="privacy-note" hidden>
              <span aria-hidden="true">i</span>
              <p>
                Team member photos and extended project documentation slots are
                prepared and ready to be updated with your final assets.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            {null}
          </Reveal>
        </div>
      </section>
    </main>
  )
}
