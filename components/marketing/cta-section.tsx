import { Button } from "@/components/ui/button"
import { CTA } from "@/lib/constants"
import Link from "next/link"

interface CTASectionProps {
  heading?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function CTASection({
  heading = "Ready to Talk?",
  description = "Pick a time that works. 15-minute intro, 30-minute deep dive, or a full 60-minute live demo.",
  primaryLabel = CTA.primary.label,
  primaryHref = CTA.primary.href,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-center md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 animate-grid-drift"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto max-w-2xl px-6">
        <h2 className="text-3xl font-semibold text-primary-foreground md:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-lg text-slate-300">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <Button size="lg" variant="secondary" render={<a href={primaryHref} target="_blank" rel="noopener noreferrer" />}>
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
