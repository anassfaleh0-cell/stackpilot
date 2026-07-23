import { compareEntities } from "@/lib/entities/comparison"
import { getEntity, getAllEntities } from "@/lib/entities/data"
import { getComparison } from "@/lib/content/registry"
import Link from "next/link"
import { GlassCard } from "@/components/editorial/glass-card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"

interface AutoComparisonProps {
  slug: string
  className?: string
}

export function AutoComparison({ slug, className = "" }: AutoComparisonProps) {
  const entity = getEntity(slug)
  if (!entity) return null

  const allEntities = getAllEntities().filter((e) => e.slug !== slug)
  const alternatives = allEntities.slice(0, 3)

  return (
    <div className={`space-y-6 ${className}`}>
      {alternatives.map((alt) => {
        const comp = compareEntities(slug, alt.slug)
        if (!comp) return null
        const compSlug = `${slug}-vs-${alt.slug}`
        const hasComparison = getComparison(compSlug)
        return (
          <GlassCard key={alt.slug}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{entity.name} vs {alt.name}</h3>
                {comp.winner && (
                  <Badge variant={comp.winner === entity.name ? "success" : "secondary"}>
                    {comp.winner === entity.name ? `${entity.name} leads` : `${alt.name} leads`}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{comp.bestFor}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {comp.features.slice(0, 4).map((f) => (
                  <div key={f.name} className="flex items-center gap-1.5 text-xs">
                    {typeof f.tool1 === "boolean" ? (
                      f.tool1 ? <CheckCircle2 size={10} className="text-success shrink-0" /> : <XCircle size={10} className="text-muted-foreground shrink-0" />
                    ) : <span className="text-muted-foreground">{f.tool1}</span>}
                    <span className="text-muted-foreground">vs</span>
                    {typeof f.tool2 === "boolean" ? (
                      f.tool2 ? <CheckCircle2 size={10} className="text-success shrink-0" /> : <XCircle size={10} className="text-muted-foreground shrink-0" />
                    ) : <span className="text-muted-foreground">{f.tool2}</span>}
                    <span className="text-muted-foreground ml-auto">{f.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>{comp.pricingDiff}</p>
                <p>{comp.securityDiff}</p>
              </div>
              {hasComparison && (
                <Link
                  href={`/comparisons/${compSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-3"
                >
                  Full comparison <ArrowRight size={10} />
                </Link>
              )}
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
