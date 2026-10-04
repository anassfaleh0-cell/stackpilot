import { describe, it, expect } from "vitest"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import {
  H01_CLAIM_PATHS,
  H01_CONTRACT,
  H01_CONTRACT_VERSION,
  H01_CR_RECORD_COUNTS,
  H01_EXCLUDED_ITEMS,
  H01_FUTURE_DEPENDENT_ITEMS,
  H01_GATE_LABELLED_ITEMS,
  H01_GOVERNED_ITEMS,
  H01_ID,
  H01_INCORRECTLY_BLOCKED_ITEMS,
  H01_REQUIREMENT_8,
  H01_SCOPE_MEASURES,
  H01_SCOPE_UNIT,
  H01_TITLE,
} from "@/lib/content/h01-contract"
import {
  PROVENANCE_CLAIM_COUNT,
  PROVENANCE_CLAIM_PATHS,
  PROVENANCE_HANDLINGS,
  PROVENANCE_REVIEW_SLUG_COUNT,
  PROVENANCE_STATUSES,
  canonicalUrl,
  freshnessDaysForClaimPath,
  getClaims,
  getCoverage,
  getSources,
} from "@/lib/content/provenance"
import { getAllAlternatives } from "@/lib/content/registry"
import { hasCompanyFacts, resolveCompanyFacts } from "@/lib/company-facts"
import { getEntity } from "@/lib/entities/data"
import { editorialPros, isRatingRestatement } from "@/lib/format"
import type { CompanyInfo } from "@/types/content"
import type { CompanyDetail } from "@/types/entities"

const ROOT = process.cwd()

const H01_TEST_ID = /^P5C-(CC|CR|AL|RD|EX)-\d{2}$/
const SEMVER = /^\d+\.\d+\.\d+$/
const SOURCE_ID = /^src_[0-9a-f]{16}$/
const APPROVAL_REASON = /content edit approval|editorial approval/i

const FORBIDDEN_PROVENANCE_TOKENS = [
  "content/provenance",
  "@/lib/content/provenance",
  "h01-contract",
  "next_check_due",
  "last_checked",
  "conflict_group",
]

let hasGit = false
try {
  hasGit =
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: ROOT, encoding: "utf8" }).trim() === "true"
} catch {
  hasGit = false
}

function read(relative: string): string {
  return fs.readFileSync(path.join(ROOT, ...relative.split("/")), "utf8")
}

function loadReview(slug: string): { company?: CompanyInfo | null } {
  return JSON.parse(read(`content/reviews/${slug}.json`)) as { company?: CompanyInfo | null }
}

function jsonFilesUnder(relativeDir: string): string[] {
  const dir = path.join(ROOT, ...relativeDir.split("/"))
  return fs
    .readdirSync(dir)
    .filter(name => name.endsWith(".json"))
    .sort()
    .map(name => path.join(dir, name))
}

function sourceFilesUnder(relativeDir: string): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full)
    }
  }
  walk(path.join(ROOT, ...relativeDir.split("/")))
  return out
}

function tokensIn(relativePath: string): string[] {
  const source = read(relativePath)
  return FORBIDDEN_PROVENANCE_TOKENS.filter(token => source.includes(token))
}

function provenanceBytes(): string {
  const parts = [read("content/provenance/sources.json")]
  for (const file of jsonFilesUnder("content/provenance/claims")) parts.push(fs.readFileSync(file, "utf8"))
  return parts.join("\n")
}

function versionControlCandidates(relativePath: string): string {
  return execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "--", relativePath],
    { cwd: ROOT, encoding: "utf8" },
  ).trim()
}

