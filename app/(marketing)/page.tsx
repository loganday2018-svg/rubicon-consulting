import type { Metadata } from "next"
import { HeroSection } from "@/components/marketing/hero"
import { CTASection } from "@/components/marketing/cta-section"
import { LogoTicker } from "@/components/marketing/logo-ticker"
import { ValueProps } from "@/components/marketing/value-props"
import { AutomationSavings } from "@/components/marketing/automation-savings"
import { AdoptionCurve } from "@/components/marketing/adoption-curve"
import { VideoDemo } from "@/components/marketing/video-demo"
import { SectionHeading, DrawRule } from "@/components/marketing/motion-kit"

export const metadata: Metadata = {
  title: "AI for Vehicle-Parts Manufacturers & Distributors",
  description:
    "Rubicon implements and teaches AI at automotive, truck, and aftermarket parts companies. Automate the manual work, train your team, get hours back.",
}

const VALUE_PROPS = [
  {
    icon: "Clock" as const,
    title: "Your Cost Reports Build Themselves",
    description:
      "The weekly report someone rebuilds by hand, pulling labor, freight, and parts numbers out of the system, runs on its own.",
    useCases: [
      "The weekly cost report pulled together in a minute, not an hour",
      "Labor, freight, and parts numbers reconciled without the manual copy-paste",
      "Month-end commentary and variance drafts done same day",
    ],
  },
  {
    icon: "Cog" as const,
    title: "Stop Chasing Parts Across Locations",
    description:
      "See what's short at one location and sitting at another before a line goes down, instead of finding out the hard way.",
    useCases: [
      "Short at one plant and sitting at another, flagged before a line stops",
      "Reorder points and stock transfers surfaced automatically across branches",
      "Messy inventory exports turned into clear moves your team can act on",
    ],
  },
  {
    icon: "TrendingUp" as const,
    title: "Quote and Order Faster",
    description:
      "The front-office back-and-forth that ties up your people, RFQs, quotes, cross-references, handled at AI speed.",
    useCases: [
      "Customer quotes drafted from your catalog and pricing in seconds",
      "Cross-references and parts lookups answered instantly",
      "Order entry and data cleanup that used to tie up the front office",
    ],
  },
  {
    icon: "Handshake" as const,
    title: "Tighten Purchasing and Margins",
    description:
      "Find the money hiding in your cost lines and vendor terms without hiring an analyst to dig for it.",
    useCases: [
      "Benchmark every cost line against the market without hiring a consultant",
      "Same part, different vendor prices across the business, flagged instantly",
      "Vendor contracts read for terms, renewals, and risk in seconds",
    ],
  },
] as const

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Value Propositions */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title="What Changes When AI Actually Works"
            copy="Not theory. These are the workflows we set up in real parts shops and warehouses."
          />

          <ValueProps items={VALUE_PROPS} />
        </div>
      </section>

      {/* Adoption Curve */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <DrawRule className="mb-12" />
          <SectionHeading
            title={`From "Let's start using AI" to "We can't imagine not using it."`}
            copy="Most teams watch a few demos, then adoption stalls. We compress the curve to weeks, not quarters."
          />
          <div className="mt-12">
            <AdoptionCurve />
          </div>
        </div>
      </section>

      <VideoDemo />

      {/* Automation savings */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <DrawRule className="mb-12" />
          <SectionHeading
            title="What Would You Do With the Time Back?"
            copy="One task automated each week is 52 hours a year. Slide it around and see what that time is worth."
          />
          <div className="mt-12">
            <AutomationSavings />
          </div>
        </div>
      </section>

      <LogoTicker />

      <CTASection
        secondaryLabel="See how we work →"
        secondaryHref="/services"
      />
    </>
  )
}
