import { Resend } from "resend"
import { BRAND } from "@/lib/constants"

/**
 * Optional branded confirmation email. No-op unless RESEND_API_KEY is set —
 * Google Calendar already emails the attendee an invite with the Meet link, so
 * this is a polish layer, not a requirement.
 */
export async function sendConfirmation(opts: {
  to: string
  name: string
  meetingLabel: string
  whenLabel: string
  meetLink?: string
  cancelUrl: string
}): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) return

  const from = process.env.BOOKING_FROM_EMAIL || `${BRAND.name} <onboarding@resend.dev>`
  const resend = new Resend(key)

  const html = `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">
      <h2 style="font-size:20px">You're booked: ${opts.meetingLabel}</h2>
      <p>Hi ${opts.name}, your ${opts.meetingLabel.toLowerCase()} with ${BRAND.name} is confirmed.</p>
      <p style="font-size:16px;font-weight:600">${opts.whenLabel}</p>
      ${
        opts.meetLink
          ? `<p><a href="${opts.meetLink}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Join the Google Meet</a></p>`
          : ""
      }
      <p style="color:#64748b;font-size:13px">Need to cancel? <a href="${opts.cancelUrl}">Use this link</a>.</p>
    </div>`

  try {
    await resend.emails.send({
      from,
      to: opts.to,
      subject: `Confirmed: ${opts.meetingLabel} with ${BRAND.name}`,
      html,
    })
  } catch (err) {
    // Never fail a booking because the confirmation email bounced.
    console.error("Confirmation email failed:", err)
  }
}
