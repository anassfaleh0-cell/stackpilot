import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ComparisonFeature } from "@/types/content"

interface EditorialComparisonProps {
  tool1: string
  tool2: string
  features: ComparisonFeature[]
  winner: string | null
  category: string
  slug: string
  className?: string
}

export function EditorialComparison({ tool1, tool2, features, winner, category, slug, className = "" }: EditorialComparisonProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const p = getPalette(category)
  const t1w = features.filter((f) => f.tool1 && !f.tool2).length
  const t2w = features.filter((f) => f.tool2 && !f.tool1).length
  const tie = features.filter((f) => f.tool1 && f.tool2).length
  const total = features.length

  const gradId = `comp-grad-${slug}`

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-xl p-3" style={{
          border: `1px solid ${winner === tool1 ? p.primary : p.glassBorder}`,
          backgroundColor: winner === tool1 ? p.glassBg : undefined,
        }}>
          <div className="font-semibold text-sm" style={{ color: p.primary }}>{tool1}</div>
          <div className="text-2xl font-bold mt-1" style={{ color: p.primary }}>{t1w}</div>
          <div className="text-xs text-muted">wins</div>
        </div>
        <div className="rounded-xl p-3" style={{ border: `1px solid ${p.glassBorder}` }}>
          <div className="font-semibold text-muted">Tie</div>
          <div className="text-2xl font-bold mt-1 text-accent">{tie}</div>
          <div className="text-xs text-muted">both</div>
        </div>
        <div className="rounded-xl p-3" style={{
          border: `1px solid ${winner === tool2 ? p.primary : p.glassBorder}`,
          backgroundColor: winner === tool2 ? p.glassBg : undefined,
        }}>
          <div className="font-semibold" style={{ color: p.primary }}>{tool2}</div>
          <div className="text-2xl font-bold mt-1" style={{ color: p.primary }}>{t2w}</div>
          <div className="text-xs text-muted">wins</div>
        </div>
      </div>
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
            {features.map((f, i) => (
              <tr key={f.name} className={i < features.length - 1 ? "" : ""} style={{ borderBottom: i < features.length - 1 ? `1px solid ${p.glassBorder}` : undefined }}>
                <td className="p-3">
                  <div className="font-medium">{f.name}</div>
                  {(f.tool1Detail || f.tool2Detail) && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                      {f.tool1Detail && !f.tool2 && <span>{f.tool1Detail}</span>}
                      {f.tool2Detail && !f.tool1 && <span>{f.tool2Detail}</span>}
                      {f.tool1Detail && f.tool2Detail && <span>{f.tool1Detail} · {f.tool2Detail}</span>}
                      {f.tool1Detail && f.tool2 && !f.tool2Detail && <span>{f.tool1Detail}</span>}
                      {f.tool2Detail && f.tool1 && !f.tool1Detail && <span>{f.tool2Detail}</span>}
                    </div>
                  )}
                </td>
                <td className="text-center p-3">
                  {typeof f.tool1 === "boolean" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.tool1 ? p.primary : "var(--error)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      {f.tool1 ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="16 8 10 16 8 12" /></>
                      ) : (
                        <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                      )}
                    </svg>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: p.primary, backgroundColor: p.glassBg }}>{f.tool1}</span>
                  )}
                </td>
                <td className="text-center p-3">
                  {typeof f.tool2 === "boolean" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.tool2 ? p.primary : "var(--error)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      {f.tool2 ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="16 8 10 16 8 12" /></>
                      ) : (
                        <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                      )}
                    </svg>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: p.primary, backgroundColor: p.glassBg }}>{f.tool2}</span>
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
