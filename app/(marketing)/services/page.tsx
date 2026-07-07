import type { Metadata } from "next"
import {
  GraduationCap,
  Presentation,
  Newspaper,
  Compass,
  Workflow,
  Bot,
  Headphones,
} from "lucide-react"
import { ServiceCard } from "@/components/marketing/service-card"
import { CTASection } from "@/components/marketing/cta-section"
import { PageHeader } from "@/components/marketing/page-header"
import { LogoTicker } from "@/components/marketing/logo-ticker"
import { AnimatedServicesGrid } from "@/components/marketing/animated-services-grid"
import { StickyCTA } from "@/components/marketing/sticky-cta"

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI training, advisory, automation, and custom agents for lean manufacturers and distributors.",
  alternates: { canonical: "/services" },
}

type Service = {
  icon: React.ReactNode
  title: string
  description: string
  scope: string[]
  timeline?: string
  price?: string
  scoped?: boolean
  image?: string
  featured?: boolean
}

const education: Service[] = [
  {
    icon: <Presentation size={32} />,
    title: "Level Up Your Leadership",
    image: "/images/services/engine-bay.jpg",
    description:
      "Strategy for the people who set it. How to put AI to work in your business, past the hype.",
    scope: [
      "Where AI fits across your operation, and where it doesn't yet",
      "How to get the most out of your workforce with it",
      "The trajectory: where this is heading and how fast it is moving",
      "For owners and leadership. No technical background needed.",
    ],
    timeline: "Half or full day",
    price: "$5,000 to $10,000",
  },
  {
    icon: <GraduationCap size={32} />,
    title: "Team Training",
    image: "/images/services/gears.jpg",
    description:
      "Working sessions on your team's real data, leveled from automating fast up to building custom agents.",
    scope: [
      "Sessions run inside your team's own files (nobody sits through slides)",
      "101: get your team automating fast",
      "201: host and collaborate on real sites",
      "301: build custom, bespoke agents",
    ],
    timeline: "Per level",
    price: "From $2,500",
  },
  {
    icon: <Newspaper size={32} />,
    title: "Weekly AI Update",
    image: "/images/services/gears.jpg",
    description:
      "Short training videos every week as new models and features land, so your team never falls behind.",
    scope: [
      "New videos every week, each a few minutes long",
      "What changed, and whether it matters to you",
      "One flat price for the whole team",
      "Cancel anytime",
    ],
    timeline: "Monthly",
    price: "$99/mo",
  },
]

const build: Service[] = [
  {
    icon: <Workflow size={32} />,
    title: "Automate Anything",
    featured: true,
    image: "/images/services/engine-bay.jpg",
    description:
      "Turn manual, repeatable work into something that runs itself, then teach your team to run it.",
    scope: [
      "Turn a one-hour report into a two-minute program, set up once and good forever",
      "Automate the manual, repeatable tasks that eat your week",
      "Works with your tools: Excel, ERP, Salesforce, whatever you run",
      "Every build includes a session so your team can run and extend it",
    ],
    timeline: "Scoped to the work",
    price: "Get a quote",
    scoped: true,
  },
  {
    icon: <Bot size={32} />,
    title: "Bespoke Bots",
    image: "/images/services/gears.jpg",
    description:
      "The premium tier. Systems that can reason through a whole job and decide the next step on their own.",
    scope: [
      "Knowledge agents: ask your data questions in plain English, no SQL",
      "Connect a model straight to your data, or layer onto Power BI",
      "Agents that answer calls and handle the routine asks",
      "Build fee plus a monthly to run and maintain it",
    ],
    timeline: "Scoped to the work",
    price: "Get a quote",
    scoped: true,
  },
]

