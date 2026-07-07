import { Reveal, DrawRule } from "@/components/marketing/motion-kit"

/**
 * "See it in action" companion to the in-house demo player: the two real,
 * published builds from the Rubicon AI YouTube channel, plus the one honest
 * case line about the drivetrain-parts distributor reporting pipeline.
 * Titles are verbatim from the channel.
 */
const BUILDS = [
  {
    id: "bHyp-2JYWjM",
    title: "How to Automate a Weekly Report With Claude Code (No Coding)",
    blurb:
      "A recurring report turned into a button that pulls the data and refreshes the numbers on one double-click.",
  },
  {
    id: "HW-TzPaO7u4",
    title:
      "How I Automated My Dashboard to Update Itself Every Night (Part #2 of automating with Claude Code)",
    blurb:
      "The same dashboard set to refresh itself overnight, so the number is ready in the morning and nobody rebuilds it by hand.",
  },
] as const

export function ChannelBuilds() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <DrawRule className="mb-10" />
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            See it in action
          </p>
        </Reveal>
        <Reveal delay={0.08} y={14}>
          <h2 className="mt-2 text-center font-display text-3xl font-semibold text-foreground md:text-4xl">
            The real builds, recorded start to finish
          </h2>
        </Reveal>
        <Reveal delay={0.14} y={16}>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-700">
            I record the builds and put them online with nothing cut. Here are
            two that map straight onto the weekly report almost every parts shop
            rebuilds by hand.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BUILDS.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.1} y={18}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-video w-full bg-slate-950">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${b.id}`}
                    title={b.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold leading-snug text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {b.blurb}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} y={12}>
          <p className="mt-6 text-center text-sm text-slate-500">
            <a
              href="https://www.youtube.com/@Rubicon-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-blue underline-offset-4 hover:underline"
            >
              Watch the full builds on the Rubicon AI channel
              <span aria-hidden> &rarr;</span>
            </a>
          </p>
        </Reveal>

        {/* One honest case line */}
        <Reveal delay={0.1} y={16}>
          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              One real example
            </p>
            <p className="mt-3 leading-relaxed text-slate-700">
              A multi-entity drivetrain-parts distributor runs its monthly
              reporting on a pipeline I built. It pulls three spreadsheet exports
              into one live dashboard, so the report the finance team used to put
              together by hand just runs on its own now.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
