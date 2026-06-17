"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { CTA } from "@/lib/constants"
import { RotatingHeadline } from "@/components/marketing/rotating-headline"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import { EASE } from "@/components/marketing/motion-kit"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // As the hero scrolls away, content drifts up slower than the page and
  // gently dims — depth without theatrics.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary py-24 md:py-32 lg:py-40"
    >
      {/* Dot grid that drifts — slow enough that it registers as alive,
          not animated. Pure CSS so it costs nothing. */}
      <div
        aria-hidden
        className="absolute inset-0 animate-grid-drift"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Breathing glow behind the headline */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 h-[36rem] w-[52rem] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.85 0.05 250 / 0.14), transparent 70%)",
        }}
        animate={reduced ? undefined : { opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto max-w-6xl px-6"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={reduced ? false : { opacity: 0, letterSpacing: "0.35em" }}
            animate={{ opacity: 1, letterSpacing: "0.1em" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400"
          >
            AI Implementation that Sticks
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 26, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            <RotatingHeadline className="font-display text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl" />
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl"
          >
            I&apos;m Logan. I deploy Claude, Codex, and Copilot at companies
            and make sure they stick.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <span className="btn-shine inline-flex rounded-md">
              <Button
                size="lg"
                variant="secondary"
                render={
                  <a
                    href={CTA.primary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                {CTA.primary.label}
              </Button>
            </span>
            <Link
              href="/calculator"
              className="group text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              See Your EBITDA Impact{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