const support: Service[] = [
  {
    icon: <Compass size={32} />,
    title: "Guidance & Guardrails",
    image: "/images/services/engine-bay.jpg",
    description:
      "Audits, tool selection, and a roadmap for where AI should go first.",
    scope: [
      "An audit of where AI would pay off fastest",
      "Straight guidance on which tools fit your shop",
      "A prioritized roadmap, no 50-page deck",
      "Available by the hour or as a light monthly",
    ],
    timeline: "Flexible",
    price: "$200/hr or $2,500/mo",
  },
  {
    icon: <Headphones size={32} />,
    title: "Ongoing Support",
    image: "/images/services/engine-bay.jpg",
    description:
      "AI tools change fast. We track the updates so your team doesn't have to.",
    scope: [
      "A dedicated Slack or Teams channel with your team",
      "We track the AI landscape so your team doesn't have to",
      "Troubleshooting when an update breaks a workflow",
      "Quick-start calls for new hires at a flat fee",
    ],
    timeline: "Ongoing monthly",
    price: "$2,500/mo",
  },
]

const groups = [
  {
    id: "education",
    heading: "Education",
    sub: "Get your leadership and your team fluent, from strategy down to which buttons to press.",
    items: education,
    accent: "text-sky-600",
  },
  {
    id: "build",
    heading: "Build",
    sub: "Scoped to your workflow and quoted after a short call. Every build comes with the training to own it.",
    items: build,
    accent: "text-teal-600",
  },
  {
    id: "support",
    heading: "Advisory & Support",
    sub: "Point the effort in the right direction, and keep it running once it is.",
    items: support,
    accent: "text-indigo-500",
  },
]

const steps = [
  {
    number: 1,
    title: "15-Minute Intro",
    description:
      "Tell us where your team loses the most hours. We'll tell you straight if we can help.",
  },
  {
    number: 2,
    title: "Live Demo",
    description:
      "We show Claude, Codex, and Copilot doing real work on real data. See exactly what these tools deliver.",
  },
  {
    number: 3,
    title: "Scoped Proposal",
    description: "Clear scope, timeline, price. No 50-page deck.",
  },
  {
    number: 4,
    title: "We Show Up and Set It Up",
    description:
      "Hands-on deployment with your teams. We stay until it's working.",
  },
]

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="What We Do"
        description="Education, automation, and custom agents for lean manufacturers and distributors. Every engagement is scoped, priced, and built to get your team using AI."
      />

      <p className="mx-auto -mt-4 max-w-2xl px-6 text-center text-sm text-slate-500">
        Darden MBA, a background in enterprise finance, and a YouTube channel
        where I record the real builds. A multi-entity drivetrain-parts
        distributor already runs its monthly reporting on a pipeline I built.
      </p>

      <div className="mt-10">
        <LogoTicker />
      </div>

      {groups.map((group, i) => (
        <section key={group.id} className="py-6">
          <div className="mx-auto mb-6 max-w-6xl px-6">
            <div className="flex items-baseline gap-3">
              <span className={`font-mono text-sm font-medium ${group.accent}`}>
                0{i + 1}
              </span>
              <h2 className="text-3xl font-semibold">{group.heading}</h2>
            </div>
            <p className="mt-2 max-w-2xl text-slate-600">{group.sub}</p>
          </div>
          <AnimatedServicesGrid>
            {group.items.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </AnimatedServicesGrid>
        </section>
      ))}

      {/* Guarantee */}
      <section className="bg-primary py-12 text-center md:py-14">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            My guarantee
          </p>
          <p className="mt-3 text-xl font-semibold text-primary-foreground md:text-2xl">
            One short call and I&apos;ll find at least one process worth automating in
            your business. If I can&apos;t, no charge.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-semibold">How It Works</h2>
          <div className="relative grid gap-10 md:grid-cols-4">
            <div
              aria-hidden
              className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-slate-200 md:block"
            />
            {steps.map((s) => (
              <div key={s.number} className="relative text-center">
                <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-sm font-semibold text-primary">
                  {String(s.number).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Not Sure Where to Start?"
        description="Tell us where your team is spending too many hours. We'll show you how to collapse that timeline."
        secondaryLabel="See the margin and hours impact →"
        secondaryHref="/calculator"
      />
      <StickyCTA />
    </>
  )
}
