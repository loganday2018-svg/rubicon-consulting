import type { Metadata } from "next"
import { PageHeader } from "@/components/marketing/page-header"
import { UnsubscribeForm } from "@/components/marketing/unsubscribe-form"
import { verifyEmailToken } from "@/lib/unsubscribe/token"

export const metadata: Metadata = {
  title: "Unsubscribe | Rubicon",
  robots: { index: false, follow: false },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const { t } = await searchParams
  const email = t ? verifyEmailToken(t) : null
  const mailing = process.env.UNSUB_MAILING_ADDRESS

  return (
    <>
      <PageHeader
        title="Unsubscribe"
        description={
          email
            ? `Confirm you'd like to stop receiving emails at ${email}.`
            : "Enter your email and we'll take you off the list."
        }
      />
      <section className="mx-auto max-w-md px-6 py-16">
        <UnsubscribeForm token={email ? t : undefined} email={email ?? undefined} />
        <p className="mt-8 text-center text-sm text-slate-500">
          Changed your mind later? Just reply to any of our emails.
        </p>
        {mailing && (
          <p className="mt-10 text-center text-xs text-slate-400">{mailing}</p>
        )}
      </section>
    </>
  )
}
