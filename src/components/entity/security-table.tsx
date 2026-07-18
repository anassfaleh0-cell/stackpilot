import type { SoftwareEntity } from "@/types/entities"
import { CheckCircle2, XCircle } from "lucide-react"

interface SecurityTableProps {
  entity: SoftwareEntity
}

const certLabels: Record<string, string> = {
  soc2: "SOC 2",
  iso27001: "ISO 27001",
  gdpr: "GDPR Compliant",
  hipaa: "HIPAA Compliant",
  ccpa: "CCPA Compliant",
  pciDss: "PCI DSS Compliant",
}

const sortedCerts = ["soc2", "iso27001", "gdpr", "hipaa", "ccpa", "pciDss"] as const

export function SecurityTable({ entity }: SecurityTableProps) {
  const { security } = entity
  if (!security) return null

  const features: { label: string; value: React.ReactNode }[] = []

  for (const key of sortedCerts) {
    const val = security[key as keyof typeof security]
    if (val === undefined) continue
    features.push({
      label: certLabels[key] || key,
      value: val ? (
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>Compliant</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <XCircle size={14} aria-hidden="true" />
          <span>Not certified</span>
        </span>
      ),
    })
  }

  if (security.saml !== undefined) {
    features.push({
      label: "SAML",
      value: security.saml ? (
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>{security.samlDescription || "Supported"}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <XCircle size={14} aria-hidden="true" />
          <span>Not supported</span>
        </span>
      ),
    })
  }

  if (security.sso !== undefined) {
    features.push({
      label: "SSO",
      value: security.sso ? (
        <span className="text-sm text-muted-foreground">{security.ssoDescription || "Supported"}</span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <XCircle size={14} aria-hidden="true" />
          <span>Not supported</span>
        </span>
      ),
    })
  }

  if (security.mfa !== undefined) {
    features.push({
      label: "MFA",
      value: security.mfa ? (
        <span className="text-sm text-muted-foreground">{security.mfaDescription || "Supported"}</span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <XCircle size={14} aria-hidden="true" />
          <span>Not supported</span>
        </span>
      ),
    })
  }

  if (security.encryption) {
    features.push({ label: "Encryption", value: <span className="text-sm text-muted-foreground">{security.encryption}</span> })
  }

  if (security.dataResidency && security.dataResidency.length > 0) {
    features.push({ label: "Data Residency", value: <span className="text-sm text-muted-foreground">{security.dataResidency.join(", ")}</span> })
  }

  if (security.sla) {
    features.push({ label: "SLA", value: <span className="text-sm text-muted-foreground">{security.sla}</span> })
  }

  if (security.penetrationTesting !== undefined) {
    features.push({
      label: "Penetration Testing",
      value: security.penetrationTesting ? (
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>Regular testing</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <XCircle size={14} aria-hidden="true" />
          <span>Not disclosed</span>
        </span>
      ),
    })
  }

  if (security.bugBounty !== undefined) {
    features.push({
      label: "Bug Bounty",
      value: security.bugBounty ? (
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>Active program</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <XCircle size={14} aria-hidden="true" />
          <span>No program</span>
        </span>
      ),
    })
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full" role="table" aria-label={`${entity.name} security and compliance details`}>
        <thead>
          <tr className="bg-muted-bg border-b border-border">
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {features.map((f, i) => (
            <tr key={f.label} className={i % 2 === 0 ? "bg-card" : "bg-muted-bg/30"}>
              <td className="px-4 py-3 text-sm font-medium">{f.label}</td>
              <td className="px-4 py-3">{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
