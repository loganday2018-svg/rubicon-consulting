import crypto from "node:crypto"

/**
 * Stateless unsubscribe tokens: base64url(email) + "." + HMAC(email).
 * The signature proves the link was issued by us, so nobody can unsubscribe
 * a third party by guessing a URL. Same pattern as lib/booking/token.ts.
 *
 * The SAME secret must be set as UNSUB_SECRET in the email sender (the
 * rubicon-deck-builder pipeline) so the tokens it generates verify here.
 */

function secret(): string {
  return process.env.UNSUB_SECRET || "dev-insecure-unsub-secret-change-me"
}

export function signEmail(email: string): string {
  const e = email.trim().toLowerCase()
  const sig = crypto.createHmac("sha256", secret()).update(e).digest("base64url")
  const id = Buffer.from(e).toString("base64url")
  return `${id}.${sig}`
}

export function verifyEmailToken(token: string): string | null {
  const [idPart, sig] = (token || "").split(".")
  if (!idPart || !sig) return null

  const email = Buffer.from(idPart, "base64url").toString("utf8")
  const expected = crypto.createHmac("sha256", secret()).update(email).digest("base64url")

  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  return crypto.timingSafeEqual(a, b) ? email : null
}