describe("H-01 contract", () => {
  it("exists, identifies itself and carries a parseable semver contract version", () => {
    expect(H01_CONTRACT).toBeDefined()
    expect(H01_CONTRACT.id).toBe(H01_ID)
    expect(H01_CONTRACT.id).toBe("H-01")
    expect(H01_CONTRACT.title).toBe(H01_TITLE)
    expect(H01_CONTRACT_VERSION).toMatch(SEMVER)
    expect(H01_CONTRACT.contractVersion).toBe(H01_CONTRACT_VERSION)
  })

  it("states an objective for the approval decision", () => {
    expect(H01_CONTRACT.objective).toContain("editorial approval")
    expect(H01_CONTRACT.objective).toContain("Phase 5A input requirement 8")
  })

  it("declares an explicit scope unit", () => {
    expect(H01_SCOPE_UNIT).toBe("remediation_item")
    expect(H01_CONTRACT.scope.unit).toBe(H01_SCOPE_UNIT)
    expect(H01_CONTRACT.scope.unitDefinition).toContain("P5C-* remediation_id")
  })

  it("keeps internally consistent scope counts", () => {
    expect(H01_CONTRACT.scope.count).toBe(17)
    expect(H01_CONTRACT.scope.governedItems).toHaveLength(H01_CONTRACT.scope.count)
    expect(H01_GOVERNED_ITEMS).toHaveLength(17)
    expect(H01_CONTRACT.approvalScope.count).toBe(H01_CONTRACT.scope.count)
    expect(H01_CONTRACT.approvalScope.unit).toBe(H01_CONTRACT.scope.unit)
  })

  it("keeps approved ids unique, excluded ids unique and the two sets disjoint", () => {
    const approved = H01_CONTRACT.approvalScope.approvedRemediationIds
    const excluded = H01_CONTRACT.approvalScope.excludedRemediationIds
    expect(new Set(approved).size).toBe(approved.length)
    expect(new Set(excluded).size).toBe(excluded.length)
    expect(approved).toHaveLength(17)
    expect(excluded).toHaveLength(13)
    for (const id of approved) expect(excluded).not.toContain(id)
    for (const id of [...approved, ...excluded]) expect(id).toMatch(H01_TEST_ID)
    expect(approved).toEqual([...H01_CONTRACT.scope.governedItems])
    expect(excluded).toEqual(H01_CONTRACT.scope.excludedItems.map(item => item.id))
  })

  it("declares exclusions explicitly", () => {
    expect(H01_EXCLUDED_ITEMS).toHaveLength(13)
    for (const item of H01_EXCLUDED_ITEMS) {
      expect(item.id).toMatch(H01_TEST_ID)
      expect(item.approval).toBe("not_approved")
      expect(item.ownBlockingReason.length).toBeGreaterThan(0)
      expect(Array.isArray(item.declaredUnder)).toBe(true)
    }
  })

  it("names its own version-controlled source of truth", () => {
    expect(H01_CONTRACT.authority.authoritativeSource).toBe("src/lib/content/h01-contract.ts")
    expect(H01_CONTRACT.authority.versionControlled).toBe(true)
    expect(H01_CONTRACT.authority.supersedes).toBe("_p5c_remediation_plan.json#/human_review_queue/0")
  })

  it("preserves the historical Phase 5C artifact instead of repurposing it", () => {
    const authority = H01_CONTRACT.authority
    expect(authority.historicalArtifact).toBe("_p5c_remediation_plan.json")
    expect(authority.historicalArtifactVersionControlled).toBe(false)
    expect(authority.historicalPhase).toBe("5C")
    expect(authority.historicalMode).toBe("READ_ONLY_DESIGN")
    expect(authority.reason).toContain("_*.json")
  })

  it("carries acceptance criteria covering scope, advisory posture and the SEO invariant", () => {
    expect(H01_CONTRACT.acceptanceCriteria.length).toBeGreaterThanOrEqual(12)
    const criteria = H01_CONTRACT.acceptanceCriteria.join("\n")
    expect(criteria).toContain("17 / 30 / 44 / 161 / 251 / 295")
    expect(criteria).toContain("ADVISORY_ONLY")
    expect(criteria).toContain("no renderer gate")
    expect(criteria).toContain("151 total / 99 indexable / 52 noindex")
  })
})

