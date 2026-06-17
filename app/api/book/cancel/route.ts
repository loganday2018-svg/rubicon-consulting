import { deleteEvent, isGoogleConfigured } from "@/lib/booking/google"
import { verifyToken } from "@/lib/booking/token"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isGoogleConfigured()) {
    return Response.json({ error: "Booking isn't connected." }, { status: 503 })
  }

  let token = ""
  try {
    token = String(((await request.json()) as { token?: unknown }).token ?? "")
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const eventId = verifyToken(token)
  if (!eventId) {
    return Response.json({ error: "Invalid or expired link." }, { status: 400 })
  }

  try {
    await deleteEvent(eventId)
    return Response.json({ ok: true })
  } catch (err) {
    console.error("cancel error:", err)
    return Response.json({ error: "Could not cancel. Please try again." }, { status: 500 })
  }
}
