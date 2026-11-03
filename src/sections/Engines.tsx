import SectionIntro from "@/components/SectionIntro"
import { trackSpotlight } from "@/lib/motion"

const ENGINES = [
  {
    name: "Bandit",
    kind: "Python security linter",
    catches: "Unsafe calls in Python code — eval and exec, shell injection, weak crypto, hard-coded passwords.",
    glyph: "M4 12h16M4 6h10M4 18h7",
  },
  {
    name: "Semgrep",
    kind: "Pattern-based code scanning",
    catches: "Injection, leaked secrets and risky API use across many languages, matched by semantic rules.",
    glyph: "M5 5h6v6H5zM13 13h6v6h-6zM11 8h4a2 2 0 0 1 2 2v3",
  },
  {
    name: "YARA",
    kind: "Malware signature rules",
    catches: "Byte and string patterns from known malware families, obfuscated payloads and suspicious encodings.",
    glyph: "M4 7h3M9 7h2M13 7h7M4 12h6M12 12h3M17 12h3M4 17h2M8 17h8M18 17h2",
  },
  {
    name: "ClamAV",
    kind: "Antivirus engine",
    catches: "Known viruses, trojans and malicious binaries in every file — including the ones unpacked from archives.",
    glyph: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z",
  },
  {
    name: "GuardDog",
    kind: "Malicious package detection",
    catches: "Install-time hooks, data exfiltration, obfuscated code and other behaviour typical of malicious packages.",
    glyph: "M4 8l8-4 8 4-8 4-8-4ZM4 8v8l8 4 8-4V8M12 12v8",
  },
  {
    name: "Dependency checker",
    kind: "Supply-chain checks",
    catches: "pip-audit CVE lookups, typosquatted package names, loose version pins and direct git+ or URL installs.",
    glyph: "M6 6a2 2 0 1 0 0 .01M18 6a2 2 0 1 0 0 .01M12 18a2 2 0 1 0 0 .01M7.5 7.5 11 16M16.5 7.5 13 16",
  },
]

export default function Engines() {
  return (
    <section id="engines" aria-labelledby="engines-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          id="engines-title"
          eyebrow="Detection engines"
          title="Six engines. Each one catches something the others miss."
          lead="Static analysis, malware signatures, antivirus and supply-chain checks run side by side on every scan. Nothing in the repository is executed."
        />

        <ul className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ENGINES.map((engine, i) => (
            <li
              key={engine.name}
              data-reveal
              style={{ "--d": `${(i % 3) * 90}ms` } as React.CSSProperties}
              onPointerMove={trackSpotlight}
              className="spotlight flex flex-col bg-surface p-7 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl border border-line text-accent-text">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path d={engine.glyph} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-medium tracking-tight">{engine.name}</h3>
              <p className="eyebrow mt-1 !text-[0.68rem]">{engine.kind}</p>
              <p className="mt-4 text-[0.95rem] text-muted">{engine.catches}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