describe("H-01 scope model", () => {
  it("represents 17 / 30 / 44 / 161 / 251 / 295 with an explicit unit for each", () => {
    const byValue = new Map(H01_SCOPE_MEASURES.map(measure => [measure.value, measure]))
    expect([...byValue.keys()].sort((a, b) => a - b)).toEqual([17, 30, 44, 161, 251, 295])
    expect(byValue.get(17)?.unit).toBe("remediation_item")
    expect(byValue.get(30)?.unit).toBe("remediation_item")
    expect(byValue.get(44)?.unit).toBe("content_item")
    expect(byValue.get(161)?.unit).toBe("evidence_record")
    expect(byValue.get(251)?.unit).toBe("evidence_record")
    expect(byValue.get(295)?.unit).toBe("evidence_record")
    expect(byValue.get(17)?.metric).toBe("declared_block_set")
    expect(byValue.get(30)?.metric).toBe("generated_gate_label_set")
    expect(H01_CONTRACT.scopeMeasures).toHaveLength(6)
  })

  it("proves the arithmetic behind every scope measure", () => {
    expect(H01_REQUIREMENT_8.alternativesParagraphs + H01_REQUIREMENT_8.ratingStatements).toBe(44)
    expect(H01_REQUIREMENT_8.contentItems + H01_REQUIREMENT_8.companyFactRecords).toBe(295)

    const crValues = Object.values(H01_CR_RECORD_COUNTS)
    expect(crValues.reduce((sum, value) => sum + value, 0)).toBe(251)
    expect(
      H01_CR_RECORD_COUNTS["P5C-CR-01"] + H01_CR_RECORD_COUNTS["P5C-CR-02"] + H01_CR_RECORD_COUNTS["P5C-CR-06"],
    ).toBe(161)

    expect(H01_CONTRACT.approvalScope.contentItems).toBe(44)
    expect(H01_CONTRACT.approvalScope.combinedEvidenceScope).toBe(295)
    expect(H01_CONTRACT.evidenceScope.requirement8CombinedScope).toBe(295)
  })

  it("keeps approval scope separate from the evidence inventory", () => {
    expect(H01_CONTRACT.approvalScope.permissionBasis).toBe("declared_block_set")
    expect(H01_CONTRACT.evidenceScope.unit).toBe("evidence_record")
    expect(H01_CONTRACT.evidenceScope.inventory.total).toBe(374)
    expect(H01_CONTRACT.evidenceScope.requirement8CombinedScope).not.toBe(H01_CONTRACT.scope.count)
    expect(H01_CONTRACT.evidenceScope.requirement8CombinedScope).not.toBe(H01_CONTRACT.scope.secondary.count)
    expect(H01_CONTRACT.evidenceScope.note).toContain("not interchangeable")
  })

  it("records requirement 8 with its original Phase 5A meaning", () => {
    expect(H01_CONTRACT.approvalScope.source).toBe("_PHASE5A_REMEDIATION_DESIGN.md requirement 8")
    expect(H01_CONTRACT.approvalScope.alternativesParagraphs).toBe(29)
    expect(H01_CONTRACT.approvalScope.ratingStatements).toBe(15)
    expect(H01_CONTRACT.approvalScope.companyFactRecords).toBe(251)
    expect(H01_CONTRACT.scopeMeasures.find(m => m.value === 44)?.definition).toBe(
      "29 alternatives paragraphs + 15 rating statements",
    )
  })
})

describe("H-01 scope: the 17-vs-30 decision", () => {
  it("records both metrics without collapsing them into one number", () => {
    expect(H01_CONTRACT.scope.count).toBe(17)
    expect(H01_CONTRACT.scope.countMetric).toBe("declared_block_set")
    expect(H01_CONTRACT.scope.secondary.count).toBe(30)
    expect(H01_CONTRACT.scope.secondary.countMetric).toBe("generated_gate_label_set")
    expect(H01_CONTRACT.scope.secondary.items).toHaveLength(30)
    expect(H01_CONTRACT.scope.secondary.isScope).toBe(false)
    expect(H01_CONTRACT.scope.secondary.source).toContain("GATES_BY_PREFIX")
  })

  it("reconciles 17 governed + 13 excluded = 30 gate-labelled items with no unexplained mismatch", () => {
    const governed = new Set(H01_CONTRACT.scope.governedItems)
    const excluded = new Set(H01_CONTRACT.scope.excludedItems.map(item => item.id))
    const gateLabelled = new Set(H01_CONTRACT.scope.secondary.items)
    const union = new Set([...governed, ...excluded])

    expect(gateLabelled.size).toBe(30)
    expect(union.size).toBe(30)
    expect(governed.size + excluded.size).toBe(gateLabelled.size)
    for (const id of gateLabelled) expect(union.has(id)).toBe(true)
    for (const id of union) expect(gateLabelled.has(id)).toBe(true)
  })

  it("splits the delta into incorrectly blocked and future-dependent remediation items", () => {
    expect(H01_INCORRECTLY_BLOCKED_ITEMS).toEqual(["P5C-AL-03", "P5C-RD-04"])
    expect(H01_FUTURE_DEPENDENT_ITEMS).toHaveLength(11)
    expect(H01_INCORRECTLY_BLOCKED_ITEMS).toHaveLength(2)
    expect(H01_INCORRECTLY_BLOCKED_ITEMS.length + H01_FUTURE_DEPENDENT_ITEMS.length).toBe(H01_EXCLUDED_ITEMS.length)

    for (const item of H01_EXCLUDED_ITEMS) {
      const expectsApproval = APPROVAL_REASON.test(item.ownBlockingReason)
      if (item.category === "incorrectly_blocked") expect(expectsApproval).toBe(false)
      else expect(expectsApproval).toBe(true)
    }
  })

  it("records the queue entry that declares each excluded item", () => {
    const undeclared = H01_EXCLUDED_ITEMS.filter(item => item.declaredUnder.length === 0).map(item => item.id)
    expect(undeclared.sort()).toEqual(["P5C-AL-04", "P5C-EX-03", "P5C-EX-07", "P5C-RD-04", "P5C-RD-05"])

    const queueIds = new Set(Array.from({ length: 14 }, (_, i) => `H-${String(i + 1).padStart(2, "0")}`))
    for (const item of H01_EXCLUDED_ITEMS) {
      for (const gate of item.declaredUnder) expect(queueIds.has(gate)).toBe(true)
      expect(item.declaredUnder).not.toContain("H-01")
    }
  })

  it("never lets the generated gate label become the scope", () => {
    expect(H01_CONTRACT.scope.secondary.count).not.toBe(H01_CONTRACT.scope.count)
    expect(H01_CONTRACT.scope.secondary.isScope).toBe(false)
    expect(H01_CONTRACT.scope.countMetric).not.toBe(H01_CONTRACT.scope.secondary.countMetric)
    expect(H01_CONTRACT.scope.governedItems).not.toEqual([...H01_GATE_LABELLED_ITEMS])
  })
})

