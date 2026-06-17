import type { Metadata } from "next"
import { PageHeader } from "@/components/marketing/page-header"
import { CancelBooking } from "@/components/marketing/cancel-booking"

export const metadata: Metadata = {
  title: "Cancel Booking",
  robots: { index: false, follow: false },
}

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <>
      <PageHeader title="Cancel Booking" />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-xl px-6">
          <CancelBooking token={token} />
        </div>
      </section>
    </>
  )
}
