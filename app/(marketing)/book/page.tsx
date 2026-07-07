import type { Metadata } from "next"
import { PageHeader } from "@/components/marketing/page-header"
import { BookingFlow } from "@/components/marketing/booking-flow"

export const metadata: Metadata = {
  title: "Book a Call",
  description:
    "Pick a time that works. A 15-minute intro, a 30-minute deep dive, or a full live demo with your team.",
  alternates: { canonical: "/book" },
}

export default function BookPage() {
  return (
    <>
      <PageHeader
        title="Book a Call"
        description="Pick a time that works. No back-and-forth, no third-party scheduler."
      />
      <section className="py-16 md:py-24">
        <div className="px-6">
          <BookingFlow />
        </div>
      </section>
    </>
  )
}