describe("H-01 approval state", () => {
  const state = H01_CONTRACT.approvalState

  it("is explicit and versioned", () => {
    expect(state.status).toBe("GRANTED")
    expect(state.explicit).toBe(true)
    expect(state.scope).toBe("approved_remediation_ids")
    expect(state.establishedBy).toBe("H-01 contract v1.0.0")
    expect(state.outsideApprovedScope).toBe("blocked")
  })

  it("never grants approval implicitly because blocking_reason mentions H-01", () => {
    expect(state.implicitFromBlockingReason).toBe(false)
    const approved = new Set(H01_CONTRACT.approvalScope.approvedRemediationIds)
    const gateLabelled = new Set(H01_CONTRACT.scope.secondary.items)
    expect(gateLabelled.size).toBe(30)
    for (const id of gateLabelled) {
      if (approved.has(id)) continue
      expect(H01_CONTRACT.approvalScope.excludedRemediationIds).toContain(id)
    }
    expect(approved.size).toBe(17)
    expect(gateLabelled.size - approved.size).toBe(13)
  })

  it("keeps every item outside the approved scope blocked", () => {
    expect(H01_CONTRACT.approvalEffect.excludedRemainBlocked).toHaveLength(13)
    for (const item of H01_EXCLUDED_ITEMS) {
      expect(item.approval).toBe("not_approved")
      expect(item.ownBlockingReason.length).toBeGreaterThan(0)
      expect(H01_CONTRACT.approvalEffect.excludedRemainBlocked).toContain(item.id)
      expect(H01_CONTRACT.approvalScope.approvedRemediationIds).not.toContain(item.id)
    }
    expect(H01_CONTRACT.approvalEffect.approvedCount).toBe(17)
    expect(state.outsideApprovedScope).toBe("blocked")
  })

  it("lists exactly what the approval does not grant", () => {
    const notGranted = H01_CONTRACT.approvalEffect.doesNotGrant
    expect(notGranted).toContain("renderer gate")
    expect(notGranted).toContain("company.* provenance paths")
    expect(notGranted).toContain("provenance-backed VERIFIED company claims")
    expect(notGranted).toContain("indexability or noindex changes")
    expect(notGranted).toContain("publication of content/alternatives/*.json")
  })

  it("records its dependencies on the sibling human-review decisions", () => {
    expect(H01_CONTRACT.dependencies.humanReviewItems).toEqual(["H-02", "H-03", "H-04", "H-05", "H-06"])
    expect(H01_CONTRACT.dependencies.gatesRemediationIds).toEqual([...H01_GOVERNED_ITEMS])
    expect(H01_CONTRACT.dependencies.dependsOn.join(" ")).toContain("8431367")
  })
})

