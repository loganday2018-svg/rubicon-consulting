import { DateTime } from "luxon"
import { AVAILABILITY, bookingTimezone, type MeetingType } from "./config"
import { getBusy, isGoogleConfigured, type BusyInterval } from "./google"

export interface DaySlots {
  /** yyyy-mm-dd in the host timezone. */
  date: string
  /** Slot start times as UTC ISO strings; the client renders them in the visitor's zone. */
  slots: string[]
}

export interface AvailabilityResult {
  configured: boolean
  timezone: string
  days: DaySlots[]
}

interface BusyMs {
  start: number
  end: number
}

function toBusyMs(busy: BusyInterval[]): BusyMs[] {
  return busy.map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }))
}

/** Does [startMs, endMs] collide with any busy interval, padded by the buffer? */
function overlapsBusy(startMs: number, endMs: number, busy: BusyMs[]): boolean {
  const pad = AVAILABILITY.bufferMin * 60_000
  return busy.some((b) => startMs < b.end + pad && endMs > b.start - pad)
}

/** Generate the bookable slot starts (UTC ISO) for one calendar day. */
function generateDaySlots(
  day: DateTime,
  durationMin: number,
  earliestMs: number,
  busy: BusyMs[],
): string[] {
  const weekday = day.weekday // 1 = Mon … 7 = Sun
  const windows = AVAILABILITY.weekly[weekday] ?? []
  const slots: string[] = []

  for (const [from, to] of windows) {
    const [fh, fm] = from.split(":").map(Number)
    const [th, tm] = to.split(":").map(Number)
    let cursor = day.set({ hour: fh, minute: fm, second: 0, millisecond: 0 })
    const windowEnd = day.set({ hour: th, minute: tm, second: 0, millisecond: 0 })

    while (cursor.plus({ minutes: durationMin }) <= windowEnd) {
      const startMs = cursor.toMillis()
      const endMs = cursor.plus({ minutes: durationMin }).toMillis()
      if (startMs >= earliestMs && !overlapsBusy(startMs, endMs, busy)) {
        slots.push(cursor.toUTC().toISO()!)
      }
      cursor = cursor.plus({ minutes: durationMin })
    }
  }

  return slots
}

/** Open slots for a meeting type across the booking window. */
export async function getAvailability(
  type: MeetingType,
): Promise<AvailabilityResult> {
  const tz = bookingTimezone()
  const configured = isGoogleConfigured()
  const now = DateTime.now().setZone(tz)
  const earliestMs = now.plus({ hours: AVAILABILITY.minNoticeHours }).toMillis()
  const startDay = now.startOf("day")
  const endDay = startDay.plus({ days: AVAILABILITY.windowDays })

  let busy: BusyMs[] = []
  if (configured) {
    busy = toBusyMs(
      await getBusy(startDay.toUTC().toISO()!, endDay.toUTC().toISO()!),
    )
  }

  const days: DaySlots[] = []
  for (let i = 0; i < AVAILABILITY.windowDays; i++) {
    const day = startDay.plus({ days: i })
    const slots = generateDaySlots(day, type.duration, earliestMs, busy)
    if (slots.length > 0) {
      days.push({ date: day.toISODate()!, slots })
    }
  }

  return { configured, timezone: tz, days }
}

/**
 * Re-validate a specific slot at booking time: confirms it sits on the grid,
 * respects min-notice, and is still free against a fresh free/busy query.
 * Guards against stale UIs and double-booking races.
 */
export async function isSlotBookable(
  type: MeetingType,
  startISO: string,
): Promise<boolean> {
  const tz = bookingTimezone()
  const start = DateTime.fromISO(startISO).setZone(tz)
  if (!start.isValid) return false

  const now = DateTime.now().setZone(tz)
  const earliestMs = now.plus({ hours: AVAILABILITY.minNoticeHours }).toMillis()
  const endDay = now.startOf("day").plus({ days: AVAILABILITY.windowDays })
  if (start > endDay) return false

  const day = start.startOf("day")
  const endMs = start.plus({ minutes: type.duration }).toMillis()

  // Fresh busy query bounded to this slot's neighborhood.
  let busy: BusyMs[] = []
  if (isGoogleConfigured()) {
    const pad = (AVAILABILITY.bufferMin + 1) * 60_000
    busy = toBusyMs(
      await getBusy(
        new Date(start.toMillis() - pad).toISOString(),
        new Date(endMs + pad).toISOString(),
      ),
    )
  }

  const slots = generateDaySlots(day, type.duration, earliestMs, busy)
  return slots.includes(start.toUTC().toISO()!)
}
