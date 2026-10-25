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
  decisionGuide?: boolean
  winner: string | null
  category: string
  slug: string
  className?: string
}

export function EditorialComparison({ tool1, tool2, features, featuresVerified = false, decisionGuide = false, winner, category, slug, className = "" }: EditorialComparisonProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)
  // Only explicit boolean availability values can contribute to a feature score.
  // Text values describe plan tiers or unknowns and must not be treated as truthy wins.
  const displayFeatures = features.map((feature) => ({
    ...feature,
    displayTool1: getComparisonFeatureDisplayValue(feature.tool1, featuresVerified, decisionGuide, feature.name),
    displayTool2: getComparisonFeatureDisplayValue(feature.tool2, featuresVerified, decisionGuide, feature.name),
  }))
  const scoredFeatures = features.filter((f) => typeof f.tool1 === "boolean" && typeof f.tool2 === "boolean")
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
          <div className="text-xs text-muted">{featuresVerified ? "verified exclusive checks" : "provisional exclusive checks"}</div>
        </div>
        <div className="rounded-xl p-3" style={{ border: `1px solid ${p.glassBorder}` }}>
          <div className="font-semibold text-muted">Tie</div>
          <div className="text-2xl font-bold mt-1 text-accent">{total > 0 ? tie : "—"}</div>
          <div className="text-xs text-muted">{featuresVerified ? "both recorded" : "both recorded · provisional"}</div>
        </div>
        <div className="rounded-xl p-3" style={{
          border: `1px solid ${winner === tool2 ? p.primary : p.glassBorder}`,
          backgroundColor: winner === tool2 ? p.glassBg : undefined,
        }}>
          <div className="font-semibold" style={{ color: p.primary }}>{tool2}</div>
          <div className="text-2xl font-bold mt-1" style={{ color: p.primary }}>{total > 0 ? t2w : "—"}</div>
          <div className="text-xs text-muted">{featuresVerified ? "verified exclusive checks" : "provisional exclusive checks"}</div>
        </div>
      </div>
      {total > 0 ? (
        <><p className="text-xs text-muted-foreground">{featuresVerified ? "Recorded boolean availability checks; this is not a measure of overall product quality." : "Scores below are calculated from recorded boolean fields. Source verification is pending; treat the figures as provisional, not as confirmed product differences."}</p><svg viewBox="0 0 100 8" className="w-full h-auto" role="img" aria-label={`Feature comparison bar; ${featuresVerified ? "verified" : "provisional, source verification pending"}`} >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${(t1w / total) * 100}%`} stopColor={p.primary} stopOpacity="0.6" />
              <stop offset={`${(t1w / total) * 100}%`} stopColor="var(--accent)" stopOpacity="0.02" />
              <stop offset={`${((t1w + tie) / total) * 100}%`} stopColor="var(--accent)" stopOpacity="0.02" />
              <stop offset={`${((t1w + tie) / total) * 100}%`} stopColor={p.primary} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100" height="8" rx="4" fill={`url(#${gradId})`} />
        </svg></>
      ) : (
        <p className="text-xs text-muted-foreground">{decisionGuide ? "These rows describe each product’s primary job and practical selection criteria; they are not a verified feature scorecard." : "No scored winner is shown: the rows below describe plan availability and items to verify rather than unsupported feature scores."}</p>
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
              <tr key={f.name} style={{ borderBottom: i < features.length - 1 ? `1px solid ${p.glassBorder}` : undefined }}>
                <td className="p-3 align-top">
                  <div className="font-medium">{f.name}</div>
                </td>
                <td className="p-3 align-top">
                  <div className="flex justify-center">
                    {typeof f.displayTool1 === "boolean" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.displayTool1 ? p.primary : "var(--error)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {f.displayTool1 ? (
                          <><circle cx="12" cy="12" r="10" /><polyline points="16 8 10 16 8 12" /></>
                        ) : (
                          <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                        )}
                      </svg>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: p.primary, backgroundColor: p.glassBg }}>{f.displayTool1}</span>
                    )}
                  </div>
                  {f.tool1Detail && <div className="mt-2 text-left text-[11px] leading-relaxed text-muted-foreground"><RichText text={f.tool1Detail} /></div>}
                </td>
                <td className="p-3 align-top">
                  <div className="flex justify-center">
                    {typeof f.displayTool2 === "boolean" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.displayTool2 ? p.primary : "var(--error)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {f.displayTool2 ? (
                          <><circle cx="12" cy="12" r="10" /><polyline points="16 8 10 16 8 12" /></>
                        ) : (
                          <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                        )}
                      </svg>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: p.primary, backgroundColor: p.glassBg }}>{f.displayTool2}</span>
                    )}
                  </div>
                  {f.tool2Detail && <div className="mt-2 text-left text-[11px] leading-relaxed text-muted-foreground"><RichText text={f.tool2Detail} /></div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
