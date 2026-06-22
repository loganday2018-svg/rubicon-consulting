/**
 * Suppression store. Persists opt-outs to a Supabase table `unsubscribes`
 * (email text primary key, source text, unsubscribed_at timestamptz) via the
 * REST API. Degrades gracefully when not configured, like booking's
 * isGoogleConfigured() guard: the route still confirms to the user and emails
 * a notification, so no opt-out is ever lost.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

export function isSuppressionConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY)
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...extra,
  }
}

/** Upsert an opt-out. Returns true if persisted. */
export async function addUnsubscribe(email: string, source = "web"): Promise<boolean> {
  if (!isSuppressionConfigured()) return false
  const e = email.trim().toLowerCase()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/unsubscribes`, {
    method: "POST",
    headers: headers({
      "Content-Type": "application/json",
      // upsert on the email primary key
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify({
      email: e,
      source,
      unsubscribed_at: new Date().toISOString(),
    }),
  })
  return res.ok
}

/** True if this address has opted out. */
export async function isUnsubscribed(email: string): Promise<boolean> {
  if (!isSuppressionConfigured()) return false
  const e = encodeURIComponent(email.trim().toLowerCase())
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/unsubscribes?email=eq.${e}&select=email`,
    { headers: headers() },
  )
  if (!res.ok) return false
  const rows = await res.json()
  return Array.isArray(rows) && rows.length > 0
}
