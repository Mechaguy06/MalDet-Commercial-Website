export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "center",
  level = 2,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  light?: boolean
  align?: "center" | "left"
  /** Use 1 for the single page-title heading on a page. */
  level?: 1 | 2
}) {
  const Heading = level === 1 ? "h1" : "h2"
  return (
    <div
      className={`section-heading section-heading-${align} ${
        light ? "section-heading-light" : ""
      }`}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading>{title}</Heading>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}
