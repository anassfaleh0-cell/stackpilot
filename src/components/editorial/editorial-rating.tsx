import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { CategoryRating } from "@/types/content"

interface EditorialRatingVisualProps {
  ratings: CategoryRating[]
  slug: string
  category: string
  className?: string
}

export function EditorialRatingVisual({ ratings, slug, category, className = "" }: EditorialRatingVisualProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)

  const gradId = `rgrad-${slug}`

  return (
    <div className={`p-5 rounded-xl ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <h3 className="font-semibold mb-4 text-sm" style={{ color: p.primary }}>Category Ratings</h3>
      <svg
        viewBox="0 0 100 80"
        className="w-full h-auto mb-3"
        role="img"
        aria-label="Category rating bars"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={p.primary} stopOpacity="0.1" />
            <stop offset="100%" stopColor={p.primary} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {ratings.map((r, i) => {
          const x = 8 + i * 18
          const barH = (r.score / 5) * 60
          return (
            <g key={i}>
              <rect x={x} y={70 - barH} width="10" height={barH} rx="2" fill={`url(#${gradId})`} />
              <rect x={x} y={70 - barH} width="10" height={barH} rx="2" fill={p.primary} opacity="0.3" />
              <text x={x + 5} y={78} textAnchor="middle" fontSize="4.5" fill="currentColor" fillOpacity="0.5">{r.label.slice(0, 4)}</text>
            </g>
          )
        })}
        {[1, 2, 3, 4, 5].map((tick) => (
          <line key={tick} x1="0" y1={70 - (tick / 5) * 60} x2="100" y2={70 - (tick / 5) * 60} stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.3" strokeDasharray="1,1" />
        ))}
      </svg>
      <div className="space-y-2">
        {ratings.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-muted">{r.label}</span>
              <span className="font-medium" style={{ color: p.primary }}>{r.score}/5</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: p.subtle1 }} role="progressbar" aria-valuenow={Math.round((r.score / 5) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${r.label} rating`}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(r.score / 5) * 100}%`, backgroundColor: p.primary }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
