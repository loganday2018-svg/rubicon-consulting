/**
 * Booking configuration. No secrets here — safe to import on the client.
 * Availability is enforced server-side in lib/booking/availability.ts; this file
 * only declares the rules and the menu of meeting types.
 */

export interface MeetingType {
  id: string
  label: string
  /** Length in minutes. */
  duration: number
  description: string
}

export const MEETING_TYPES: MeetingType[] = [
  {
    id: "intro",
    label: "Intro Call",
    duration: 15,
    description: "A quick hello to see whether there's a fit.",
  },
  {
    id: "deep-dive",
    label: "Deep Dive",
    duration: 30,
    description: "Talk through your stack and where AI actually helps.",
  },
  {
    id: "demo",
    label: "Live Demo",
    duration: 60,
    description: "A full walkthrough with your team in the room.",
  },
]

export function getMeetingType(id: string): MeetingType | undefined {
  return MEETING_TYPES.find((t) => t.id === id)
}

/** "HH:MM" 24h windows of available time, keyed by ISO weekday (1 = Mon … 7 = Sun). */
export type WeeklyAvailability = Record<number, [string, string][]>

export const AVAILABILITY = {
  /** Host timezone. Overridable at runtime via BOOKING_TIMEZONE. */
  defaultTimezone: "America/Chicago",
  /** Mon–Fri, 8:00–18:00. Edit freely. */
  weekly: {
    1: [["08:00", "18:00"]],
    2: [["08:00", "18:00"]],
    3: [["08:00", "18:00"]],
    4: [["08:00", "18:00"]],
    5: [["08:00", "18:00"]],
  } as WeeklyAvailability,
  /** Gap kept clear on both sides of an existing event, in minutes. */
  bufferMin: 15,
  /** Soonest a visitor can book from now, in hours. */
  minNoticeHours: 4,
  /** How far ahead bookings are offered, in days. */
  windowDays: 21,
} as const

export function bookingTimezone(): string {
  return process.env.BOOKING_TIMEZONE || AVAILABILITY.defaultTimezone
}
