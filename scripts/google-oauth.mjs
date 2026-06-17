#!/usr/bin/env node
/**
 * One-time: mint a Google Calendar refresh token for the booking system.
 *
 * Prereqs (see docs/booking-setup.md):
 *   - A Google Cloud OAuth client (type: Web application)
 *   - Redirect URI http://localhost:5454/callback added to that client
 *   - Google Calendar API enabled on the project
 *
 * Run (easiest — point it at the JSON you downloaded from the OAuth client):
 *   node scripts/google-oauth.mjs ~/Downloads/client_secret_xxx.json
 * Or with env vars:
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-oauth.mjs
 *
 * It prints an auth URL, you approve in the browser, and it prints the
 * GOOGLE_* env block to paste into Vercel.
 */
import http from "node:http"
import fs from "node:fs"

// Creds come from a downloaded client_secret_*.json (first arg) or env vars.
function loadCreds() {
  const jsonPath = process.argv[2]
  if (jsonPath) {
    const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
    const c = parsed.web || parsed.installed || parsed
    return { id: c.client_id, secret: c.client_secret }
  }
  return { id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET }
}

const { id: CLIENT_ID, secret: CLIENT_SECRET } = loadCreds()
const PORT = 5454
const REDIRECT = `http://localhost:${PORT}/callback`
const SCOPE = "https://www.googleapis.com/auth/calendar"

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Usage: node scripts/google-oauth.mjs <path-to-downloaded-client_secret.json>")
  console.error("   or: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the environment first.")
  process.exit(1)
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  })

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== "/callback") {
    res.writeHead(404).end()
    return
  }

  const code = url.searchParams.get("code")
  if (!code) {
    res.writeHead(400).end("Missing code")
    return
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT,
        grant_type: "authorization_code",
      }),
    })
    const data = await tokenRes.json()

    if (!data.refresh_token) {
      res.writeHead(200).end("No refresh token returned. Revoke access and retry with prompt=consent.")
      console.error("\nNo refresh_token in response:", data)
      server.close()
      return
    }

    res.writeHead(200, { "content-type": "text/html" }).end(
      "<h2>Done. You can close this tab and return to the terminal.</h2>",
    )
    console.log("\n=== Paste these into Vercel -> Settings -> Environment Variables ===")
    console.log("GOOGLE_CLIENT_ID=" + CLIENT_ID)
    console.log("GOOGLE_CLIENT_SECRET=" + CLIENT_SECRET)
    console.log("GOOGLE_REFRESH_TOKEN=" + data.refresh_token)
    console.log("(also add BOOKING_SECRET; optionally BOOKING_TIMEZONE, GOOGLE_CALENDAR_ID)")
    console.log("===================================================================\n")
  } catch (err) {
    res.writeHead(500).end("Token exchange failed")
    console.error(err)
  } finally {
    setTimeout(() => server.close(), 500)
  }
})

server.listen(PORT, () => {
  console.log("\nOpen this URL in your browser and approve access:\n")
  console.log(authUrl.toString())
  console.log(`\nWaiting for the callback on ${REDIRECT} ...`)
})
