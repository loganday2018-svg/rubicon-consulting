interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      {/* Drifting dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 animate-grid-drift"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Soft glow behind the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.85 0.05 250 / 0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
