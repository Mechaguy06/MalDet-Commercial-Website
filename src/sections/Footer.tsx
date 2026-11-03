import Logo from "@/components/Logo"
import ParticleField from "@/components/ParticleField"
import RepoForm from "@/components/RepoForm"
import { LINKS } from "@/lib/site"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Detection engines", href: "#engines" },
      { label: "Browser extension", href: "#extension" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: LINKS.docs },
      { label: "Sample report", href: "#report" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: LINKS.contact },
      { label: "Privacy", href: LINKS.privacy },
      { label: "Terms", href: LINKS.terms },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="stage relative isolate overflow-hidden">
      <div className="stage-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-50" aria-hidden="true">
        <ParticleField shape="shield" center={[0.84, 0.3]} centerMobile={[0.8, 0.16]} scale={0.26} />
      </div>

      <section aria-labelledby="cta-title" className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 md:pt-36 lg:px-8">
        <p data-reveal className="eyebrow mb-5">
          <span className="bracket">Get started</span>
        </p>
        <h2 id="cta-title" data-reveal className="display max-w-3xl text-[clamp(2.2rem,5.4vw,4.4rem)]">
          Check the next repo <span className="text-accent-text">before you run it.</span>
        </h2>
        <div data-reveal style={{ "--d": "120ms" } as React.CSSProperties} className="mt-10 max-w-xl">
          <RepoForm label="Scan free" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-t border-line py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Malware, vulnerable-dependency and supply-chain scanning for public GitHub repositories.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow mb-4 !text-[0.68rem]">{col.title}</h3>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-ink no-underline opacity-85 transition-opacity hover:opacity-100 hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-line py-6 font-mono text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} MalDet</p>
          <p>Static analysis only — MalDet never executes scanned code.</p>
        </div>
      </div>
    </footer>
  )
}
