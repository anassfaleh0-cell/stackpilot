import type { SoftwareEntity, Capabilities, SecurityDetail } from "@/types/entities"
import { getEntity } from "./data"

export interface EntityComparison {
  tool1: string
  tool2: string
  winner: string | null
  features: EntityComparisonFeature[]
  pricingDiff: string
  securityDiff: string
  capabilityDiff: string
  bestFor: string
}

export interface EntityComparisonFeature {
  name: string
  tool1: boolean | string
  tool2: boolean | string
}

export function compareEntities(slug1: string, slug2: string): EntityComparison | null {
  const e1 = getEntity(slug1)
  const e2 = getEntity(slug2)
  if (!e1 || !e2) return null

  const features = buildComparisonFeatures(e1, e2)
  const wins1 = features.filter((f) => f.tool1 && !f.tool2).length
  const wins2 = features.filter((f) => f.tool2 && !f.tool1).length
  const winner = wins1 > wins2 ? e1.name : wins2 > wins1 ? e2.name : null

  const pricingDiff = comparePricing(e1, e2)
  const securityDiff = compareSecurity(e1, e2)
  const capabilityDiff = compareCapabilities(e1, e2)
  const bestFor = determineBestFor(e1, e2)

  return { tool1: e1.name, tool2: e2.name, winner, features, pricingDiff, securityDiff, capabilityDiff, bestFor }
}

function buildComparisonFeatures(e1: SoftwareEntity, e2: SoftwareEntity): EntityComparisonFeature[] {
  const features: EntityComparisonFeature[] = []

  capabilitiesFeature("API", "api")
  capabilitiesFeature("Webhooks", "webhooks")
  capabilitiesFeature("Automation", "automation")
  capabilitiesFeature("AI", "ai")
  capabilitiesFeature("Marketplace", "marketplace")
  capabilitiesFeature("Templates", "templates")
  capabilitiesFeature("Collaboration", "collaboration")
  capabilitiesFeature("Analytics", "analytics")
  capabilitiesFeature("Reporting", "reporting")
  capabilitiesFeature("Permissions", "permissions")
  capabilitiesFeature("Audit Logs", "auditLogs")
  capabilitiesFeature("Backup", "backup")
  capabilitiesFeature("Offline Support", "offlineSupport")
  capabilitiesFeature("Import", "import")
  capabilitiesFeature("Export", "export")
  capabilitiesFeature("Custom Fields", "customFields")

  securityFeature("SOC 2", "soc2")
  securityFeature("ISO 27001", "iso27001")
  securityFeature("GDPR", "gdpr")
  securityFeature("SAML", "saml")
  securityFeature("SSO", "sso")
  securityFeature("MFA", "mfa")

  return features

  function capabilitiesFeature(label: string, key: keyof Capabilities) {
    const v1 = e1.capabilities?.[key]
    const v2 = e2.capabilities?.[key]
    if (v1 === undefined && v2 === undefined) return
    features.push({ name: label, tool1: v1 === true, tool2: v2 === true })
  }

  function securityFeature(label: string, key: keyof SecurityDetail) {
    const v1 = e1.security?.[key]
    const v2 = e2.security?.[key]
    if (v1 === undefined && v2 === undefined) return
    features.push({ name: label, tool1: v1 === true, tool2: v2 === true })
  }
}

function comparePricing(e1: SoftwareEntity, e2: SoftwareEntity): string {
  const p1 = e1.pricing?.[0]
  const p2 = e2.pricing?.[0]
  if (!p1 && !p2) return ""
  if (!p1) return `${e2.name} starts at ${formatPrice(p2)}`
  if (!p2) return `${e1.name} starts at ${formatPrice(p1)}`

  const diff = (p1.price ?? 0) - (p2.price ?? 0)
  if (diff === 0) return `Both start around the same price point`
  if (diff < 0) return `${e1.name} is more affordable starting at ${formatPrice(p1)} vs ${formatPrice(p2)}`
  return `${e2.name} is more affordable starting at ${formatPrice(p2)} vs ${formatPrice(p1)}`
}

function compareSecurity(e1: SoftwareEntity, e2: SoftwareEntity): string {
  const certs = ["soc2", "iso27001", "gdpr", "hipaa", "pciDss"] as const
  const c1 = certs.filter((c) => e1.security?.[c]).length
  const c2 = certs.filter((c) => e2.security?.[c]).length
  if (c1 === c2) return "Comparable security compliance"
  return c1 > c2 ? `${e1.name} has more security certifications` : `${e2.name} has more security certifications`
}

function compareCapabilities(e1: SoftwareEntity, e2: SoftwareEntity): string {
  const capKeys = Object.keys(e1.capabilities ?? {}).filter((k) => k.endsWith("Description") === false)
  const c1 = capKeys.filter((k) => e1.capabilities?.[k as keyof Capabilities] === true).length
  const c2 = capKeys.filter((k) => e2.capabilities?.[k as keyof Capabilities] === true).length
  if (c1 === c2) return "Similar feature breadth"
  return c1 > c2 ? `${e1.name} offers more capabilities` : `${e2.name} offers more capabilities`
}

function determineBestFor(e1: SoftwareEntity, e2: SoftwareEntity): string {
  const s1 = e1.useCases?.primary?.[0]
  const s2 = e2.useCases?.primary?.[0]
  if (s1 && s2) return `${e1.name} is best for ${s1.toLowerCase()}, while ${e2.name} excels at ${s2.toLowerCase()}`
  return "Choose based on your specific requirements"
}

function formatPrice(p: { price?: number; currency?: string; unit?: string } | undefined): string {
  if (!p || p.price === undefined) return "custom pricing"
  return `${p.currency === "USD" ? "$" : ""}${p.price}${p.unit ? "/" + p.unit : ""}`
}
