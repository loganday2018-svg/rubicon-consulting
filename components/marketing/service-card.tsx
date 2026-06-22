"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  scope: string[]
  timeline?: string
  price?: string
  scoped?: boolean
  image?: string
  featured?: boolean
  animateIcon?: boolean
}

function CardImage({ src }: { src: string }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.5]"
        style={{
          backgroundImage: `url(${src})`,
          filter: "grayscale(1) sepia(1) hue-rotate(192deg) saturate(3.2) brightness(0.8)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white via-white/85 to-white/55"
      />
    </>
  )
}

export function ServiceCard({
  icon,
  title,
  description,
  scope,
  timeline,
  price,
  image,
  featured,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white p-7 transition-shadow duration-300 hover:shadow-xl ${
        featured ? "border-primary/40 ring-1 ring-primary/30" : "border-slate-200"
      }`}
    >
      {image && <CardImage src={image} />}

      <div className="relative flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between">
          <div className="inline-flex w-fit rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
          {featured && (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
              Start here
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 leading-relaxed text-slate-600">{description}</p>

        <ul className="mt-5 space-y-2.5">
          {scope.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm leading-snug text-slate-700"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex items-baseline gap-2 border-t border-slate-100 pt-4">
            <span className="text-lg font-semibold text-primary">{price}</span>
            {timeline && <span className="text-xs text-slate-400">&middot; {timeline}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
