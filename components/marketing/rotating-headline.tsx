"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const HEADLINES = [
  "Do More With Less",
  "Save Hours Every Week",
  "Find Money in Your Costs",
  "Free Up Your Best People",
  "Put Out Better Work, Faster",
]

const INTERVAL = 4500

interface RotatingHeadlineProps {
  className?: string
}

export function RotatingHeadline({ className }: RotatingHeadlineProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Advance on a plain timer. No per-frame state, so the headline's
  // entrance animation is never interrupted by a re-render (which used to
  // leave it stuck at opacity 0 on load).
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADLINES.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [paused])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h1 className={className}>
        <span className="mb-3 block text-lg font-semibold tracking-wide text-slate-400 md:mb-4 md:text-2xl">
          We Help You
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="block text-white"
          >
            {HEADLINES[index]}
          </motion.span>
        </AnimatePresence>
      </h1>

      {/* Progress bar: a pure CSS scaleX animation, restarted each cycle
          via the key. Pauses on hover with the parent. */}
      <div className="mt-6 h-0.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
        <div
          key={index}
          className="rh-progress h-full w-full rounded-full bg-gradient-to-r from-white/60 to-white/30"
          style={{
            animationDuration: `${INTERVAL}ms`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  )
}
