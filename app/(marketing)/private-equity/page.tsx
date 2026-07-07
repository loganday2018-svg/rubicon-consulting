import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/marketing/page-header"
import { CTASection } from "@/components/marketing/cta-section"
import { Reveal, SectionHeading, DrawRule } from "@/components/marketing/motion-kit"
import { PrivateEquityJsonLd } from "@/components/seo/json-ld"
import { CTA } from "@/lib/constants"

export const metadata: Metadata = {
  title: "A Fractional AI Operator for Your Parts Portfolio Companies",
  description:
    "For operating partners with asset-heavy parts and industrial portcos. I go into a portco and automate the manual work first, usually the weekly report someone rebuilds by hand, and take on the next piece from there.",
  alternates: { canonical: "/private-equity" },
}

// The two published builds on the Rubicon AI channel that map most directly to
// what an operating partner cares about: a recurring report that runs itself,
// and reconciliation-style analysis. Titles are verbatim from the channel.
const VIDEOS = [
  {
    id: "bHyp-2JYWjM",
    title: "How to Automate a Weekly Report With Claude Code (No Coding)",
    blurb:
      "Pull a week of data into Excel, wrap it in a button that refreshes on one double-click, then turn it into a filterable dashboard. This is the shape of a portco's weekly ops report.",
  },
  {
    id: "HW-TzPaO7u4",
    title:
      "How I Automated My Dashboard to Update Itself Every Night (Part #2 of automating with Claude Code)",
    blurb:
      "The follow-up: the same dashboard set to refresh itself overnight, so the number is waiting when the team logs in instead of getting rebuilt by hand every morning.",
  },
] as const

const FIRST_PROJECTS = [
  {
    title: "Quoting and RFQ handling",
    body: "Reps in a parts distributor spend real hours turning an RFQ into a quote: looking up the part, checking a cross-reference, pulling current pricing, formatting the response. A lot of that is lookup and assembly a tool can do in seconds, with a person checking it before it goes out.",
  },
  {
    title: "Weekly ops reporting",
    body: "The report someone rebuilds every Monday from a few system exports is a good first target. I've built exactly this on the channel: a button that pulls the data, refreshes the numbers, and can even update itself overnight so nobody touches it.",
  },
  {
    title: "Reconciliation",
    body: "Comparing figures across sources, flagging where they disagree, and writing up why is slow, careful work that burns a chunk of a controller's month-end. It's also the kind of work these tools are good at, with the judgment calls left to your people.",
  },
] as const

export default function PrivateEquityPage() {
  return (
    <>
      <PrivateEquityJsonLd />

      <PageHeader
        title="A fractional AI operator for your parts portfolio companies"
        description="If you own asset-heavy parts or industrial businesses, I go in and automate the manual work that's quietly costing the team hours every week, then stay on only if the first project earns it."
      />

      {/* Who this is for */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Who this is for
            </h2>
          </Reveal>
          <Reveal delay={0.1} y={16}>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
              <p>
                You&apos;re an operating partner with a parts distributor,
                a components manufacturer, or some other asset-heavy industrial
                business in the portfolio. The team runs on an ERP like Prophet
                21 or Epicor, a pile of spreadsheets, and a few people who know
                where the numbers live.
              </p>
              <p>
                Those people spend hours a week on work a computer should be
                doing. Quotes get typed out by hand. And every month someone
                burns half a week reconciling exports line by line to close the
                books. None of it needs a new system or a six-figure software
                project. It needs someone who can sit with the work and automate
                the boring parts.
              </p>
              <p>
                That&apos;s what I do. There&apos;s no platform to buy and no
                roadmap I hand off. I go into one portco, find the work costing
                the most hours, and make it run without a person.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What I deploy first */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <DrawRule className="mb-10" />
          <SectionHeading
            title="What I deploy first in a portco"
            copy="I start where the hours are going, wherever a person is doing the same manual job over and over. In parts and industrial businesses that's almost always one of these three."
          />
          <div className="mt-12 space-y-8">
            {FIRST_PROJECTS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} y={18}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm font-medium text-brand-blue">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground md:text-xl">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-slate-700">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} y={14}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
              These aren&apos;t hypotheticals. They&apos;re the same builds I
              publish on the Rubicon AI channel, on the kind of data a portco
              already has.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How an engagement runs */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              How an engagement runs
            </h2>
          </Reveal>
          <Reveal delay={0.1} y={16}>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
              <p>
                We start small and fixed. One project, one price, scoped after a
                short call with the portco&apos;s team so I understand where the
                hours go. You know the number before I start, and what you get
                out of it is a working automation the team can use the next day.
              </p>
              <p>
                If that first project pays for itself, we keep going on a
                fractional basis. I take on the next piece of manual work,
                then the next, at whatever cadence the company can absorb.
                Think of it as an AI operator you can point at a portco for a
                day or two a week instead of hiring a full-time head who has to
                learn the domain from zero. If the work isn&apos;t worth the
                ongoing spend, we stop.
              </p>
              <p>
                I&apos;d rather do good work at one company and get invited to
                the next one in the portfolio than sell a retainer nobody uses.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why me */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <DrawRule className="mb-10" />
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Why me
            </h2>
          </Reveal>
          <Reveal delay={0.1} y={16}>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
              <p>
                I have a Darden MBA and a background in enterprise finance, so I
                read a P&amp;L and a month-end close the way your CFOs do. I know
                what a real reporting process looks like when it&apos;s working
                and when it&apos;s held together by one person and a fragile
                spreadsheet.
              </p>
              <p>
                I also build this stuff myself and put the builds online. Every
                automation I&apos;d run in a portco, I&apos;ve recorded start to
                finish on the Rubicon AI channel, no edits hiding the parts that
                are hard. You can watch how the work goes before you let me near
                a company you own.
              </p>
            </div>
          </Reveal>

          {/* Real builds */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {VIDEOS.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.1} y={18}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="relative aspect-video w-full bg-slate-950">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {v.blurb}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} y={14}>
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
        </div>
      </section>

      {/* Honest track record line */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                One real example
              </p>
              <p className="mt-3 leading-relaxed text-slate-700">
                A multi-entity drivetrain-parts distributor runs its monthly
                reporting on a pipeline I built. The finance team used to build
                that report by hand off three exports. Now the pipeline does it
                and they just read the dashboard. That&apos;s the bar I want to
                hit inside a portco: take a recurring, manual process and turn it
                into something the team stops thinking about.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Point me at one portfolio company"
        description="Send me the one where someone's rebuilding the same report by hand every week, or where month-end always runs late. A short call, and I'll tell you straight whether there's a first project worth doing."
      />

      {/* Quiet nav back */}
      <div className="border-t border-slate-200 bg-white py-8 text-center">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 px-6 text-sm text-slate-500">
          <Button
            variant="secondary"
            size="lg"
            render={
              <a href={CTA.primary.href} target="_blank" rel="noopener noreferrer" />
            }
          >
            {CTA.primary.label}
          </Button>
          <Link
            href="/services"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            See how the operator work is packaged
            <span aria-hidden> &rarr;</span>
          </Link>
        </div>
      </div>
    </>
  )
}
