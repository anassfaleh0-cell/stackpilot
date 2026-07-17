import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"

interface EditorialSectionIllustrationProps {
  slug: string
  category: string
  index: number
  className?: string
}

const sectionIcons: Record<string, string> = {
  overview: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  features: "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM4 13a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z",
  pricing: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  comparison: "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM8 13h8M8 17h6",
  workflow: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  implementation: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  security: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  support: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z",
}

function getIcon(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, path] of Object.entries(sectionIcons)) {
    if (lower.includes(key)) return path
  }
  return "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
}

export function EditorialSectionIllustration({ slug, category, index, className = "" }: EditorialSectionIllustrationProps) {
  const seed = slugSeed(slug + "-" + index)
  const rand = seededRandom(seed)
  const p = getPalette(category)
  const style = index % 3
  const dotCount = 6 + Math.floor(rand() * 6)
  const dots = Array.from({ length: dotCount }, () => ({
    x: 10 + rand() * 80,
    y: 10 + rand() * 80,
    r: 1 + rand() * 2,
  }))

  return (
    <svg
      viewBox="0 0 100 30"
      className={`w-full h-auto max-h-8 ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {style === 0 && (
        <>
          <line x1="0" y1="15" x2="100" y2="15" stroke={p.primary} strokeWidth="0.3" opacity="0.1" />
          <circle cx="15" cy="15" r="4" fill={p.primary} opacity="0.06" />
          <circle cx="50" cy="15" r="4" fill={p.secondary} opacity="0.06" />
          <circle cx="85" cy="15" r="4" fill={p.accent} opacity="0.06" />
        </>
      )}
      {style === 1 && (
        <>
          <rect x="10" y="8" width="80" height="14" rx="4" fill={p.primary} opacity="0.03" />
          <rect x="15" y="12" width="70" height="6" rx="2" fill={p.primary} opacity="0.06" />
        </>
      )}
      {style === 2 && (
        <>
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={p.primary} opacity="0.06" />
          ))}
        </>
      )}
    </svg>
  )
}
