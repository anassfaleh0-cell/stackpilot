import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ReviewContent } from "@/types/content"

interface EditorialFeatureRadarProps {
  tool: ReviewContent
  className?: string
}

export function EditorialFeatureRadar({ tool, className = "" }: EditorialFeatureRadarProps) {
  const seed = slugSeed(tool.slug)
  const p = getPalette(tool.category)

  const labels = tool.ratings.map(r => r.label)
  const values = tool.ratings.map(r => r.score)
  if (values.length < 3) return null

  const size = 200
  const cx = size / 2
  const cy = size / 2
  const radius = 75
  const levels = 5
  const gradId = `fr-grad-${tool.slug}`

  const polarToCart = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  })

  const dataPoints = values.map((v, i) => {
    const angle = (2 * Math.PI * i) / values.length
    return polarToCart(angle, radius * (v / 5))
  })

  const gridPoints = (level: number) =>
    values.map((_, i) => {
      const angle = (2 * Math.PI * i) / values.length
      return polarToCart(angle, radius * (level / levels))
    })

  const gridPath = (level: number) => {
    const pts = gridPoints(level)
    return pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ") + "Z"
  }

  const dataPath = dataPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ") + "Z"

  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10M18 20V4M6 20v-4" />
        </svg>
        <span className="font-semibold text-sm" style={{ color: p.primary }}>Feature Radar</span>
      </div>
      <svg viewBox={`0 0 ${size} ${size + values.length * 18 + 10}`} className="w-full h-auto max-w-xs mx-auto" role="img" aria-label="Feature category radar chart">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.primary} stopOpacity="0.25" />
            <stop offset="100%" stopColor={p.primary} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <g transform={`translate(0,0)`}>
          {[...Array(levels)].map((_, l) => (
            <path key={l} d={gridPath(l + 1)} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
          ))}
          {values.map((_, i) => {
            const angle = (2 * Math.PI * i) / values.length - Math.PI / 2
            const endX = cx + radius * Math.cos(angle)
            const endY = cy + radius * Math.sin(angle)
            return (
              <line key={i} x1={cx} y1={cy} x2={endX} y2={endY} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
            )
          })}
          <path d={dataPath} fill={`url(#${gradId})`} stroke={p.primary} strokeWidth="1.5" strokeOpacity="0.6" />
          {dataPoints.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3" fill={p.primary} stroke="white" strokeWidth="1" />
          ))}
          {values.map((_, i) => {
            const angle = (2 * Math.PI * i) / values.length - Math.PI / 2
            const labelR = radius + 16
            const lx = cx + labelR * Math.cos(angle)
            const ly = cy + labelR * Math.sin(angle)
            return (
              <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="currentColor" fillOpacity="0.6">
                {values[i].toFixed(1)}
              </text>
            )
          })}
        </g>
        {values.map((_, i) => {
          const y = size + 10 + i * 14
          return (
            <text key={i} x={cx} y={y} textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.5">
              {labels[i]} — {values[i]}/5
            </text>
          )
        })}
      </svg>
    </div>
  )
}
