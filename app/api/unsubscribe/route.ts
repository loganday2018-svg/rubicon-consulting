import { verifyEmailToken } from "@/lib/unsubscribe/token"
import { addUnsubscribe } from "@/lib/unsubscribe/store"

export const dynamic = "force-dynamic"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Resolve the target email from a signed token (?t= or body) or a typed email. */
async function resolveEmail(request: Request): Promise<string | null> {
  const url = new URL(request.url)
  const qToken = url.searchParams.get("t")
  if (qToken) return verifyEmailToken(qToken)

  const ctype = request.headers.get("content-type") || ""
  try {
    if (ctype.includes("application/json")) {
      const b = (await request.json()) as { t?: string; email?: string }
      if (b.t) return verifyEmailToken(String(b.t))
      if (b.email && EMAIL_RE.test(b.email.trim()))
        return b.email.trim().toLowerCase()
    } else {
      // form-encoded — covers RFC 8058 one-click (List-Unsubscribe-Post)
      const params = new URLSearchParams(await request.text())
      const bt = params.get("t")
      if (bt) return verifyEmailToken(bt)
    }
  } catch {
    // fall through
  }
  return null
}

/** Best-effort notification so an opt-out is never silently lost. */
async function notify(email: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.UNSUB_NOTIFY_EMAIL || process.env.BOOKING_OWNER_EMAIL
  if (!key || !to) return
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BOOKING_FROM_EMAIL || "Rubicon <onboarding@resend.dev>",
      to,
      subject: `Unsubscribe: ${email}`,
      text: `${email} unsubscribed via the website. Remove them from all sending lists.`,
    }),
  }).catch(() => {})
}

export async function POST(request: Request) {
  const email = await resolveEmail(request)
  if (!email) {
    return Response.json(
      { error: "That link is invalid or expired. Enter your email below to opt out." },
      { status: 400 },
    )
  }
  try {
    await addUnsubscribe(email, "web")
  } catch (err) {
    console.error("unsubscribe store error:", err)
  }
  await notify(email)
  return Response.json({ ok: true, email })
}

/**
 * Mail clients / link scanners sometimes GET the unsubscribe URL. Never act on
 * a GET (prefetch could opt people out without intent) — just send them to the
 * confirmation page, which performs the opt-out via POST.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const t = url.searchParams.get("t")
  const to = new URL("/unsubscribe", url.origin)
  if (t) to.searchParams.set("t", t)
  return Response.redirect(to, 302)
}
