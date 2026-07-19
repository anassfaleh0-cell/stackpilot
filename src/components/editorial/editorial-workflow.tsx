import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ContentSection } from "@/types/content"

interface EditorialWorkflowProps {
  sections: ContentSection[]
  slug: string
  category: string
  className?: string
}

export function EditorialWorkflow({ sections, slug, category, className = "" }: EditorialWorkflowProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)

  const steps = sections.slice(0, 5).map((s) => s.title)
  if (steps.length < 2) return null

  const height = steps.length * 60 + 40

  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h3 className="font-semibold text-sm" style={{ color: p.primary }}>Editorial Workflow</h3>
      </div>
      <svg viewBox={`0 0 350 ${height}`} className="w-full h-auto" role="img" aria-label="Content workflow diagram">
        <defs>
          <marker id={`wf-arrow-${slug}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={p.primary} fillOpacity="0.25" />
          </marker>
        </defs>
        {steps.map((step, i) => {
          const y = i * 60 + 30
          return (
            <g key={i}>
              {i < steps.length - 1 && (
                <>
                  <line x1="175" y1={y + 18} x2="175" y2={(i + 1) * 60 + 12} stroke={p.primary} strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="3,3" />
                  <polygon points="171,nextY+4 175,nextY+14 179,nextY+4" fill={p.primary} fillOpacity="0.2" />
                </>
              )}
              <rect x={100} y={y - 14} width="150" height="28" rx="6" fill={p.primary} fillOpacity="0.04" stroke={p.primary} strokeWidth="0.5" />
              <circle cx={80} cy={y} r="12" fill={p.primary} fillOpacity="0.08" stroke={p.primary} strokeWidth="1" />
              <text x={80} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold" fill={p.primary}>{i + 1}</text>
              <text x={175} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="currentColor" fillOpacity="0.7">
                {step.length > 25 ? step.slice(0, 23) + "..." : step}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
