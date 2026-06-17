"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

/**
 * Wraps an imported article and renders a top reading-progress bar tied to it.
 * A context-free sibling of BlogShell (which the hand-coded posts use) so imported
 * posts don't need the color-switcher / theme provider.
 */
export function ArticleShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <>
      <motion.div
        className="fixed top-16 left-0 right-0 z-[45] h-[3px] origin-left bg-primary"
        style={{ scaleX }}
      />
      <div ref={ref}>{children}</div>
    </>
  )
}
