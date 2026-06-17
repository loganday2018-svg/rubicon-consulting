"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CancelBooking({ token }: { token?: string }) {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  if (!token) {
    return (
      <p className="text-slate-600">
        This cancellation link is missing or invalid.
      </p>
    )
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 text-foreground">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Check size={18} className="text-primary" />
        </span>
        Your meeting has been cancelled.
      </div>
    )
  }

  async function cancel() {
    setStatus("working")
    setError(null)
    try {
      const res = await fetch("/api/book/cancel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Could not cancel.")
        setStatus("idle")
        return
      }
      setStatus("done")
    } catch {
      setError("Network error. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <div>
      <p className="text-slate-600">
        Cancel this meeting? The host will be notified and the calendar invite removed.
      </p>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-5">
        <Button variant="destructive" disabled={status === "working"} onClick={cancel}>
          {status === "working" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Cancelling…
            </>
          ) : (
            "Cancel meeting"
          )}
        </Button>
      </div>
    </div>
  )
}
