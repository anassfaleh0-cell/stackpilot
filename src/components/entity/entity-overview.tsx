import type { SoftwareEntity } from "@/types/entities"
import { Badge } from "@/components/ui/badge"

interface EntityOverviewProps {
  entity: SoftwareEntity
}

export function EntityOverview({ entity }: EntityOverviewProps) {
  const { company } = entity
  if (!company) return null

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h2 className="text-xl font-bold">About {entity.name}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {company.legalName && (
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Legal Name</div>
            <div className="text-sm font-medium">{company.legalName}</div>
          </div>
        )}
        {company.founded && (
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Founded</div>
            <div className="text-sm font-medium">{company.founded}</div>
          </div>
        )}
        {company.headquarters && (
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Headquarters</div>
            <div className="text-sm font-medium">{company.headquarters}</div>
          </div>
        )}
        {company.ownership && (
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Ownership</div>
            <div className="text-sm font-medium">{company.ownership}{company.parentCompany ? ` (${company.parentCompany})` : ""}</div>
          </div>
        )}
        {company.employees && (
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Employees</div>
            <div className="text-sm font-medium">{company.employees}</div>
          </div>
        )}
        {company.customers && (
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Customers</div>
            <div className="text-sm font-medium">{company.customers}</div>
          </div>
        )}
      </div>
      {company.founders && company.founders.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1">Founders</div>
          <div className="flex flex-wrap gap-1.5">
            {company.founders.map((f) => (
              <Badge key={f} variant="outline">{f}</Badge>
            ))}
          </div>
        </div>
      )}
      {company.industries && company.industries.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1">Industries</div>
          <div className="flex flex-wrap gap-1.5">
            {company.industries.map((ind) => (
              <Badge key={ind} variant="secondary">{ind}</Badge>
            ))}
          </div>
        </div>
      )}
      {company.platforms && company.platforms.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1">Platforms</div>
          <div className="flex flex-wrap gap-1.5">
            {company.platforms.map((p) => (
              <Badge key={p} variant="default">{p}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
