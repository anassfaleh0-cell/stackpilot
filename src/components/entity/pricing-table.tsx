import type { SoftwareEntity, PricingDetail } from "@/types/entities"

interface PricingTableProps {
  entity: SoftwareEntity
}

function PlanRow({ plan, index }: { plan: PricingDetail; index: number }) {
  return (
    <tr className={index % 2 === 0 ? "bg-card" : "bg-muted-bg/30"}>
      <td className="px-4 py-3 text-sm font-medium">
        {plan.highlighted ? (
          <span className="inline-flex items-center gap-1.5">
            {plan.plan}
            <span className="text-[10px] font-medium text-success bg-success-subtle px-1.5 py-0.5 rounded-full">Recommended</span>
          </span>
        ) : (
          plan.plan
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        {plan.price !== undefined ? (
          <span>
            {plan.currency === "USD" ? "$" : plan.currency}{plan.price.toLocaleString()}
            {plan.unit ? <span className="text-xs text-muted-foreground"> /{plan.unit}</span> : ""}
          </span>
        ) : (
          <span className="text-muted-foreground">{plan.description || "Custom"}</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{plan.billing}</td>
      {plan.description && (
        <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{plan.description}</td>
      )}
    </tr>
  )
}

export function PricingTable({ entity }: PricingTableProps) {
  const { pricing } = entity
  if (!pricing || pricing.length === 0) return null

  const hasDescriptions = pricing.some((p) => p.description)

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" aria-label={`${entity.name} pricing plans`}>
          <thead>
            <tr className="bg-muted-bg border-b border-border">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Billing</th>
              {hasDescriptions && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Details</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pricing.map((plan, i) => (
              <PlanRow key={plan.plan} plan={plan} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
