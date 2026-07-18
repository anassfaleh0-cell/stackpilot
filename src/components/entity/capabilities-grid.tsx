import type { SoftwareEntity } from "@/types/entities"
import { CheckCircle2, MinusCircle } from "lucide-react"

interface CapabilitiesGridProps {
  entity: SoftwareEntity
}

const capabilityMeta: Record<string, { label: string; icon: string }> = {
  api: { label: "API", icon: "code" },
  webhooks: { label: "Webhooks", icon: "webhook" },
  automation: { label: "Automation", icon: "zap" },
  marketplace: { label: "Marketplace", icon: "store" },
  templates: { label: "Templates", icon: "file" },
  collaboration: { label: "Collaboration", icon: "users" },
  analytics: { label: "Analytics", icon: "chart" },
  reporting: { label: "Reporting", icon: "bar-chart" },
  dashboards: { label: "Dashboards", icon: "layout" },
  permissions: { label: "Permissions", icon: "shield" },
  auditLogs: { label: "Audit Logs", icon: "clipboard" },
  backup: { label: "Backup", icon: "database" },
  versionHistory: { label: "Version History", icon: "clock" },
  offlineSupport: { label: "Offline Support", icon: "wifi-off" },
  ai: { label: "AI Features", icon: "brain" },
}

export function CapabilitiesGrid({ entity }: CapabilitiesGridProps) {
  const { capabilities } = entity
  if (!capabilities) return null

  const items = Object.entries(capabilityMeta)
    .filter(([key]) => key in capabilities)
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      available: capabilities[key as keyof typeof capabilities] === true,
      description: capabilities[`${key}Description` as keyof typeof capabilities] as string | undefined,
    }))

  if (items.length === 0) return null

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-start gap-3">
            {item.available ? (
              <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <MinusCircle size={16} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium">{item.label}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
