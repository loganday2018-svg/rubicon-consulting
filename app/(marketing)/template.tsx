"use client"

import { motion, useReducedMotion } from "framer-motion"
import { EASE } from "@/components/marketing/motion-kit"

/**
 * Route-level transition: each page eases in with a short lift. template.tsx
 * (unlike layout.tsx) remounts per navigation, which is what makes this fire
 * on every route change.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  if (reduced) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
