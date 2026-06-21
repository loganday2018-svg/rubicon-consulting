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
import { AnimatedServicesGrid } from "@/components/marketing/animated-services-grid"
import { AnimatedSteps } from "@/components/marketing/animated-steps"

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI training, advisory, automation, and custom agents for lean manufacturers and distributors.",
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
}

const education: Service[] = [
  {
    icon: <Presentation size={32} />,
    title: "Level Up Your Leadership",
    image: "/images/services/engine-bay.jpg",
    description:
      "Strategy for the people who set it. How to actually put AI to work in your business, past the hype.",
    scope: [
      "How to think about leveraging AI across your operation",
      "How to get the most out of your workforce with it",
      "The trajectory: where this is heading and how fast it is moving",
      "Built for owners and leadership, not engineers",
    ],
    timeline: "Half or full day",
    price: "$5,000 to $10,000",
  },
  {
    icon: <GraduationCap size={32} />,
    title: "Team Training",
    image: "/images/services/gears.jpg",
    description:
      "Tactical and hands-on, leveled from automating fast up to building custom agents, on your team's real data.",
    scope: [
      "Hands-on sessions, not slides",
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
      "New videos every week, no fluff",
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
      "The premium tier. Systems that reason and decide, not just execute a single task.",
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
  },
  {
    id: "build",
    heading: "Build",
    sub: "Scoped to your workflow and quoted after a short call. Every build comes with the training to own it.",
    items: build,
  },
  {
    id: "support",
    heading: "Advisory & Support",
    sub: "Point the effort in the right direction, and keep it running once it is.",
    items: support,
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

      {groups.map((group) => (
        <section key={group.id} className="py-12">
          <div className="mx-auto mb-8 max-w-6xl px-6">
            <h2 className="text-3xl font-semibold">{group.heading}</h2>
            <p className="mt-2 max-w-2xl text-slate-600">{group.sub}</p>
          </div>
          <AnimatedServicesGrid>
            {group.items.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </AnimatedServicesGrid>
        </section>
      ))}

      {/* How It Works */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            How It Works
          </h2>
          <AnimatedSteps steps={steps} />
        </div>
      </section>

      <CTASection
        heading="Not Sure Which Service Fits?"
        description="Tell us where your team is spending too many hours. We'll show you how to collapse that timeline."
        secondaryLabel="See the margin and hours impact →"
        secondaryHref="/calculator"
      />
    </>
  )
}