describe("H-01 company conflicts (T-CONF-01)", () => {
  it("does not publish a value when the two sources disagree", () => {
    const reviewSide = { company: { founded: 2013, customers: "490K+" } } as unknown as {
      company?: CompanyInfo | null
    }
    const entitySide = { company: { founded: 2021, customers: "30,000+" } } as unknown as {
      company?: CompanyDetail | null
    }
    const facts = resolveCompanyFacts(reviewSide, entitySide)

    expect(facts.conflicts).toContain("founded")
    expect(facts.founded).toBeUndefined()
    expect(facts.conflicts).toContain("customers")
    expect(facts.customers).toBeUndefined()
  })

  it("publishes the value when the two sources agree", () => {
    const reviewSide = { company: { founded: 2013, headquarters: "New York, NY" } } as unknown as {
      company?: CompanyInfo | null
    }
    const entitySide = { company: { founded: 2013, headquarters: "new york, ny" } } as unknown as {
      company?: CompanyDetail | null
    }
    const facts = resolveCompanyFacts(reviewSide, entitySide)

    expect(facts.founded).toBe(2013)
    expect(facts.headquarters).toBe("New York, NY")
    expect(facts.conflicts).toEqual([])
    expect(hasCompanyFacts(facts)).toBe(true)
  })

  it("keeps H-01 from bypassing the existing equality gate", () => {
    expect(H01_CONTRACT.conflictRules.inRepoValueDisagreementOmitsField).toBe(true)
    const companyFacts = read("src/lib/company-facts.ts")
    expect(companyFacts).not.toMatch(/h01-contract/)
    expect(companyFacts).not.toMatch(/H-01/)
    expect(companyFacts).not.toMatch(/provenance/i)
    expect(tokensIn("src/lib/company-facts.ts")).toEqual([])
  })

  it("holds for every provenance cohort review", () => {
    const slugs = jsonFilesUnder("content/provenance/claims").map(file => path.basename(file, ".json"))
    expect(slugs).toHaveLength(52)

    let disagreements = 0
    for (const slug of slugs) {
      const facts = resolveCompanyFacts(loadReview(slug), getEntity(slug))
      expect(hasCompanyFacts(facts)).toBe(true)
      for (const key of facts.conflicts) {
        disagreements++
        expect((facts as unknown as Record<string, unknown>)[key]).toBeUndefined()
      }
    }
    expect(disagreements).toBeGreaterThan(0)
  })
})

describe("H-01 alternatives", () => {
  it("keeps published:false alternatives out of the published catalogue", () => {
    const catalogue = new Set(getAllAlternatives().map(alternative => alternative.slug))
    let unpublished = 0

    for (const file of jsonFilesUnder("content/alternatives")) {
      const data = JSON.parse(fs.readFileSync(file, "utf8")) as { slug?: string; published?: boolean }
      if (data.published !== false) continue
      unpublished++
      expect(data.slug).toBeTruthy()
      expect(catalogue.has(data.slug as string)).toBe(false)
    }

    expect(unpublished).toBeGreaterThan(0)
    expect(catalogue.size).toBeGreaterThan(0)
  })

  it("does not approve publishing alternatives or any excluded alternatives item", () => {
    expect(H01_CONTRACT.approvalEffect.doesNotGrant).toContain("publication of content/alternatives/*.json")
    const approved = H01_CONTRACT.approvalScope.approvedRemediationIds
    for (const id of ["P5C-AL-03", "P5C-AL-04", "P5C-AL-05"]) {
      expect(approved).not.toContain(id)
      expect(H01_CONTRACT.approvalScope.excludedRemediationIds).toContain(id)
    }
    expect(approved).toContain("P5C-AL-01")
    expect(approved).toContain("P5C-AL-02")
  })

  it("keeps the approved alternatives items tied to their own blocking reason", () => {
    for (const id of ["P5C-AL-01", "P5C-AL-02"]) {
      expect(H01_CONTRACT.approvalScope.approvedRemediationIds).toContain(id)
    }
    const source = read("src/lib/content/h01-contract.ts")
    expect(source).toContain("Removal of named products from editorial prose requires editorial approval.")
  })
})

describe("H-01 rating detector", () => {
  it("leaves isRatingRestatement and editorialPros behaviour intact", () => {
    expect(isRatingRestatement("Rated 4.6 out of 5 from 1,300 reviews")).toBe(true)
    expect(isRatingRestatement("Rated 4.6 out of 5")).toBe(false)
    expect(isRatingRestatement("A recorded rating of 4.2 out of 5 from 1,700 reviews")).toBe(false)
    expect(editorialPros(["Rated 4.3 out of 5 from 660 reviews", "Fast to set up"])).toEqual(["Fast to set up"])
  })

  it("does not broaden or weaken the detector across the review corpus", () => {
    let matched = 0
    for (const file of jsonFilesUnder("content/reviews")) {
      const data = JSON.parse(fs.readFileSync(file, "utf8")) as { pros?: string[] }
      const pros = Array.isArray(data.pros) ? data.pros : []
      const kept = editorialPros(pros)
      const dropped = pros.length - kept.length
      expect(dropped).toBe(pros.filter(pro => isRatingRestatement(pro)).length)
      matched += dropped
    }
    expect(matched).toBe(11)
  })

  it("keeps the rating renderer free of the H-01 contract", () => {
    expect(tokensIn("src/lib/format.ts")).toEqual([])
    const format = read("src/lib/format.ts")
    expect(format).toContain("const RATING_RESTATEMENT = /^Rated")
    expect(H01_CONTRACT.renderingPosture.rendererGate).toBe(false)
  })
})

