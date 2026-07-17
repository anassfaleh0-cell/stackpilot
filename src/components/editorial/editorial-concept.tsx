import { slugSeed, seededRandom, range } from "./seed"
import { getPalette } from "./palette"

interface EditorialConceptProps {
  term: string
  slug: string
  category: string
  className?: string
}

export function EditorialConcept({ term, slug, category, className = "" }: EditorialConceptProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)

  const nodes = Array.from({ length: 5 }, (_, i) => ({
    x: 15 + rand() * 70,
    y: 15 + rand() * 70,
    r: 8 + rand() * 6,
    label: term.slice(0, Math.max(3, Math.floor(term.length / 3) * (i + 1))),
  }))

  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="font-semibold text-sm" style={{ color: p.primary }}>Concept Visualization</span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-auto max-h-36" role="img" aria-label={`${term} concept visualization`}>
        {nodes.map((n, i) => {
          const connections = []
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - n.x
            const dy = nodes[j].y - n.y
            if (Math.sqrt(dx * dx + dy * dy) < 50) {
              connections.push(j)
            }
          }
          return connections.map((j) => (
            <line key={`l-${i}-${j}`} x1={n.x} y1={n.y} x2={nodes[j].x} y2={nodes[j].y} stroke={p.primary} strokeWidth="0.5" opacity="0.08" />
          ))
        })}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={p.primary} fillOpacity={0.06 + i * 0.015} stroke={p.primary} strokeWidth="0.5" opacity={0.5 - i * 0.05} />
            <circle cx={n.x} cy={n.y} r="2" fill={p.primary} opacity="0.15" />
          </g>
        ))}
        <text x="50" y="92" textAnchor="middle" fontSize="7" fill={p.primary} fillOpacity="0.3" fontWeight="600">
          {term}
        </text>
      </svg>
    </div>
  )
}
