import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import { RichText } from "@/components/content/rich-text"
import { getComparisonFeatureDisplayValue } from "@/lib/content/comparison-decision"
import type { ComparisonFeature } from "@/types/content"

interface EditorialComparisonProps {
  tool1: string
  tool2: string
  features: ComparisonFeature[]
  featuresVerified?: boolean
  winner: string | null
  category: string
  slug: string
  className?: string
}

export function EditorialComparison({ tool1, tool2, features, featuresVerified = false, winner, category, slug, className = "" }: EditorialComparisonProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)
  // Only explicit boolean availability values can contribute to a feature score.
  // Text values describe plan tiers or unknowns and must not be treated as truthy wins.
  const displayFeatures = features.map((feature) => ({\n    ...feature,\n    displayTool1: getComparisonFeatureDisplayValue(feature.tool1, featuresVerified),\n    displayTool2: getComparisonFeatureDisplayValue(feature.tool2, featuresVerified),\n  }))\n  const scoredFeatures = featuresVerified ? features.filter((f) => typeof f.tool1 === "boolean" && typeof f.tool2 === "boolean") : []
  const t1w = scoredFeatures.filter((f) => f.tool1 === true && f.tool2 === false).length
  const t2w = scoredFeatures.filter((f) => f.tool2 === true && f.tool1 === false).length
  const tie = scoredFeatures.filter((f) => f.tool1 === true && f.tool2 === true).length
  const total = scoredFeatures.length

  const gradId = `comp-grad-${slug}`

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-xl p-3" style={{
          border: `1px solid ${winner === tool1 ? p.primary : p.glassBorder}`,
          backgroundColor: winner === tool1 ? p.glassBg : undefined,
        }}>
          <div className="font-semibold text-sm" style={{ color: p.primary }}>{tool1}</div>
          <div className="text-2xl font-bold mt-1" style={{ color: p.primary }}>{total > 0 ? t1w : "—"}</div>
          <div className="text-xs text-muted">exclusive checks</div>
        </div>
        <div className="rounded-xl p-3" style={{ border: `1px solid ${p.glassBorder}` }}>
          <div className="font-semibold text-muted">Tie</div>
          <div className="text-2xl font-bold mt-1 text-accent">{total > 0 ? tie : "—"}</div>
          <div className="text-xs text-muted">both recorded</div>
        </div>
        <div className="rounded-xl p-3" style={{
          border: `1px solid ${winner === tool2 ? p.primary : p.glassBorder}`,
          backgroundColor: winner === tool2 ? p.glassBg : undefined,
        }}>
          <div className="font-semibold" style={{ color: p.primary }}>{tool2}</div>
          <div className="text-2xl font-bold mt-1" style={{ color: p.primary }}>{total > 0 ? t2w : "—"}</div>
          <div className="text-xs text-muted">exclusive checks</div>
        </div>
      </div>
      {total > 0 ? (
        <svg viewBox="0 0 100 8" className="w-full h-auto" role="img" aria-label="Feature comparison bar">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${(t1w / total) * 100}%`} stopColor={p.primary} stopOpacity="0.6" />
              <stop offset={`${(t1w / total) * 100}%`} stopColor="var(--accent)" stopOpacity="0.02" />
              <stop offset={`${((t1w + tie) / total) * 100}%`} stopColor="var(--accent)" stopOpacity="0.02" />
              <stop offset={`${((t1w + tie) / total) * 100}%`} stopColor={p.primary} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100" height="8" rx="4" fill={`url(#${gradId})`} />
        </svg>
      ) : (
        <p className="text-xs text-muted-foreground">No scored winner is shown: the rows below describe plan availability and items to verify rather than unsupported feature scores.</p>
      )}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${p.glassBorder}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: p.subtle1 }}>
              <th className="text-left p-3 font-semibold">Feature</th>
              <th className="text-center p-3 font-semibold" style={{ color: p.primary }}>{tool1}</th>
              <th className="text-center p-3 font-semibold" style={{ color: p.primary }}>{tool2}</th>
            </tr>
          </thead>
          <tbody>
            {displayFeatures.map((f, i) => (
              <tr key={f.name} className={i < features.length - 1 ? "" : ""} style={{ borderBottom: i < features.length - 1 ? `1px solid ${p.glassBorder}` : undefined }}>
                <td className="p-3">
                  <div className="font-medium">{f.name}</div>
                  {(f.tool1Detail || f.tool2Detail) && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                      {f.tool1Detail && f.tool2Detail && <RichText text={`${f.tool1Detail} · ${f.tool2Detail}`} />}
                      {f.tool1Detail && !f.tool2Detail && <RichText text={f.tool1Detail} />}
                      {!f.tool1Detail && f.tool2Detail && <RichText text={f.tool2Detail} />}
                    </div>
                  )}
                </td>
                <td className="text-center p-3">
                  {typeof f.displayTool1 === "boolean" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.displayTool1 ? p.primary : "var(--error)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      {f.displayTool1 ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="16 8 10 16 8 12" /></>
                      ) : (
                        <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                      )}
                    </svg>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: p.primary, backgroundColor: p.glassBg }}>{f.displayTool1}</span>
                  )}
                </td>
                <td className="text-center p-3">
                  {typeof f.displayTool2 === "boolean" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.displayTool2 ? p.primary : "var(--error)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      {f.displayTool2 ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="16 8 10 16 8 12" /></>
                      ) : (
                        <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                      )}
                    </svg>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: p.primary, backgroundColor: p.glassBg }}>{f.displayTool2}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
