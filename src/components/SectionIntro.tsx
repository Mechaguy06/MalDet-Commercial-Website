type Props = {
  id: string
  eyebrow: string
  title: React.ReactNode
  lead?: React.ReactNode
  align?: "left" | "center"
}

export default function SectionIntro({ id, eyebrow, title, lead, align = "left" }: Props) {
  const centered = align === "center"
  return (
    <div className={`mb-12 max-w-3xl md:mb-16 ${centered ? "mx-auto text-center" : ""}`}>
      <p data-reveal className="eyebrow mb-5">
        <span className="bracket">{eyebrow}</span>
      </p>
      <h2 id={id} data-reveal style={{ "--d": "80ms" } as React.CSSProperties} className="display text-[clamp(2rem,4.6vw,3.6rem)]">
        {title}
      </h2>
      {lead && (
        <p
          data-reveal
          style={{ "--d": "160ms" } as React.CSSProperties}
          className={`mt-5 text-lg text-muted ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
