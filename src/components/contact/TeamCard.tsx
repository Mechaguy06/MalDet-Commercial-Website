import { team } from "@/data/content"
import TiltCard from "@/components/ui/TiltCard"

/** Two fixed lines (name / @domain) so every chip has the same shape. */
function Email({ address }: { address: string }) {
  const [local, domain] = address.split("@")
  return (
    <>
      <span>{local}</span>
      <span>@{domain}</span>
    </>
  )
}

export default function TeamCard({
  member,
  index,
}: {
  member: (typeof team)[number]
  index: number
}) {
  const hasLinks = Boolean(member.email || member.github)

  return (
    <TiltCard
      className={`team-card ${member.supervisor ? "team-card-supervisor" : ""}`}
      delay={index * 70}
    >
      <div
        className={`team-avatar ${member.photo ? "team-avatar-photo" : ""}`}
        aria-label={`${member.name} initial-based avatar`}
      >
        {member.photo ? <img src={member.photo} alt={member.name} loading="lazy" /> : <span>{member.initials}</span>}
      </div>
      <div className="team-card-copy">
        <h3>{member.name}</h3>
        <p className="team-role">{member.role}</p>
        {member.blurb && <p className="team-blurb">{member.blurb}</p>}
        {hasLinks && (
          <div className="team-card-links">
            {member.email && (
              <a className="team-email-link" href={`mailto:${member.email}`}>
                <Email address={member.email} />
              </a>
            )}
            {member.github && (
              <a
                className="team-github"
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ({member.githubHandle ?? "@GitHub"}) ↗
              </a>
            )}
          </div>
        )}
      </div>
    </TiltCard>
  )
}
