import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = "", glow = false }: GlassCardProps) {
  return (
    <div
      className={`relative rounded-xl border border-border bg-primary-subtle/30 backdrop-blur-sm ${className}`}
      style={{
        boxShadow: glow ? "0 0 40px color-mix(in srgb, var(--primary) 6%, transparent)" : undefined,
      }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 6%, transparent) 0%, transparent 70%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function InfoCard({
  icon,
  title,
  value,
  description,
  className = "",
}: {
  icon: ReactNode
  title: string
  value: string
  description?: string
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-subtle text-primary">
          {icon}
        </div>
        <div>
          <div className="text-lg font-bold text-primary">
            {value}
          </div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </div>
      {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  )
}
