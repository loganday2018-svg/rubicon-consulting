import crypto from "node:crypto"

/**
 * Stateless cancel tokens: base64url(eventId) + "." + HMAC(eventId).
 * No database needed — the signature proves the bearer booked this event.
 */

function secret(): string {
  return process.env.BOOKING_SECRET || "dev-insecure-secret-change-me"
}

export function signEvent(eventId: string): string {
  const sig = crypto.createHmac("sha256", secret()).update(eventId).digest("base64url")
  const id = Buffer.from(eventId).toString("base64url")
  return `${id}.${sig}`
}

export function verifyToken(token: string): string | null {
  const [idPart, sig] = token.split(".")
  if (!idPart || !sig) return null

  const eventId = Buffer.from(idPart, "base64url").toString("utf8")
  const expected = crypto
    .createHmac("sha256", secret())
    .update(eventId)
    .digest("base64url")

  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  return crypto.timingSafeEqual(a, b) ? eventId : null
}
