import type { Metadata } from "next"
import { PageHeader } from "@/components/marketing/page-header"
import { CTASection } from "@/components/marketing/cta-section"
import { DemoShowcase } from "@/components/marketing/demo/demo-showcase"

export const metadata: Metadata = {
  title: "From Weekly Cost Report to a Dashboard You Can Read",
  description:
    "We take the weekly cost report your team already exports from the ERP and turn it into a dashboard. Real output from a real engagement.",
  alternates: { canonical: "/demo" },
}

export default function DemoPage() {
  return (
    <>
      <PageHeader
        title="Same Numbers. A Report You Can Read in One Pass."
        description="This is the weekly cost report your controller already exports, rebuilt so you can see margin by channel and where the money goes. Toggle between the spreadsheet and the dashboard."
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-24">
        <DemoShowcase />
      </section>

      <CTASection
        heading="Ready to See This Live on Your Data?"
        description="Book a call and pick the format that works: a quick intro, a deep dive, or a full live demo."
        secondaryLabel="See our services →"
        secondaryHref="/services"
      />
    </>
  )
}
