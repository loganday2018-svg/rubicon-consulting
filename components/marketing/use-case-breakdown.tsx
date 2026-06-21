"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, TrendingUp, DollarSign, Cog, Users, Scale, Headphones } from "lucide-react"

const FUNCTIONS = [
  {
    icon: DollarSign,
    label: "Cost Reporting & Finance",
    impact: "Hours back every week",
    useCases: [
      "The weekly labor, freight, and parts cost report built in a minute, not an hour",
      "Numbers reconciled across systems without the manual copy-paste",
      "Month-end commentary and variance drafts done the same day",
      "Anomalies in cost lines flagged before anyone has to go looking",
      "Plain-English answers from your own cost data, no pivot table required",
    ],
  },
  {
    icon: Cog,
    label: "Inventory & Parts Across Locations",
    impact: "Fewer line-down surprises",
    useCases: [
      "Short at one branch and sitting at another, flagged before a line stops",
      "Reorder points and stock transfers surfaced automatically across locations",
      "Messy inventory exports turned into clear moves your team can act on",
      "Slow and dead stock called out before it ties up more cash",
      "Demand patterns read off your own history, not a guess",
    ],
  },
  {
    icon: TrendingUp,
    label: "Quote & Order Desk",
    impact: "Faster turnaround",
    useCases: [
      "Customer quotes drafted from your catalog and pricing in seconds",
      "RFQs read and priced without the front office digging for line items",
      "Cross-references and parts lookups answered instantly",
      "Order entry and data cleanup that used to tie up your people",
      "Quote follow-ups drafted so nothing sits in a pile",
    ],
  },
  {
    icon: Scale,
    label: "Purchasing & Vendors",
    impact: "Margin recovered",
    useCases: [
      "Every cost line benchmarked against the market without hiring a consultant",
      "Same part, different vendor prices across the business, flagged instantly",
      "Vendor contracts read for terms, renewals, and price changes in seconds",
      "POs checked against quotes and agreed pricing before they go out",
      "Vendor price-increase letters summarized so you know what actually moved",
    ],
  },
  {
    icon: Users,
    label: "Shop Floor / Production",
    impact: "Less paperwork, steadier yield",
    useCases: [
      "Work-order paperwork and travelers drafted from the job, not retyped",
      "Scrap and yield trends pulled together so problems show up early",
      "Production schedules built around real capacity and due dates",
      "Standard work and process notes written up from how the job actually runs",
      "Shift and run summaries drafted from the day's numbers",
    ],
  },
  {
    icon: Headphones,
    label: "Customer & Counter Service",
    impact: "Quicker answers",
    useCases: [
      "Parts lookups and fitment questions answered from your catalog",
      "Order status pulled together so the counter is not on hold with the back office",
      "Returns and RMA paperwork drafted from a few details",
      "Common customer questions answered the same way every time",
      "Routine emails and order confirmations drafted for a quick review",
    ],
  },
] as const

export function UseCaseBreakdown() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          What Drives These Numbers
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
          Specific AI workflows mapped to the jobs your team does by hand inside
          a parts manufacturer or distributor. This is what we set up.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {FUNCTIONS.map((fn, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={fn.label}
              className={`rounded-lg border bg-white transition-all duration-300 ${
                isOpen
                  ? "border-primary/30 bg-gradient-to-br from-white via-slate-50 to-primary/[0.04] shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center gap-4 px-6 py-4 text-left"
              >
                <span className="flex shrink-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`font-mono text-xs tabular-nums transition-colors duration-300 ${
                      isOpen ? "text-primary/70" : "text-slate-300"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    animate={
                      isOpen
                        ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <fn.icon className="size-5 text-primary" />
                  </motion.span>
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-foreground">{fn.label}</span>
                  <span className="ml-3 text-xs text-slate-400">{fn.impact}</span>
                </div>
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform ${
                    isOpen ? "rotate-180 text-primary" : "text-slate-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2 border-t border-slate-100 px-6 py-4">
                      {fn.useCases.map((uc) => (
                        <li
                          key={uc}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          {uc}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
