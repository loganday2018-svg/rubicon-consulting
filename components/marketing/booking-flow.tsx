"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Loader2,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MEETING_TYPES } from "@/lib/booking/config"

interface AvailabilityResult {
  configured: boolean
  timezone: string
  days: { date: string; slots: string[] }[]
}

interface BookResult {
  ok: true
  meetLink: string | null
  start: string
  end: string
}

const visitorTz =
  typeof Intl !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC"

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.95rem] text-foreground outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15"

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

function fmtDayHeading(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function fmtFull(iso: string) {
  return new Date(iso).toLocaleString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function BookingFlow() {
  const [typeId, setTypeId] = useState<string | null>(null)
  const [data, setData] = useState<AvailabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [slot, setSlot] = useState<string | null>(null)

  const [form, setForm] = useState({ name: "", email: "", company: "", notes: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BookResult | null>(null)

  const meetingType = MEETING_TYPES.find((t) => t.id === typeId)

  useEffect(() => {
    if (!typeId) return
    let active = true
    setLoading(true)
    setData(null)
    setSlot(null)
    fetch(`/api/availability?type=${typeId}`)
      .then((r) => r.json())
      .then((d) => active && setData(d))
      .catch(() => active && setError("Could not load times. Try again."))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [typeId])

  // Re-group slots by the visitor's local day (transport groups them by host day).
  const dayGroups = useMemo(() => {
    if (!data) return []
    const flat = data.days.flatMap((d) => d.slots)
    const map = new Map<string, string[]>()
    for (const iso of flat) {
      const key = new Date(iso).toLocaleDateString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      const arr = map.get(key) ?? []
      arr.push(iso)
      map.set(key, arr)
    }
    return [...map.values()]
      .map((slots) => slots.sort())
      .sort((a, b) => a[0].localeCompare(b[0]))
  }, [data])

  async function submit() {
    if (!slot || !meetingType) return
    setStatus("submitting")
    setError(null)
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: meetingType.id, start: slot, ...form }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.")
        setStatus("idle")
        // If the slot was taken, drop it so they re-pick.
        if (res.status === 409) setSlot(null)
        return
      }
      setResult(json)
      setStatus("done")
    } catch {
      setError("Network error. Please try again.")
      setStatus("idle")
    }
  }

  // ---- Confirmation ----
  if (status === "done" && result) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Check className="text-primary" size={24} />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
          You&apos;re booked
        </h2>
        <p className="mt-2 text-slate-600">{fmtFull(result.start)}</p>
        <p className="mt-1 text-sm text-slate-500">
          A calendar invite is on its way to {form.email}.
        </p>
        {result.meetLink && (
          <div className="mt-6">
            <Button
              size="lg"
              render={
                <a href={result.meetLink} target="_blank" rel="noopener noreferrer" />
              }
            >
              <Video size={16} />
              Join Google Meet
            </Button>
          </div>
        )}
      </div>
    )
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step 1 — meeting type */}
      <fieldset className="grid gap-3 sm:grid-cols-3">
        {MEETING_TYPES.map((t) => {
          const selected = t.id === typeId
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setTypeId(t.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-slate-200 bg-white hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock size={13} />
                {t.duration} min
              </div>
              <div className="mt-1.5 font-semibold text-foreground">{t.label}</div>
              <p className="mt-1 text-sm leading-snug text-slate-500">
                {t.description}
              </p>
            </button>
          )
        })}
      </fieldset>

      {/* Step 2 — pick a time */}
      {typeId && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Calendar size={16} className="text-primary" />
              Pick a time
            </h2>
            <span className="text-xs text-slate-400">Times in {visitorTz}</span>
          </div>

          {data && !data.configured && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Preview mode — these times go live once the calendar is connected.
            </p>
          )}

          {loading && (
            <div className="mt-6 flex items-center gap-2 text-slate-500">
              <Loader2 size={16} className="animate-spin" />
              Loading availability…
            </div>
          )}

          {data && !loading && dayGroups.length === 0 && (
            <p className="mt-6 text-slate-500">
              No open times in the next few weeks. Email us and we&apos;ll find a slot.
            </p>
          )}

          {!loading && dayGroups.length > 0 && (
            <div className="mt-4 space-y-5">
              {dayGroups.map((slots) => (
                <div key={slots[0]}>
                  <h3 className="text-sm font-medium text-slate-500">
                    {fmtDayHeading(slots[0])}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {slots.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        aria-pressed={slot === iso}
                        onClick={() => setSlot(iso)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          slot === iso
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {fmtTime(iso)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — details */}
      {slot && meetingType && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Your details</h2>
            <button
              type="button"
              onClick={() => setSlot(null)}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Change time
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {meetingType.label} · {fmtFull(slot)}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                autoComplete="name"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                autoComplete="email"
              />
            </Field>
            <Field label="Company" className="sm:col-span-2">
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputClass}
                autoComplete="organization"
              />
            </Field>
            <Field label="What do you want to cover?" className="sm:col-span-2">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <div className="mt-5">
            <Button
              size="lg"
              disabled={!form.name || !emailValid || status === "submitting"}
              onClick={submit}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Booking…
                </>
              ) : (
                `Confirm ${meetingType.label}`
              )}
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-slate-200, #e2e8f0);
          background: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 0.95rem;
          color: var(--foreground);
          outline: none;
        }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklch, var(--primary) 15%, transparent); }
      `}</style>
    </div>
  )
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  )
}
