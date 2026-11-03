import { interfaceData } from "@/data/content"
import Reveal from "@/components/ui/Reveal"
import InterfacePreview from "@/components/docs/InterfacePreview"

export default function InterfaceShowcase({
  data,
  reverse,
}: {
  data: typeof interfaceData[number]
  reverse: boolean
}) {
  return (
    <section
      className={`interface-showcase ${
        reverse ? "interface-showcase-reverse" : ""
      }`}
    >
      <Reveal className="interface-preview-wrap">
        <InterfacePreview data={data} />
      </Reveal>
      <Reveal className="interface-copy" delay={100}>
        <p className="eyebrow">{data.eyebrow}</p>
        <h2>{data.title}</h2>
        <p className="interface-description">{data.description}</p>
        <div className="feature-list">
          {data.features.map(([title, description], index) => (
            <div className="feature-row" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
