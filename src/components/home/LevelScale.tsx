export default function LevelScale({ active }: { active: "safe" | "low" | "medium" | "high" | "critical" }) {
  const steps: Array<"safe" | "low" | "medium" | "high" | "critical"> = [
    "safe",
    "low",
    "medium",
    "high",
    "critical",
  ]
  return (
    <span className="maldet-level-scale" role="img" aria-label={`Risk level: ${active}`}>
      {steps.map((step) => (
        <span
          key={step}
          className={`maldet-level-step maldet-level-step-${step} ${
            step === active ? "is-on" : ""
          }`}
        />
      ))}
    </span>
  )
}