describe("H-01 provenance integrity", () => {
  it("keeps the active provenance surface at 13 paths, 676 records, 52 slugs and 283 sources", () => {
    expect(PROVENANCE_CLAIM_PATHS).toHaveLength(13)
    expect(PROVENANCE_CLAIM_COUNT).toBe(676)
    expect(PROVENANCE_REVIEW_SLUG_COUNT).toBe(52)
    expect(getSources()).toHaveLength(283)

    const coverage = getCoverage()
    expect(coverage.slugsWithClaimsFile).toBe(52)
    expect(coverage.totalExpectedClaims).toBe(676)
    expect(coverage.claimsWithProvenance).toBe(676)
    expect(coverage.recordsComplete).toBe(true)
  })

  it("keeps every H-01 claim path disjoint from the active provenance claim paths", () => {
    expect(H01_CLAIM_PATHS).toHaveLength(7)
    const active = new Set<string>(PROVENANCE_CLAIM_PATHS)
    for (const claimPath of H01_CLAIM_PATHS) expect(active.has(claimPath)).toBe(false)
    expect(H01_CONTRACT.classification.claimPaths).toEqual([...H01_CLAIM_PATHS])
    for (const claimPath of PROVENANCE_CLAIM_PATHS) expect(claimPath.startsWith("company.")).toBe(false)
  })

  it("keeps no retired or date-replacement provenance claim paths", () => {
    const retired = ["last_reviewed", "content_published", "content_modified"]
    for (const claimPath of retired) expect(PROVENANCE_CLAIM_PATHS).not.toContain(claimPath as never)
    for (const file of jsonFilesUnder("content/provenance/claims")) {
      const claims = JSON.parse(fs.readFileSync(file, "utf8")) as { claim_path: string }[]
      for (const claim of claims) expect(retired).not.toContain(claim.claim_path)
    }
  })

  it("rejects invalid source references structurally", () => {
    const contract = H01_CONTRACT.sourceRequirements
    const sources = getSources()
    expect(contract.invalidSourceReferenceFails).toBe(true)
    expect(sources).toHaveLength(contract.registerSize)

    const tiers: Record<string, number> = {}
    for (const source of sources) {
      expect(source.source_id).toMatch(SOURCE_ID)
      expect(source.canonical_url).toBe(canonicalUrl(source.canonical_url))
      expect(source.canonical_url.startsWith("https://")).toBe(true)
      expect(source.canonical_url).not.toContain("pilotstack.online")
      expect([1, 2, 3]).toContain(source.source_tier)
      tiers[String(source.source_tier)] = (tiers[String(source.source_tier)] ?? 0) + 1
    }
    expect(tiers).toEqual(contract.tierDistribution)
    expect(contract.internalSourceCount).toBe(0)
    expect(getCoverage().claimsWithDanglingSourceRefs).toBe(0)
  })

  it("never promotes a status to VERIFIED automatically", () => {
    const coverage = getCoverage()
    expect(H01_CONTRACT.statusRules.automaticVerification).toBe(false)
    expect(coverage.byStatus.VERIFIED).toBeUndefined()
    expect(coverage.byStatus[H01_CONTRACT.statusRules.reservedStatus]).toBeUndefined()
    expect(H01_CONTRACT.statusRules.reservedStatusRecordCount).toBe(0)
    expect(H01_CONTRACT.statusRules.forbiddenTransitions).toHaveLength(4)
    expect(H01_CONTRACT.statusRules.forbiddenTransitions[3]).toContain("script")
  })

  it("keeps stored statuses and handlings inside the contract enums", () => {
    const coverage = getCoverage()
    const statuses = new Set<string>(PROVENANCE_STATUSES)
    const handlings = new Set<string>(PROVENANCE_HANDLINGS)
    expect(new Set(H01_CONTRACT.statusRules.allowed)).toEqual(statuses)
    expect(new Set(H01_CONTRACT.handlingRules.allowed)).toEqual(handlings)
    for (const status of Object.keys(coverage.byStatus)) expect(statuses.has(status)).toBe(true)
    for (const handling of Object.keys(coverage.byHandling)) expect(handlings.has(handling)).toBe(true)
  })

  it("reports freshness without mutating stored claims", () => {
    const before = provenanceBytes()
    const policy = H01_CONTRACT.freshnessRules
    expect(policy.reportingOnly).toBe(true)
    expect(policy.windowsDays).toEqual({ pricing_90d: 90, company_180d: 180, editorial_365d: 365 })
    expect(policy.policy).toEqual({ price_range: "pricing_90d", pricing_object: "pricing_90d" })
    expect(freshnessDaysForClaimPath("price_range")).toBe(90)
    expect(freshnessDaysForClaimPath("rating")).toBe(365)

    getCoverage()
    getSources()
    getClaims("affinity")
    expect(provenanceBytes()).toBe(before)
  })
})

