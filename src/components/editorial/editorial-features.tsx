import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ReviewFeature } from "@/types/content"

interface EditorialFeatureMatrixProps {
  features: ReviewFeature[]
  slug: string
  category: string
  className?: string
  verified?: boolean
}

export function EditorialFeatureMatrix({ features, slug, category, className = "", verified = false }: EditorialFeatureMatrixProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)

  const groups = [
    { label: "Core", items: features.filter((f) => f.category === "Core") },
    { label: "Collaboration", items: features.filter((f) => f.category === "Collaboration") },
    { label: "Integrations", items: features.filter((f) => f.category === "Integrations") },
  ].filter((g) => g.items.length > 0)

  if (groups.length === 0) return null

  const featureSvgId = `feat-svg-${slug}`
  const glowId = `feat-glow-${slug}`

  return (
    <div className={`space-y-4 ${className}`}>
      {groups.map((group) => {
        const availCount = group.items.filter((f) => f.available).length
        return (
          <div key={group.label} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${p.glassBorder}` }}>
            <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: p.subtle1, borderBottom: `1px solid ${p.glassBorder}` }}>
              <h3 className="text-sm font-semibold" style={{ color: p.primary }}>{group.label} Features</h3>
              <span className="text-xs ml-auto" style={{ color: p.secondary }}>{verified ? `${availCount}/${group.items.length} available` : "Availability not verified"}</span>
            </div>
            <div className="divide-y" style={{ borderColor: p.glassBorder }}>
              {group.items.map((f) => (
                <div key={f.name} className="flex items-center gap-3 px-5 py-3 hover:opacity-80 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={verified && f.available ? p.primary : "var(--muted-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    {verified && f.available ? (
                      <>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </>
                    ) : (
                      <circle cx="12" cy="12" r="10" />
                    )}
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="text-xs text-muted truncate">{f.description}</div>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: verified && f.available ? p.primary : "var(--muted-foreground)",
                      backgroundColor: verified && f.available ? p.glassBg : "color-mix(in srgb, var(--muted-foreground) 10%, transparent)",
                    }}
                  >
                    {verified ? (f.available ? "Available" : "Not included") : "Unverified"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
