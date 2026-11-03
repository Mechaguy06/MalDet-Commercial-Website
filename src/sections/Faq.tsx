import Placeholder from "@/components/Placeholder"

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is my code stored?",
    a: (
      <>
        MalDet clones a repository to scan it. Free and Pro plans scan public repositories only.{" "}
        <Placeholder>Confirm retention: how long the checkout and report are kept</Placeholder>
      </>
    ),
  },
  {
    q: "How long does a scan take?",
    a: (
      <>
        It depends on the size of the repository and how many archives need unpacking. A typical scan takes{" "}
        <Placeholder>median scan time</Placeholder>. Team plans get a priority queue.
      </>
    ),
  },
  {
    q: "Why might a finding be marked as noise?",
    a: "Detection engines are deliberately cautious, so they flag patterns that are often harmless in context — a fake secret in a test fixture, a shell call in a build script, a base64 string inside an image. The classifier learns from labelled scan results which kinds of findings tend to be real. Noise is labelled, not deleted, so you can always review it yourself.",
  },
  {
    q: "Does MalDet run the code?",
    a: "No. Every engine is static: it reads files and never executes them. Archives are unpacked and inspected, not run.",
  },
  {
    q: "Does the AI summary affect the risk level?",
    a: "No. The risk level comes from the detection engines and the triage classifier. The AI summary explains that result in plain English; it can't raise or lower it.",
  },
  {
    q: "Which languages are covered?",
    a: "Bandit, pip-audit and the dependency checks focus on Python. Semgrep, YARA and ClamAV work across languages and file types, and GuardDog checks package behaviour.",
  },
  {
    q: "Can I scan private repositories?",
    a: "Yes, on the Team / Enterprise plan. Free and Pro scan public repositories.",
  },
]

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="card px-5 py-14 sm:px-10 md:px-16 md:py-20">
          <div className="mb-12 text-center">
            <span aria-hidden="true" className="text-2xl text-accent-text">
              ✳
            </span>
            <h2 id="faq-title" className="display mt-3 text-[clamp(2rem,4.6vw,3.4rem)]">
              Frequently asked
            </h2>
          </div>
          <div className="border-t border-line">
            {FAQS.map((item) => (
              <details key={item.q} className="faq-item group border-b border-line">
                <summary className="flex items-center justify-between gap-6 py-5 text-left">
                  <span className="font-mono text-[0.8rem] tracking-[0.06em] uppercase">{item.q}</span>
                  <span className="faq-plus text-muted group-hover:text-ink" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pb-6 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