describe("H-01 ADD_PROVENANCE reclassification", () => {
  const reclassification = H01_CONTRACT.handlingReclassifications[0]

  it("reclassifies the 50 company ADD_PROVENANCE records without a company.* path", () => {
    expect(H01_CONTRACT.handlingReclassifications).toHaveLength(1)
    expect(reclassification.remediationId).toBe("P5C-CR-03")
    expect(reclassification.recordCount).toBe(50)
    expect(reclassification.previousHandling).toBe("ADD_PROVENANCE")
    expect(reclassification.handling).toBe("REMAIN_UNVERIFIED")
    expect(reclassification.createsCompanyProvenancePath).toBe(false)
    expect(["KEEP", "REVIEW_RENDERER", "REQUIRE_MANUAL_REVIEW", "REMAIN_UNVERIFIED", "OMIT"]).toContain(
      reclassification.handling,
    )
    expect(H01_CR_RECORD_COUNTS["P5C-CR-03"]).toBe(50)
  })

  it("keeps stored ADD_PROVENANCE claims on active claim paths only", () => {
    const active = new Set<string>(PROVENANCE_CLAIM_PATHS)
    let stored = 0
    for (const file of jsonFilesUnder("content/provenance/claims")) {
      const claims = JSON.parse(fs.readFileSync(file, "utf8")) as { claim_path: string; handling: string }[]
      for (const claim of claims) {
        if (claim.handling !== "ADD_PROVENANCE") continue
        stored++
        expect(active.has(claim.claim_path)).toBe(true)
        expect(claim.claim_path.startsWith("company.")).toBe(false)
      }
    }
    expect(stored).toBeGreaterThan(0)
    expect(H01_CONTRACT.handlingRules.allowed).toContain("ADD_PROVENANCE")
    expect(H01_CONTRACT.handlingRules.allowed).toContain("REMAIN_UNVERIFIED")
  })
})

