import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { GuideSection } from "@/types/content"

interface EditorialProcessProps {
  sections: GuideSection[]
  slug: string
  category: string
  className?: string
}

export function EditorialProcess({ sections, slug, category, className = "" }: EditorialProcessProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)

  const steps = sections.slice(0, 6).map((s, i) => ({
    label: s.title,
    x: 10 + i * 16,
    y: 50,
    h: 25 + rand() * 35,
  }))

  if (steps.length < 2) return null

  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span className="font-semibold text-sm" style={{ color: p.primary }}>Process Architecture</span>
      </div>
      <svg viewBox="0 0 100 80" className="w-full h-auto max-h-40" role="img" aria-label="Process architecture diagram">
        <defs>
          <linearGradient id={`proc-grad-${slug}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={p.primary} stopOpacity="0.05" />
            <stop offset="100%" stopColor={p.primary} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {steps.map((s, i) => {
          const barH = s.h > 60 ? 60 : s.h
          return (
            <g key={i}>
              <rect x={s.x} y={s.y - barH / 2} width="10" height={barH} rx="3" fill={`url(#proc-grad-${slug})`} />
              <rect x={s.x} y={s.y - barH / 2} width="10" height={barH} rx="3" fill={p.primary} opacity="0.2" />
              <circle cx={s.x + 5} cy={s.y} r="2.5" fill={p.primary} opacity="0.3" />
              {i < steps.length - 1 && (
                <line x1={s.x + 15} y1={s.y} x2={steps[i + 1].x} y2={steps[i + 1].y} stroke={p.primary} strokeOpacity="0.08" strokeWidth="0.5" markerEnd={`url(#proc-arrow-${slug})`} />
              )}
            </g>
          )
        })}
        {steps.map((s, i) => (
          <text key={`l-${i}`} x={s.x + 5} y={85} textAnchor="middle" fontSize="4.5" fill="currentColor" fillOpacity="0.4">
            {s.label.length > 12 ? s.label.slice(0, 10) + "..." : s.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
