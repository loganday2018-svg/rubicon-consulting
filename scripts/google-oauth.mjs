#!/usr/bin/env node
/**
 * One-time: mint a Google Calendar refresh token for the booking system.
 *
 * Prereqs (see docs/booking-setup.md):
 *   - A Google Cloud OAuth client (type: Web application)
 *   - Redirect URI http://localhost:5454/callback added to that client
 *   - Google Calendar API enabled on the project
 *
 * Run:
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-oauth.mjs
 *
 * It prints an auth URL, you approve in the browser, and it prints the
 * GOOGLE_REFRESH_TOKEN to paste into Vercel.
 */
import http from "node:http"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const PORT = 5454
const REDIRECT = `http://localhost:${PORT}/callback`
const SCOPE = "https://www.googleapis.com/auth/calendar"

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the environment first.")
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
    console.log("\n=== Add this to Vercel env ===")
    console.log("GOOGLE_REFRESH_TOKEN=" + data.refresh_token)
    console.log("==============================\n")
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
