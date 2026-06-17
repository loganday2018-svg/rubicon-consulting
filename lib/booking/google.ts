/**
 * Minimal Google Calendar client using the REST API + a stored OAuth refresh
 * token. Server-only: only import this from route handlers, never the client.
 *
 * Required env:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 * Optional:
 *   GOOGLE_CALENDAR_ID  (default "primary")
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const CAL_BASE = "https://www.googleapis.com/calendar/v3"

export interface BusyInterval {
  start: string // RFC3339
  end: string
}

export interface CreatedEvent {
  id: string
  hangoutLink?: string
  htmlLink?: string
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  )
}

function calendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || "primary"
}

// Cached across warm serverless invocations.
let tokenCache: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  })

  if (!res.ok) {
    throw new Error(`Google token refresh failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return data.access_token
}

/** Busy intervals on the host calendar between two RFC3339 instants. */
export async function getBusy(
  timeMin: string,
  timeMax: string,
): Promise<BusyInterval[]> {
  const token = await getAccessToken()
  const res = await fetch(`${CAL_BASE}/freeBusy`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calendarId() }],
    }),
  })

  if (!res.ok) {
    throw new Error(`freeBusy failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as {
    calendars: Record<string, { busy: BusyInterval[] }>
  }
  return data.calendars[calendarId()]?.busy ?? []
}

export async function createEvent(input: {
  summary: string
  description: string
  startISO: string
  endISO: string
  timeZone: string
  attendeeEmail: string
  attendeeName?: string
  requestId: string
}): Promise<CreatedEvent> {
  const token = await getAccessToken()
  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(
      calendarId(),
    )}/events?sendUpdates=all&conferenceDataVersion=1`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startISO, timeZone: input.timeZone },
        end: { dateTime: input.endISO, timeZone: input.timeZone },
        attendees: [
          { email: input.attendeeEmail, displayName: input.attendeeName },
        ],
        conferenceData: {
          createRequest: {
            requestId: input.requestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: { useDefault: true },
      }),
    },
  )

  if (!res.ok) {
    throw new Error(`event insert failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as CreatedEvent
  return data
}

/** Cancel a booking by deleting its calendar event (notifies the attendee). */
export async function deleteEvent(eventId: string): Promise<void> {
  const token = await getAccessToken()
  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(
      calendarId(),
    )}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    { method: "DELETE", headers: { authorization: `Bearer ${token}` } },
  )

  // 410 = already deleted; treat as success.
  if (!res.ok && res.status !== 410) {
    throw new Error(`event delete failed: ${res.status} ${await res.text()}`)
  }
}
