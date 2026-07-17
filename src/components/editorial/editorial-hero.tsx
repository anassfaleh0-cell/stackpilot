import { slugSeed, seededRandom, range } from "./seed"
import { getPalette } from "./palette"

interface EditorialHeroProps {
  slug: string
  title: string
  subtitle?: string
  category: string
  variant?: "review" | "comparison" | "guide" | "blog" | "glossary"
  rating?: number
  className?: string
}

type Composition = "circles" | "waves" | "grid" | "rings" | "constellation" | "bars" | "overlap" | "flow"

const compositions: Composition[] = ["circles", "waves", "grid", "rings", "constellation", "bars", "overlap", "flow"]

export function EditorialHero({ slug, title, subtitle, category, variant = "review", rating, className = "" }: EditorialHeroProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)
  const comp = compositions[Math.floor(rand() * compositions.length)]

  const circleCount = 10 + Math.floor(rand() * 15)
  const circles = Array.from({ length: circleCount }, (_, i) => ({
    cx: 50 + (rand() - 0.5) * 80,
    cy: 20 + rand() * 60,
    r: 5 + rand() * 35,
    op: 0.02 + rand() * 0.07,
  }))

  const dotCount = 25 + Math.floor(rand() * 20)
  const dots = Array.from({ length: dotCount }, (_, i) => ({
    x: rand() * 100,
    y: rand() * 100,
    r: 0.5 + rand() * 2,
    op: 0.08 + rand() * 0.12,
  }))

  const barCount = 8
  const bars = Array.from({ length: barCount }, (_, i) => ({
    x: 8 + i * 11.5,
    w: 7,
    h: 15 + rand() * 65,
    op: 0.06 + rand() * 0.08,
  }))

  const ringCount = 3 + Math.floor(rand() * 3)
  const rings = Array.from({ length: ringCount }, (_, i) => ({
    cx: 20 + rand() * 60,
    cy: 30 + rand() * 40,
    r: 15 + i * 12 + rand() * 8,
    op: 0.03 + i * 0.02,
  }))

  const constellationCount = 12 + Math.floor(rand() * 8)
  const constellation = Array.from({ length: constellationCount }, () => ({
    x: 5 + rand() * 90,
    y: 5 + rand() * 90,
  }))

  const connections: [number, number][] = []
  for (let i = 0; i < constellationCount; i++) {
    const dist = Math.abs(constellation[i].x - constellation[(i + 1) % constellationCount].x) +
                 Math.abs(constellation[i].y - constellation[(i + 1) % constellationCount].y)
    if (dist < 40) {
      connections.push([i, (i + 1) % constellationCount])
    }
  }

  const flowPoints = Array.from({ length: 6 }, (_, i) => ({
    x: 5 + i * 18 + rand() * 5,
    y: 20 + rand() * 60,
  }))

  const glowId = `glow-${slug}`
  const gradId = `hero-grad-${slug}`
  const gridId = `grid-${slug}`
  const blobId = `blob-${slug}`

  const wavePaths = [
    `M0,${50 + rand() * 10} Q${25},${10 + rand() * 15} ${50},${50 + rand() * 10} T100,${50 + rand() * 10}`,
    `M0,${60 + rand() * 10} Q${33},${20 + rand() * 15} ${66},${50 + rand() * 10} T100,${60 + rand() * 10}`,
    `M0,${70 + rand() * 5} Q${40},${30 + rand() * 10} ${50},${60 + rand() * 10} T100,${70 + rand() * 5}`,
  ]

  const barSegments = rating ? Array.from({ length: 5 }, (_, i) => ({
    x: 12 + i * 18,
    w: 10,
    h: 20 + (rating / 5) * (80 + i * 3),
    fill: i < Math.round(rating) ? p.primary : p.subtle1,
  })) : []

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-card ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${title} editorial artwork`}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.gradientFrom} />
            <stop offset="50%" stopColor={p.gradientVia} />
            <stop offset="100%" stopColor={p.gradientTo} />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.glowColor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={p.glowColor} stopOpacity="0" />
          </radialGradient>
          <pattern id={gridId} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke={p.primary} strokeOpacity="0.04" strokeWidth="0.3" />
          </pattern>
          <filter id={blobId}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <rect width="100" height="100" fill="var(--card)" />
        <rect width="100" height="100" fill={`url(#${gridId})`} />
        <rect width="100" height="100" fill={`url(#${glowId})`} />

        {comp === "circles" && circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={p.primary} opacity={c.op} filter={i % 2 === 0 ? `url(#${blobId})` : undefined} />
        ))}

        {comp === "waves" && wavePaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={p.primary} strokeWidth="0.8" opacity={0.06 + i * 0.03} />
        ))}

        {comp === "grid" && (
          <>
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 12 }).map((_, col) => (
                <rect
                  key={`g-${row}-${col}`}
                  x={4 + col * 8.5}
                  y={5 + row * 12}
                  width="4"
                  height="4"
                  rx="1"
                  fill={p.primary}
                  opacity={0.03 + ((row + col) % 3) * 0.02}
                />
              ))
            )}
          </>
        )}

        {comp === "rings" && rings.map((r, i) => (
          <circle key={i} cx={r.cx} cy={r.cy} r={r.r} fill="none" stroke={p.primary} strokeWidth="0.5" opacity={r.op} />
        ))}

        {comp === "constellation" && (
          <>
            {connections.map(([from, to], i) => (
              <line key={i} x1={constellation[from].x} y1={constellation[from].y} x2={constellation[to].x} y2={constellation[to].y} stroke={p.primary} strokeWidth="0.3" opacity="0.06" />
            ))}
            {constellation.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="0.8" fill={p.primary} opacity="0.1" />
            ))}
          </>
        )}

        {comp === "bars" && bars.map((b, i) => (
          <rect key={i} x={b.x} y={100 - b.h} width={b.w} height={b.h} rx="1" fill={p.primary} opacity={b.op} />
        ))}

        {comp === "overlap" && (
          <>
            <circle cx="30" cy="50" r="28" fill={p.primary} opacity="0.04" filter={`url(#${blobId})`} />
            <circle cx="50" cy="40" r="25" fill={p.secondary} opacity="0.04" filter={`url(#${blobId})`} />
            <circle cx="70" cy="50" r="28" fill={p.accent} opacity="0.04" filter={`url(#${blobId})`} />
          </>
        )}

        {comp === "flow" && (
          <>
            {flowPoints.map((pt, i) => {
              const next = flowPoints[(i + 1) % flowPoints.length]
              return (
                <line key={i} x1={pt.x} y1={pt.y} x2={next.x} y2={next.y} stroke={p.primary} strokeWidth="0.4" opacity="0.06" strokeDasharray={i % 2 === 0 ? "1,1" : undefined} />
              )
            })}
            {flowPoints.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="1.5" fill={p.primary} opacity={0.08 + i * 0.015} />
            ))}
          </>
        )}

        {dots.map((d, i) => (
          <circle key={`dot-${i}`} cx={d.x} cy={d.y} r={d.r} fill={p.dotColor} opacity={d.op} />
        ))}

        {rating && comp !== "bars" && barSegments.map((b, i) => (
          <rect key={`rating-${i}`} x={b.x} y={100 - b.h} width={b.w} height={b.h} rx="1.5" fill={b.fill} opacity="0.15" />
        ))}
      </svg>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <span
            className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
            style={{
              color: p.primary,
              backgroundColor: p.glassBg,
              borderColor: p.glassBorder,
              borderWidth: 1,
            }}
          >
            {category}
          </span>
          {variant === "review" && subtitle && (
            <p className="text-sm font-medium mb-1" style={{ color: p.primary }}>{subtitle}</p>
          )}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
            style={{ color: p.primary }}
          >
            {title}
          </h1>
          {variant === "review" && rating && (
            <div className="flex items-center gap-2 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "var(--accent)" : "var(--border)"} stroke={i < Math.round(rating) ? "var(--accent)" : "var(--border-light)"} strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span className="text-sm font-semibold" style={{ color: p.primary }}>{rating}/5</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
