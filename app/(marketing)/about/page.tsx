import type { Metadata } from "next"
import { BRAND } from "@/lib/constants"
import { TeamMember } from "@/components/marketing/team-member"
import { CTASection } from "@/components/marketing/cta-section"
import { PageHeader } from "@/components/marketing/page-header"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedTeam } from "@/components/marketing/animated-team"

export const metadata: Metadata = {
  title: "About",
  description: `Meet Logan. An operator who puts AI to work at vehicle-parts companies.`,
}

const team = [
  {
    name: "Logan Day",
    title: "Founder",
    credentials: [
      "MBA - UVA Darden School of Business",
      "Finance Leadership Development Program",
      "U.S. Army Captain (Reserve)",
    ],
    bio: "U.S. Army Company Commander turned enterprise finance. Duke undergrad, Darden MBA. Adopted Claude Code before anyone asked him to, saw the impact, and built Rubicon to bring that edge to automotive, truck, and aftermarket parts companies.",
    initials: "LD",
    imageSrc: "/images/logan.jpg",
    linkedIn: "https://linkedin.com/in/loganday1",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About"
        description="I'm an operator, not a theorist. Every recommendation comes from tools I use myself, every day."
      />

      {/* Why We Exist */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection>
            <h2 className="mb-6 text-3xl font-semibold">Why Rubicon Exists</h2>
            <p className="mb-4 leading-relaxed text-slate-700">
              Most AI initiatives die in the pilot. They&apos;re led by people
              who&apos;ve never used the tools. Adoption is everything.
            </p>
            <p className="mb-4 leading-relaxed text-slate-700">
              I adopted AI tools before anyone asked me to. The productivity
              impact was immediate. Now I help parts manufacturers and
              distributors get the same results in weeks, not quarters.
            </p>
            <p className="leading-relaxed text-slate-700">
              I show up, set up the tools, train your teams, and stay until it
              works.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-center text-3xl font-semibold">
            Founder
          </h2>
          <AnimatedTeam>
            {team.map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </AnimatedTeam>
        </div>
      </section>

      <CTASection
        heading="Want to Work With Us?"
        description="Bring your numbers. I'll analyze your shop live on the call and show you where AI moves the needle."
        secondaryLabel="See what we do →"
        secondaryHref="/services"
      />
    </>
  )
}
