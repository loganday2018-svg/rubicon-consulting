"use client"

import { useRef, useState } from "react"
import { TrendingUp, Clock, Cog, Handshake, Plus } from "lucide-react"
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion"

const ICONS = {
  TrendingUp,
  Clock,
  Cog,
  Handshake,
} as const

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface ValuePropsProps {
  items: readonly {
    icon: keyof typeof ICONS
    title: string
    description: string
    useCases: readonly string[]
  }[]
}

export function ValueProps({ items }: ValuePropsProps) {
  const [open, setOpen] = useState(0)
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <div
      ref={ref}
      className="mt-10 rounded-xl border border-slate-200 bg-white"
    >
      {items.map((prop, i) => {
        const Icon = ICONS[prop.icon]
        const isOpen = open === i

        return (
          <motion.div
            key={prop.title}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.08, ease: EASE }}
            className={`relative border-slate-200 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl ${
              i > 0 ? "border-t" : ""
            } ${
              isOpen
                ? "z-10 bg-gradient-to-br from-white via-slate-50 to-primary/[0.04] shadow-md"
                : "hover:bg-slate-50/60"
            }`}
          >
            {/* Active accent bar — draws down when the item opens */}
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-[3px] origin-top bg-primary"
              initial={false}
              animate={{ scaleY: isOpen ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            />

            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center gap-4 px-5 py-5 text-left outline-none focus-visible:bg-slate-50 md:px-7"
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
                    isOpen && !reduce
                      ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Icon
                    className={`size-5 transition-colors duration-300 ${
                      isOpen ? "text-primary" : "text-slate-400"
                    }`}
                  />
                </motion.span>
              </span>
              <h3
                className={`flex-1 font-semibold tracking-tight transition-colors duration-300 md:text-lg ${
                  isOpen ? "text-foreground" : "text-slate-700"
                }`}
              >
                {prop.title}
              </h3>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 135 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={`shrink-0 transition-colors duration-300 ${
                  isOpen ? "text-primary" : "text-slate-400"
                }`}
              >
                <Plus className="size-5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0.2 : 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 pl-14 md:px-7 md:pl-[4.25rem]">
                    <p className="max-w-2xl leading-relaxed text-slate-600">
                      {prop.description}
                    </p>
                    <ul className="mt-4 grid gap-x-8 gap-y-2.5 md:grid-cols-3">
                      {prop.useCases.map((useCase, j) => (
                        <motion.li
                          key={useCase}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: reduce ? 0 : 0.3,
                            delay: reduce ? 0 : 0.12 + j * 0.06,
                            ease: EASE,
                          }}
                          className="flex items-start gap-2 text-sm leading-snug text-slate-700"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          {useCase}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
