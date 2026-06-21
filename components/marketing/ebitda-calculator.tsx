"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CTA } from "@/lib/constants"
import { RollingDollars } from "@/components/marketing/motion-kit"

function formatDollars(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return m % 1 === 0 ? `$${m.toFixed(0)}M` : `$${m.toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

const PRESETS = [
  { label: "Parts Distributor", revenue: 38_000_000, cogs: 30_000_000, sga: 5_500_000 },
  { label: "Parts Manufacturer", revenue: 55_000_000, cogs: 36_000_000, sga: 11_000_000 },
  { label: "Truck & Aftermarket", revenue: 72_000_000, cogs: 54_000_000, sga: 11_000_000 },
] as const

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  suffix?: string
  hint?: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-foreground">
          {suffix ? `${value}${suffix}` : formatDollars(value)}
        </span>
      </div>
      {hint && <p className="mb-2 text-xs text-slate-400">{hint}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-primary"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{suffix ? `${min}${suffix}` : formatDollars(min)}</span>
        <span>{suffix ? `${max}${suffix}` : formatDollars(max)}</span>
      </div>
    </div>
  )
}

// A single before/after bar.
function Bar({
  label,
  value,
  max,
  highlight,
}: {
  label: string
  value: number
  max: number
  highlight?: boolean
}) {
  const width = Math.max((value / max) * 100, 3)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={highlight ? "font-semibold text-foreground" : "text-slate-500"}>
          {label}
        </span>
        <span className={highlight ? "font-semibold text-foreground" : "text-slate-500"}>
          {formatDollars(value)}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            highlight ? "bg-primary" : "bg-slate-300"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export function EbitdaCalculator() {
  const [revenue, setRevenue] = useState(38_000_000)
  const [cogs, setCogs] = useState(30_000_000)
  const [sga, setSga] = useState(5_500_000)
  const [activePreset, setActivePreset] = useState<number>(0)

  // Lever percentages people play with.
  const [sales, setSales] = useState(3) // revenue lift %
  const [lean, setLean] = useState(12) // overhead reduction %
  const [supply, setSupply] = useState(4) // COGS reduction %

  function applyPreset(index: number) {
    const p = PRESETS[index]
    setRevenue(p.revenue)
    setCogs(p.cogs)
    setSga(p.sga)
    setActivePreset(index)
  }

  const isValid = revenue > 0 && cogs > 0 && sga > 0 && revenue > cogs + sga

  const r = useMemo(() => {
    if (!isValid) return null
    const currentEbitda = revenue - cogs - sga
    const currentMargin = (currentEbitda / revenue) * 100
    const cogsRatio = cogs / revenue

    const g = sales / 100
    const e = lean / 100
    const s = supply / 100

    const newRevenue = revenue * (1 + g)
    const newCogs = newRevenue * cogsRatio * (1 - s) // COGS scales with revenue, then trimmed
    const newSga = sga * (1 - e)
    const newEbitda = newRevenue - newCogs - newSga
    const newMargin = (newEbitda / newRevenue) * 100

    return {
      currentEbitda,
      currentMargin,
      newEbitda,
      newMargin,
      delta: newEbitda - currentEbitda,
      marginPts: newMargin - currentMargin,
    }
  }, [isValid, revenue, cogs, sga, sales, lean, supply])

  return (
    <div>
      <p className="mb-4 text-center text-xs text-slate-400">
        Illustrative estimates based on industry benchmarks. Actual impact varies by company and implementation scope.
      </p>

      {/* Industry presets */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => applyPreset(i)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              activePreset === i
                ? "border-primary bg-primary text-primary-foreground"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {p.label}
            <span className="ml-1.5 text-xs opacity-70">{formatDollars(p.revenue)} rev</span>
          </button>
        ))}
      </div>

      {/* Your numbers */}
      <div className="mx-auto max-w-lg space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Your numbers
        </p>
        <Slider
          label="Annual Revenue"
          value={revenue}
          onChange={(v) => { setRevenue(v); setActivePreset(-1) }}
          min={10_000_000}
          max={200_000_000}
          step={1_000_000}
        />
        <Slider
          label="Cost of Goods Sold"
          value={cogs}
          onChange={(v) => { setCogs(v); setActivePreset(-1) }}
          min={1_000_000}
          max={revenue * 0.9}
          step={1_000_000}
        />
        <Slider
          label="Operating Costs (SG&A)"
          value={sga}
          onChange={(v) => { setSga(v); setActivePreset(-1) }}
          min={500_000}
          max={Math.max(revenue - cogs - 1_000_000, 1_000_000)}
          step={500_000}
        />
      </div>

      {r && (
        <>
          {/* Current EBITDA */}
          <div className="mx-auto mt-10 max-w-lg rounded-lg bg-slate-100 p-4 text-center sm:p-6">
            <p className="text-sm font-medium text-slate-500">Where you are today</p>
            <p className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
              <RollingDollars value={r.currentEbitda} format={formatDollars} /> EBITDA
            </p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {formatPercent(r.currentMargin)} margin on {formatDollars(revenue)} revenue
            </p>
          </div>

          {/* Levers */}
          <div className="mx-auto mt-12 max-w-lg space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">
                Now move the levers
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Drag each one and watch what it does to your bottom line.
              </p>
            </div>
            <Slider
              label="Win more orders"
              hint="Faster quotes and more leads lift revenue."
              value={sales}
              onChange={setSales}
              min={0}
              max={15}
              step={1}
              suffix="%"
            />
            <Slider
              label="Run leaner"
              hint="Automate the manual work and reclaim overhead."
              value={lean}
              onChange={setLean}
              min={0}
              max={25}
              step={1}
              suffix="%"
            />
            <Slider
              label="Tighten the supply chain"
              hint="Fewer stockouts and smarter buys cut your cost of goods."
              value={supply}
              onChange={setSupply}
              min={0}
              max={10}
              step={1}
              suffix="%"
            />
          </div>

          {/* Result */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-2">
            <div className="flex flex-col justify-center gap-4">
              <Bar label="Today" value={r.currentEbitda} max={r.newEbitda} />
              <Bar label="With these changes" value={r.newEbitda} max={r.newEbitda} highlight />
            </div>
            <div className="flex flex-col justify-center border-t border-slate-200 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="text-sm font-medium text-slate-500">New EBITDA</p>
              <p className="text-4xl font-bold text-foreground sm:text-5xl">
                <RollingDollars value={r.newEbitda} format={formatDollars} />
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-600">
                +{formatDollars(r.delta)} a year
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {formatPercent(r.newMargin)} margin, up {r.marginPts.toFixed(1)} points
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" render={<a href={CTA.primary.href} target="_blank" rel="noopener noreferrer" />}>
              Run These on Your Numbers
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
