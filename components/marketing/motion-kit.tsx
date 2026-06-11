"use client"

import { useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"

/**
 * Shared motion language for the site: weighty, drawn, upward — value
 * compounding, never bouncing. One easing signature everywhere.
 */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ------------------------------------------------------------------ */
/* Reveal — blur-lift on scroll. The blur settling into crisp focus    */
/* reads "premium" without any movement a CFO would call decorative.   */
/* ------------------------------------------------------------------ */
interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /** lift distance in px */
  y?: number
}

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-70px" })
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* DrawRule — a hairline that draws itself across. Brand motif: the    */
/* line you cross. Use under section headings.                         */
/* ------------------------------------------------------------------ */
export function DrawRule({
  className = "",
  delay = 0.15,
}: {
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-70px" })
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ transformOrigin: "left center" }}
      className={`h-px bg-gradient-to-r from-primary/60 via-primary/25 to-transparent ${className}`}
    />
  )
}

/* ------------------------------------------------------------------ */
/* SectionHeading — heading + subcopy with the standard reveal recipe: */
/* heading lifts, rule draws beneath it, copy follows.                 */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  title,
  copy,
  center = true,
}: {
  title: string
  copy?: string
  center?: boolean
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <Reveal>
        <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.12} y={12}>
        <div
          className={`mt-5 flex ${center ? "justify-center" : "justify-start"}`}
        >
          <DrawRule className="w-16" delay={0.25} />
        </div>
      </Reveal>
      {copy && (
        <Reveal delay={0.2} y={16}>
          <p
            className={`mt-4 max-w-2xl text-slate-700 ${center ? "mx-auto" : ""}`}
          >
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RollingDollars — odometer-style number that rolls toward its target */
/* whenever the target changes (calculator sliders). EBITDA going up   */
/* should FEEL like EBITDA going up.                                   */
/* ------------------------------------------------------------------ */
export function RollingDollars({
  value,
  format,
  className,
}: {
  value: number
  format: (v: number) => string
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || prev.current === value) {
      prev.current = value
      setDisplay(value)
      return
    }
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    })
    prev.current = value
    return () => controls.stop()
  }, [value, reduced])

  return (
    <span className={`tabular-nums ${className ?? ""}`}>{format(display)}</span>
  )
}
