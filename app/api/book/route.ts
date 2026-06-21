import { DateTime } from "luxon"
import { BRAND } from "@/lib/constants"
import { bookingTimezone, getMeetingType } from "@/lib/booking/config"
import { isSlotBookable } from "@/lib/booking/availability"
import { createEvent, isGoogleConfigured } from "@/lib/booking/google"
import { signEvent } from "@/lib/booking/token"
import { sendConfirmation } from "@/lib/booking/email"

export const dynamic = "force-dynamic"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  if (!isGoogleConfigured()) {
    return Response.json(
      { error: "Booking isn't connected yet. Please email " + BRAND.email },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const typeId = String(body.type ?? "")
  const start = String(body.start ?? "")
  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const company = String(body.company ?? "").trim()
  const notes = String(body.notes ?? "").trim()

  const type = getMeetingType(typeId)
  if (!type) return Response.json({ error: "Unknown meeting type." }, { status: 400 })
  if (!name) return Response.json({ error: "Name is required." }, { status: 400 })
  if (!EMAIL_RE.test(email))
    return Response.json({ error: "A valid email is required." }, { status: 400 })

  const startDt = DateTime.fromISO(start)
  if (!startDt.isValid)
    return Response.json({ error: "Invalid time." }, { status: 400 })

  // Re-check the slot against a fresh free/busy query (stale UI / race guard).
  if (!(await isSlotBookable(type, start))) {
    return Response.json(
      { error: "That time was just taken. Please pick another." },
      { status: 409 },
    )
  }

  const tz = bookingTimezone()
  const endISO = startDt.plus({ minutes: type.duration }).toISO()!
  const requestId = `rubicon-${startDt.toMillis()}-${Math.random().toString(36).slice(2, 10)}`

  try {
    const event = await createEvent({
      summary: `${type.label}: ${BRAND.name} × ${name}`,
      description:
        `${type.label} booked via ${BRAND.domain}\n\n` +
        `Name: ${name}\nEmail: ${email}\nCompany: ${company || "(none)"}\n\n` +
        `Notes:\n${notes || "(none)"}`,
      startISO: start,
      endISO,
      timeZone: tz,
      attendeeEmail: email,
      attendeeName: name,
      ownerEmail: process.env.BOOKING_OWNER_EMAIL || BRAND.email,
      requestId,
    })

    const token = signEvent(event.id)
    const cancelUrl = `https://${BRAND.domain}/book/cancel?token=${encodeURIComponent(token)}`
    const whenLabel = startDt.setZone(tz).toFormat("cccc, LLLL d 'at' h:mm a (ZZZZ)")

    await sendConfirmation({
      to: email,
      name,
      meetingLabel: type.label,
      whenLabel,
      meetLink: event.hangoutLink,
      cancelUrl,
    })

    return Response.json({
      ok: true,
      eventId: event.id,
      cancelToken: token,
      meetLink: event.hangoutLink ?? null,
      start,
      end: endISO,
    })
  } catch (err) {
    console.error("booking error:", err)
    return Response.json(
      { error: "Could not create the booking. Please try again." },
      { status: 500 },
    )
  }
}
