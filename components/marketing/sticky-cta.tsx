"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CTA } from "@/lib/constants"

export function StickyCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-primary/95 px-6 py-3 backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="text-sm font-medium text-primary-foreground">
              Ready to put AI to work in your shop?
            </p>
            <a
              href={CTA.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-slate-100"
            >
              {CTA.primary.label}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
