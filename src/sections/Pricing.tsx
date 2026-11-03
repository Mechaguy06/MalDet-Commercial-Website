import Placeholder from "@/components/Placeholder"
import SectionIntro from "@/components/SectionIntro"
import { LINKS } from "@/lib/site"

type Tier = {
  name: string
  audience: string
  price: React.ReactNode
  period?: string
  features: React.ReactNode[]
  cta: { label: string; href: string }
  featured?: boolean
}

const TIERS: Tier[] = [
  {
    name: "Free",
    audience: "For checking a repo before you use it",
    price: "$0",
    features: [
      "Public repository scans",
      <>
        <Placeholder>N</Placeholder> scans per day
      </>,
      "All six detection engines",
      "ML triage and AI summary",
      "Browser extension",
    ],
    cta: { label: "Start scanning", href: "#scan" },
  },
  {
    name: "Pro",
    audience: "For individual developers",
    price: <Placeholder>$X</Placeholder>,
    period: "/ month",
    features: ["Everything in Free", "Unlimited scans", "Rescan history and trend charts", "API access"],
    cta: { label: "Go Pro", href: "#scan" },
    featured: true,
  },
  {
    name: "Team / Enterprise",
    audience: "For security and platform teams",
    price: "Custom",
    features: ["Everything in Pro", "Private repositories", "CI/CD integration", "Priority scan queue", "SSO"],
    cta: { label: "Contact sales", href: LINKS.sales },
  },
]

type Cell = boolean | React.ReactNode

const COMPARISON: { feature: string; cells: [Cell, Cell, Cell] }[] = [
  { feature: "Public repository scans", cells: [true, true, true] },
  { feature: "Scans", cells: [<>
        <Placeholder>N</Placeholder> / day
      </>, "Unlimited", "Unlimited"] },
  { feature: "Six detection engines", cells: [true, true, true] },
  { feature: "ML triage and AI summary", cells: [true, true, true] },
  { feature: "Browser extension", cells: [true, true, true] },
  { feature: "Rescan history and trend charts", cells: [false, true, true] },
  { feature: "API access", cells: [false, true, true] },
  { feature: "Private repositories", cells: [false, false, true] },
  { feature: "CI/CD integration", cells: [false, false, true] },
  { feature: "Priority scan queue", cells: [false, false, true] },
  { feature: "SSO", cells: [false, false, true] },
]

const TIER_SHORT = ["Free", "Pro", "Team"]

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return (
      <>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="inline text-accent-text">
          <path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">Included</span>
      </>
    )
  if (value === false)
    return (
      <>
        <span aria-hidden="true" className="text-muted">—</span>
        <span className="sr-only">Not included</span>
      </>
    )
  return <span className="text-sm">{value}</span>
}

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          id="pricing-title"
          eyebrow="Pricing"
          title="Start free. Upgrade when scanning becomes routine."
          lead="Every plan runs the full engine suite. Plans differ in volume, history and where MalDet plugs in."
          align="center"
        />

        <ul className="grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <li
              key={tier.name}
              data-reveal
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              className={`card relative flex flex-col p-7 md:p-8 ${tier.featured ? "stage !border-[color-mix(in_srgb,var(--accent)_45%,transparent)]" : ""}`}
            >
              {tier.featured && (
                <span className="absolute top-6 right-6 rounded-full bg-accent px-2.5 py-1 font-mono text-[0.68rem] text-accent-ink">
                  Recommended
                </span>
              )}
              <h3 className="text-lg font-medium">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted">{tier.audience}</p>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="display text-5xl">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted">{tier.period}</span>}
              </p>
              <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6 text-[0.95rem]">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex gap-3">
                    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="mt-1 flex-none text-accent-text">
                      <path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={tier.cta.href} className={`btn mt-8 w-full ${tier.featured ? "btn-primary" : "btn-ghost"}`}>
                {tier.cta.label}
              </a>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-16">
          <h3 className="mb-6 text-xl font-medium tracking-tight">Compare plans</h3>
          <div className="md:card md:overflow-hidden">
            <table className="compare">
              <caption className="sr-only">Features included in each MalDet plan</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Free</th>
                  <th scope="col" className="col-pro">
                    Pro
                  </th>
                  <th scope="col">Team / Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {row.cells.map((cell, i) => (
                      <td key={i} data-label={TIER_SHORT[i]} className={i === 1 ? "col-pro" : ""}>
                        <CellValue value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
