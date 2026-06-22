"use client"

import { useState } from "react"

export function UnsubscribeForm({
  token,
  email: initialEmail,
}: {
  token?: string
  email?: string
}) {
  const [email, setEmail] = useState(initialEmail || "")
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [msg, setMsg] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState("loading")
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { t: token } : { email }),
      })
      const data = await res.json()
      if (res.ok) {
        setState("done")
      } else {
        setState("error")
        setMsg(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setState("error")
      setMsg("Network error. Please try again.")
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <p className="text-lg font-semibold text-foreground">You&apos;re unsubscribed.</p>
        <p className="mt-2 text-slate-600">
          {email ? `${email} won't ` : "You won't "}
          receive any more emails from us. It can take a little while to clear any
          already-scheduled messages.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-8">
      {!token && (
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-foreground outline-none focus:border-primary"
        />
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "loading" ? "Unsubscribing..." : "Confirm unsubscribe"}
      </button>
      {state === "error" && <p className="mt-3 text-sm text-red-600">{msg}</p>}
    </form>
  )
}
