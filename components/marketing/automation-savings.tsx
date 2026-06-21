"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import Link from "next/link"
import { CTA } from "@/lib/constants"

// Rough US averages (salary / 2,080 work hours). Easy to tweak.
const ROLES = [
  { key: "Customer service", salary: 42000 },
  { key: "Bookkeeper / AP-AR", salary: 50000 },
  { key: "Inside sales", salary: 55000 },
  { key: "Purchasing / buyer", salary: 65000 },
  { key: "Operations manager", salary: 85000 },
  { key: "Controller", salary: 95000 },
] as const

const HOURS_PER_YEAR = 2080
const toHourly = (salary: number) => Math.round(salary / HOURS_PER_YEAR)

// Where the reclaimed hours tend to go, rotated for a bit of life.
const HIGHER_VALUE = [
  "covering the counter",
  "coaching your team",
  "winning the next quote",
  "chasing fewer fires",
  "getting orders out the door",
]

function useCountUp(target: number, duration = 450) {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)
  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(from + (target - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])
  return val
}

export function AutomationSavings() {
  const [hours, setHours] = useState(1)
  const [hourly, setHourly] = useState(toHourly(ROLES[0].salary))

  const hoursYear = hours * 52
  const dollars = Math.round(hoursYear * hourly)
  const workWeeks = hoursYear / 40
  const activeRole = ROLES.find((r) => toHourly(r.salary) === hourly)?.key ?? null

  const animHours = useCountUp(hoursYear)
  const animDollars = useCountUp(dollars)

  // Soft pulse on the result card whenever an input changes (skip first render).
  const pulse = useAnimationControls()
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    pulse.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    })
  }, [hoursYear, hourly, pulse])

  const fmtHours = hours % 1 === 0 ? hours.toString() : hours.toFixed(1)

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-sm font-semibold text-slate-800">
              Hours automated each week
            </label>
            <span className="text-sm font-semibold text-primary">
              {fmtHours} hr{hours === 1 ? "" : "s"}/wk
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-slate-900"
            aria-label="Hours automated each week"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-800">
            Whose time is it?
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => {
              const active = activeRole === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setHourly(toHourly(r.salary))}
                  className={
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                    (active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-600 hover:border-slate-300")
                  }
                >
                  {r.key}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-sm font-semibold text-slate-800">
              Hourly cost
            </label>
            <span className="text-sm font-semibold text-primary">
              ${hourly}/hr{activeRole ? "" : " (custom)"}
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={120}
            step={1}
            value={hourly}
            onChange={(e) => setHourly(Number(e.target.value))}
            className="w-full accent-slate-900"
            aria-label="Hourly cost"
          />
        </div>
      </div>

      {/* Result */}
      <motion.div
        animate={pulse}
        className="flex flex-col justify-center rounded-xl bg-primary p-6 text-primary-foreground md:p-8"
      >
        <div>
          <p className="text-4xl font-bold tracking-tight md:text-5xl">
            {Math.round(animHours).toLocaleString()} hrs
          </p>
          <p className="mt-1 text-sm text-slate-300">back every year</p>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-bold tracking-tight md:text-5xl">
            ${Math.round(animDollars).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-slate-300">of that time, valued per year</p>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-slate-300">
          That is about {workWeeks.toFixed(1)} work weeks back, for{" "}
          {HIGHER_VALUE[Math.min(Math.floor(hours), HIGHER_VALUE.length - 1)]} and
          the higher-value work only your people can do.
        </p>
        <Link
          href={CTA.primary.href}
          className="mt-7 inline-flex w-fit items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-slate-100"
        >
          Book a call
          <span aria-hidden>&rarr;</span>
        </Link>
      </motion.div>
    </div>
  )
}