describe("H-01 advisory posture (Q3 = A)", () => {
  const posture = H01_CONTRACT.renderingPosture

  it("declares ADVISORY_ONLY enforcement with no renderer gate", () => {
    expect(posture.provenanceEnforcement).toBe("ADVISORY_ONLY")
    expect(posture.rendererGate).toBe(false)
    expect(posture.contentSuppression).toBe(false)
    expect(posture.h08AdvisoryOnlyCompatible).toBe(true)
    expect(H01_CONTRACT.conflictRules.provenanceConflictSuppressesRendering).toBe(false)
    expect(H01_CONTRACT.handlingRules.rendererSuppressionFromHandling).toBe(false)
    expect(H01_CONTRACT.freshnessRules.staleSuppressesRendering).toBe(false)
  })

  it("does not suppress rendering when provenance is missing", () => {
    expect(posture.missingProvenanceSuppressesRendering).toBe(false)

    const claims = getClaims("affinity")
    expect(claims).toHaveLength(13)
    expect(claims.every(claim => claim.status === "MISSING")).toBe(true)
    expect(claims.every(claim => claim.source_ids.length === 0)).toBe(true)

    const review = loadReview("affinity")
    expect(hasCompanyFacts(resolveCompanyFacts(review, null))).toBe(true)
    expect(hasCompanyFacts(resolveCompanyFacts(review, getEntity("affinity")))).toBe(true)
  })

  it("does not suppress rendering when provenance is stale", () => {
    expect(posture.staleProvenanceSuppressesRendering).toBe(false)

    const claims = getClaims("affinity")
    const dueDates = new Set(claims.map(claim => claim.next_check_due))
    expect(dueDates.size).toBeGreaterThan(0)
    for (const due of dueDates) expect(Date.parse(due)).toBeGreaterThan(Date.parse("2026-10-03T00:00:00Z"))

    expect(hasCompanyFacts(resolveCompanyFacts(loadReview("affinity"), null))).toBe(true)
  })

  it("does not suppress rendering when provenance is conflicting", () => {
    expect(posture.conflictingProvenanceSuppressesRendering).toBe(false)

    const conflicted = getClaims("auth0").filter(claim => claim.conflict_group !== null)
    expect(conflicted.map(claim => claim.claim_path).sort()).toEqual(["price_range", "pricing_object"])

    const review = loadReview("auth0")
    expect(hasCompanyFacts(resolveCompanyFacts(review, null))).toBe(true)
    expect(hasCompanyFacts(resolveCompanyFacts(review, getEntity("auth0")))).toBe(true)
  })

  it("keeps provenance and the H-01 contract out of app and component code", () => {
    const surfaces = [...sourceFilesUnder("src/app"), ...sourceFilesUnder("src/components")]
    expect(surfaces.length).toBeGreaterThan(50)
    for (const file of surfaces) {
      const source = fs.readFileSync(file, "utf8")
      expect(source).not.toMatch(/content\/provenance/)
      expect(source).not.toMatch(/h01-contract/)
      expect(source).not.toMatch(/next_check_due/)
      expect(source).not.toMatch(/last_checked/)
      expect(source).not.toMatch(/conflict_group/)
    }
  })

  it("never lets the H-01 contract become a renderer dependency", () => {
    const contractSource = read("src/lib/content/h01-contract.ts")
    const specifiers = [...contractSource.matchAll(/from\s+"([^"]+)"/g)].map(match => match[1])
    expect(specifiers).toEqual(["@/lib/content/provenance"])
    expect(contractSource).not.toMatch(/@\/app\//)
    expect(contractSource).not.toMatch(/@\/components\//)
    expect(contractSource).not.toMatch(/company-facts/)
    expect(contractSource).not.toMatch(/from\s+"@\/lib\/format"/)
    expect([...contractSource.matchAll(/\bimport\s*\(/g)]).toHaveLength(0)
    expect([...contractSource.matchAll(/\brequire\s*\(/g)]).toHaveLength(0)
  })

  it("leaves company facts and rating formatting free of provenance inputs", () => {
    expect(tokensIn("src/lib/company-facts.ts")).toEqual([])
    expect(tokensIn("src/lib/format.ts")).toEqual([])
  })
})

describe("H-01 external evidence", () => {
  it("adds no provenance renderer gate to the structured-data or review surfaces", () => {
    expect(tokensIn("src/components/seo/json-ld.tsx")).toEqual([])
    expect(tokensIn("src/app/reviews/[slug]/page.tsx")).toEqual([])
    expect(H01_CONTRACT.renderingPosture.rendererGate).toBe(false)
    expect(H01_CONTRACT.classification.evidenceDomains).toContain("external_reviews")
    expect(H01_CONTRACT.classification.evidenceRecordCounts.external_reviews).toBe(70)
  })
})

describe("H-01 SEO safety", () => {
  it("keeps the review indexability invariant at 151 / 99 / 52", () => {
    const invariant = H01_CONTRACT.seoSafety.invariant
    const noindex = JSON.parse(read("noindex-list.json")) as {
      directories: { reviews: { keep: string[]; noindex: string[] } }
    }
    const keep = new Set(noindex.directories.reviews.keep)
    const noindexed = new Set(noindex.directories.reviews.noindex)
    const reviewFiles = jsonFilesUnder("content/reviews")

    expect(keep.size).toBe(99)
    expect(noindexed.size).toBe(52)
    expect(keep.size + noindexed.size).toBe(151)
    expect(reviewFiles).toHaveLength(151)
    expect(invariant).toEqual({ totalReviews: 151, indexable: 99, noindex: 52 })
    expect(H01_CONTRACT.seoSafety.indexabilityMayChange).toBe(false)
  })

  it("keeps every forbidden SEO surface free of H-01 and provenance logic", () => {
    const surfaces = H01_CONTRACT.seoSafety.forbiddenSurfaces
    expect(surfaces).toHaveLength(9)
    for (const surface of surfaces) {
      expect(tokensIn(surface)).toEqual([])
      expect(read(surface)).not.toMatch(/H-01/)
    }
    expect(H01_CONTRACT.seoSafety.urlSetMayChange).toBe(false)
    expect(H01_CONTRACT.seoSafety.aggregateRatingMayChange).toBe(false)
    expect(H01_CONTRACT.seoSafety.reviewRatingMayChange).toBe(false)
  })

  it("leaves the review route set and the rating schema untouched", () => {
    expect(fs.existsSync(path.join(ROOT, "src", "app", "reviews", "[slug]", "page.tsx"))).toBe(true)
    const page = read("src/app/reviews/[slug]/page.tsx")
    expect(page).not.toMatch(/AggregateRating/)
    const jsonLd = read("src/components/seo/json-ld.tsx")
    expect(jsonLd).not.toMatch(/h01-contract/)
    expect(jsonLd).not.toMatch(/content\/provenance/)
  })
})

describe.skipIf(!hasGit)("H-01 contract versioning (B1)", () => {
  it("is version-controllable while the generated Phase 5C plan is not", () => {
    expect(versionControlCandidates("src/lib/content/h01-contract.ts")).toBe("src/lib/content/h01-contract.ts")
    expect(versionControlCandidates("src/test/h01-contract.test.ts")).toBe("src/test/h01-contract.test.ts")
    expect(versionControlCandidates("_p5c_remediation_plan.json")).toBe("")
    expect(versionControlCandidates("_p5c_build.cjs")).toBe("")
  })
})
