import SectionIntro from "@/components/SectionIntro"
import { trackSpotlight } from "@/lib/motion"

const CASES = [
  {
    who: "Developers",
    title: "Vetting a dependency",
    body: "Before you add a package, or clone a tool a tutorial pointed you to, paste the repository and read the verdict. A quick check beats an afternoon of cleanup.",
    quote: "Is this safe to pip install?",
  },
  {
    who: "Security teams",
    title: "Auditing open source",
    body: "Review the open-source projects your organisation relies on, keep rescan history, and hand reviewers a findings log with the noise already labelled.",
    quote: "Which of our dependencies changed risk this quarter?",
  },
  {
    who: "Educators & students",
    title: "Teaching supply-chain security",
    body: "Real reports make abstract attacks concrete. Each finding names the engine and rule that caught it, so students can see why it was flagged.",
    quote: "What does a typosquat actually look like?",
  },
]

export default function UseCases() {
  return (
    <section aria-labelledby="usecases-title" className="border-t border-line bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro id="usecases-title" eyebrow="Use cases" title="Built for anyone who runs code they didn't write." />
        <ul className="grid gap-4 md:grid-cols-3">
          {CASES.map((c, i) => (
            <li
              key={c.title}
              data-reveal
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              onPointerMove={trackSpotlight}
              className="spotlight flex flex-col rounded-[1.25rem] border border-line bg-bg p-7"
            >
              <p className="eyebrow !text-[0.68rem]">
                <span className="bracket">{c.who}</span>
              </p>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{c.title}</h3>
              <p className="mt-3 flex-1 text-[0.95rem] text-muted">{c.body}</p>
              <p className="mt-8 border-t border-line pt-4 font-mono text-sm text-accent-text">“{c.quote}”</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
