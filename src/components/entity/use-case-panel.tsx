import type { SoftwareEntity } from "@/types/entities"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/editorial/glass-card"

interface UseCasePanelProps {
  entity: SoftwareEntity
}

export function UseCasePanel({ entity }: UseCasePanelProps) {
  const { useCases } = entity
  if (!useCases) return null

  const suitabilityColor = (level: string) => {
    switch (level) {
      case "High": return "success"
      case "Medium": return "warning"
      default: return "danger"
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        {useCases.primary.length > 0 && (
          <GlassCard>
            <div className="p-4">
              <h4 className="text-sm font-semibold mb-2">Primary Use Cases</h4>
              <ul className="space-y-1.5">
                {useCases.primary.map((uc) => (
                  <li key={uc} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        )}
        {useCases.secondary && useCases.secondary.length > 0 && (
          <GlassCard>
            <div className="p-4">
              <h4 className="text-sm font-semibold mb-2">Secondary Use Cases</h4>
              <ul className="space-y-1.5">
                {useCases.secondary.map((uc) => (
                  <li key={uc} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        )}
      </div>

      {useCases.idealCompanySize && useCases.idealCompanySize.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Ideal Company Size</div>
          <div className="flex flex-wrap gap-1.5">
            {useCases.idealCompanySize.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {useCases.bestIndustries && useCases.bestIndustries.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Best Industries</div>
          <div className="flex flex-wrap gap-1.5">
            {useCases.bestIndustries.map((ind) => (
              <Badge key={ind} variant="default">{ind}</Badge>
            ))}
          </div>
        </div>
      )}

      {useCases.typicalTeams && useCases.typicalTeams.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Typical Teams</div>
          <div className="flex flex-wrap gap-1.5">
            {useCases.typicalTeams.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </div>
      )}

      {useCases.commonWorkflows && useCases.commonWorkflows.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Common Workflows</div>
          <div className="flex flex-wrap gap-1.5">
            {useCases.commonWorkflows.map((w) => (
              <Badge key={w} variant="secondary">{w}</Badge>
            ))}
          </div>
        </div>
      )}

      {useCases.migrationScenarios && useCases.migrationScenarios.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Migration Scenarios</div>
          <div className="flex flex-wrap gap-1.5">
            {useCases.migrationScenarios.map((m) => (
              <Badge key={m} variant="outline">{m}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {useCases.beginnerSuitability && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground mb-1">Beginner Suitability</div>
            <Badge variant={suitabilityColor(useCases.beginnerSuitability) as "success" | "warning" | "danger"}>
              {useCases.beginnerSuitability}
            </Badge>
          </div>
        )}
        {useCases.enterpriseSuitability && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground mb-1">Enterprise Suitability</div>
            <Badge variant={suitabilityColor(useCases.enterpriseSuitability) as "success" | "warning" | "danger"}>
              {useCases.enterpriseSuitability}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
