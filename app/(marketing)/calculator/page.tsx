import type { Metadata } from "next"
import { PageHeader } from "@/components/marketing/page-header"
import { EbitdaCalculator } from "@/components/marketing/ebitda-calculator"
import { UseCaseBreakdown } from "@/components/marketing/use-case-breakdown"
import { CTASection } from "@/components/marketing/cta-section"

export const metadata: Metadata = {
  title: "What AI Does to Your Margins",
  description:
    "Plug in your shop's numbers. See what collapsing the manual hours does to your margin. Scenario-based estimates for parts manufacturers and distributors.",
}

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        title="What AI Does to Your Margins"
        description="Plug in your shop's numbers. See what collapsing the manual hours does to your margin."
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <EbitdaCalculator />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <UseCaseBreakdown />
        </div>
      </section>

      <CTASection
        heading="Like What You See?"
        description="These are estimates. Book a free analysis and we'll run the real numbers on your company, live."
        secondaryLabel="Learn about our services →"
        secondaryHref="/services"
      />
    </>
  )
}
