import { workflow } from "@/data/content"
import Reveal from "@/components/ui/Reveal"

export default function Workflow() {
  return (
    <div className="workflow-grid">
      {workflow.map((step, index) => (
        <Reveal className="workflow-step" delay={index * 70} key={step.title}>
          <div className="workflow-number">{step.number}</div>
          <div className="workflow-icon" aria-hidden="true">
            <span />
            <span />
          </div>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
          {index < workflow.length - 1 && (
            <div className="workflow-connector" aria-hidden="true">
              <i />
            </div>
          )}
        </Reveal>
      ))}
    </div>
  )
}
