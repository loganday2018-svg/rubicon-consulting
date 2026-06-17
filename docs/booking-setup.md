# Booking setup (native scheduler)

The `/book` page is a self-service scheduler backed by your Google Calendar — no
third-party tool, no database. Availability comes from a free/busy query; each
booking becomes a calendar event with an auto-generated Google Meet link.

It ships in **preview mode** until the env vars below are set: the page renders
and shows config-based times, but submitting returns a friendly "not connected"
message. Connect the calendar to make it live.

## 1. Google Cloud project

1. Go to <https://console.cloud.google.com/> and create a project (e.g. "Rubicon Booking").
2. **APIs & Services → Library →** enable **Google Calendar API**.
3. **APIs & Services → OAuth consent screen:** choose **Internal** (you have a
   `rubiconaiconsulting.com` Workspace, so Internal skips Google verification).
   Fill app name + support email. Add scope `.../auth/calendar`.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID:**
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:5454/callback`
   - Save the **Client ID** and **Client secret**.

## 2. Mint a refresh token (one time)

Download the client's JSON (the **Download JSON** button shown when the client is
created, or the download icon on the Clients list). Then, from the repo root:

```bash
node scripts/google-oauth.mjs path/to/client_secret_xxx.json
```

Open the printed URL, approve access with the Google account whose calendar you
want bookings on. The script prints a ready-to-paste `GOOGLE_CLIENT_ID` /
`GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` block. (You never type the secret
by hand — it's read from the JSON.)

## 3. Set Vercel environment variables

In **Vercel → rubicon-consulting → Settings → Environment Variables** add (see
`.env.example`):

| Variable | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | from step 1 |
| `GOOGLE_CLIENT_SECRET` | from step 1 |
| `GOOGLE_REFRESH_TOKEN` | from step 2 |
| `GOOGLE_CALENDAR_ID` | `primary` (or a specific calendar id) |
| `BOOKING_TIMEZONE` | e.g. `America/Chicago` |
| `BOOKING_SECRET` | `openssl rand -hex 32` |
| `RESEND_API_KEY` | optional — branded confirmation email |
| `BOOKING_FROM_EMAIL` | optional — e.g. `Rubicon <hello@rubiconaiconsulting.com>` |

Redeploy. The amber "preview mode" banner disappears once the three `GOOGLE_*`
values are present.

## 4. Adjust availability

Edit `lib/booking/config.ts`:
- `MEETING_TYPES` — durations + labels (Intro 15, Deep Dive 30, Demo 60).
- `AVAILABILITY.weekly` — working hours per weekday.
- `bufferMin`, `minNoticeHours`, `windowDays`.

## 5. Go live

Once a real booking works end to end, repoint the site's "Book a Call" button
from Cal.com to `/book` in `lib/constants.ts` (`CTA.primary.href`).
