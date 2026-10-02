import type { CompanyInfo } from "@/types/content"
import type { CompanyDetail } from "@/types/entities"

export interface CompanyFacts {
  founded?: number
  headquarters?: string
  customers?: string
  employeeCount?: string
  industries?: string[]
  pricingModel?: string
  deployment?: string[]
  apiAvailable?: boolean
  migrationComplexity?: string
  legalName?: string
  platforms?: CompanyDetail["platforms"]
  ownership?: string
  parentCompany?: string
  founders?: string[]
  conflicts: string[]
}

function defined(value: unknown): boolean {
  return value !== undefined && value !== null && value !== ""
}

function sameScalar(a: unknown, b: unknown): boolean {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase()
}

function setOf(values: unknown[]): string[] {
  return values
    .flatMap((v) => String(v).split("|"))
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean)
    .sort()
}

function sameSet(a: unknown[], b: unknown[]): boolean {
  const x = setOf(a)
  const y = setOf(b)
  return x.length === y.length && x.every((v, i) => v === y[i])
}

function pick<K extends keyof CompanyFacts>(
  facts: CompanyFacts,
  key: K,
  field: string,
  reviewValue: CompanyFacts[K] | undefined,
  entityValue: CompanyFacts[K] | undefined,
  equal: (a: NonNullable<CompanyFacts[K]>, b: NonNullable<CompanyFacts[K]>) => boolean
) {
  const fromReview = defined(reviewValue)
  const fromEntity = defined(entityValue)

  if (fromReview && fromEntity) {
    if (equal(reviewValue as NonNullable<CompanyFacts[K]>, entityValue as NonNullable<CompanyFacts[K]>)) {
      facts[key] = reviewValue as CompanyFacts[K]
    } else {
      facts.conflicts.push(field)
    }
    return
  }
  if (fromReview) facts[key] = reviewValue as CompanyFacts[K]
  else if (fromEntity) facts[key] = entityValue as CompanyFacts[K]
}

export function resolveCompanyFacts(
  review?: { company?: CompanyInfo | null },
  entity?: { company?: CompanyDetail | null } | null
): CompanyFacts {
  const r = review?.company
  const e = entity?.company
  const facts: CompanyFacts = { conflicts: [] }

  pick(facts, "founded", "founded", r?.founded, e?.founded, (a, b) => a === b)
  pick(facts, "headquarters", "headquarters", r?.headquarters, e?.headquarters, sameScalar)
  pick(facts, "customers", "customers", r?.customers, e?.customers, sameScalar)
  pick(facts, "employeeCount", "employees", r?.employeeCount, e?.employees, sameScalar)
  pick(facts, "industries", "industries", r?.industries, e?.industries, (a, b) => sameSet(a, b))

  pick(facts, "pricingModel", "pricingModel", r?.pricingModel, undefined, sameScalar)
  pick(facts, "deployment", "deployment", r?.deployment, undefined, (a, b) => sameSet(a, b))
  pick(facts, "apiAvailable", "apiAvailable", r?.apiAvailable, undefined, (a, b) => a === b)
  pick(facts, "migrationComplexity", "migrationComplexity", r?.migrationComplexity, undefined, sameScalar)

  pick(facts, "legalName", "legalName", undefined, e?.legalName, sameScalar)
  pick(facts, "platforms", "platforms", undefined, e?.platforms, (a, b) => sameSet(a, b))
  pick(facts, "ownership", "ownership", undefined, e?.ownership, sameScalar)
  pick(facts, "parentCompany", "parentCompany", undefined, e?.parentCompany, sameScalar)
  pick(facts, "founders", "founders", undefined, e?.founders, (a, b) => sameSet(a, b))

  return facts
}

export function hasCompanyFacts(facts: CompanyFacts): boolean {
  return Boolean(
    facts.legalName ||
      facts.founded ||
      facts.headquarters ||
      facts.customers ||
      facts.employeeCount ||
      facts.pricingModel ||
      (facts.deployment && facts.deployment.length > 0) ||
      facts.apiAvailable !== undefined ||
      facts.migrationComplexity ||
      facts.ownership ||
      facts.parentCompany ||
      (facts.founders && facts.founders.length > 0) ||
      (facts.industries && facts.industries.length > 0) ||
      (facts.platforms && facts.platforms.length > 0)
  )
}
