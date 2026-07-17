interface BrandPatternProps {
  variant?: "grid" | "waves" | "dots" | "cross" | "hex" | "circuit"
  className?: string
  opacity?: number
}

function getPattern(id: string, variant: string) {
  switch (variant) {
    case "grid":
      return (
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      )
    case "waves":
      return (
        <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      )
    case "dots":
      return (
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1" fill="currentColor" />
        </pattern>
      )
    case "cross":
      return (
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      )
    case "hex":
      return (
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 2l12 7v14l-12 7L2 23V9l12-7z" fill="none" stroke="currentColor" strokeWidth="0.4" />
        </pattern>
      )
    case "circuit":
      return (
        <pattern id={id} width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="24" cy="24" r="2" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <path d="M8 8L24 24M8 24L24 8" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </pattern>
      )
    default:
      return (
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      )
  }
}

export function BrandPattern({ variant = "grid", className = "", opacity = 0.5 }: BrandPatternProps) {
  const id = `bp-${variant}`
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true" style={{ opacity }}>
      <defs>{getPattern(id, variant)}</defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function BrandDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative my-16 sm:my-20 ${className}`}>
      <hr className="section-divider" />
    </div>
  )
}

export function BrandOrb({
  className = "",
  color = "var(--primary)",
  size = 400,
}: {
  className?: string
  color?: string
  size?: number
}) {
  return (
    <div
      className={`absolute pointer-events-none rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        opacity: 0.03,
      }}
      aria-hidden="true"
    />
  )
}

export function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="trust-badge">{children}</span>
  )
}

export function ScoreBar({ score, max = 5, className = "" }: { score: number; max?: number; className?: string }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div className={`score-bar ${className}`}>
      <div className="score-bar-fill bg-primary" style={{ width: `${pct}%` }} />
    </div>
  )
}
