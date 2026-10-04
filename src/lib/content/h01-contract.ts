import {
  PROVENANCE_CLAIM_PATHS,
  PROVENANCE_FRESHNESS_DAYS,
  PROVENANCE_HANDLINGS,
  PROVENANCE_POLICY_BY_PATH,
  PROVENANCE_STATUSES,
} from "@/lib/content/provenance"

export const H01_ID = "H-01"

export const H01_TITLE = "content edit approval scope"

export const H01_CONTRACT_VERSION = "1.0.0"

export const H01_SCOPE_UNIT = "remediation_item"

export const H01_SCOPE_UNIT_DEFINITION =
  "one Phase 5C remediation work item identified by its P5C-* remediation_id"

export const H01_DECLARED_BLOCK_SET_METRIC = "declared_block_set"

export const H01_GATE_LABEL_SET_METRIC = "generated_gate_label_set"

export const H01_GOVERNED_ITEMS = [
  "P5C-CC-01",
  "P5C-CC-02",
  "P5C-CC-03",
  "P5C-CC-04",
  "P5C-CC-05",
  "P5C-CC-06",
  "P5C-CC-07",
  "P5C-CC-08",
  "P5C-CC-09",
  "P5C-CR-01",
  "P5C-CR-02",
  "P5C-CR-06",
  "P5C-AL-01",
  "P5C-AL-02",
  "P5C-RD-01",
  "P5C-RD-02",
  "P5C-RD-03",
] as const

export type H01ExcludedCategory = "approved_scope" | "future_dependent_remediation" | "incorrectly_blocked"

export interface H01ExcludedItem {
  id: string
  approval: "not_approved"
  category: H01ExcludedCategory
  ownBlockingReason: string
  declaredUnder: string[]
}

const EX_CONTENT_EDIT =
  "Content edit approval scope is not yet granted; conflicting claims may only be removed, never resolved, without new evidence."

export const H01_EXCLUDED_ITEMS: readonly H01ExcludedItem[] = Object.freeze([
  {
    id: "P5C-AL-03",
    approval: "not_approved",
    category: "incorrectly_blocked",
    ownBlockingReason:
      "Publication decision for content/alternatives/*.json has not been made (Phase 5A input requirement 5).",
    declaredUnder: ["H-02"],
  },
  {
    id: "P5C-AL-04",
    approval: "not_approved",
    category: "future_dependent_remediation",
    ownBlockingReason: "Removal of named products from editorial prose requires editorial approval.",
    declaredUnder: [],
  },
  {
    id: "P5C-AL-05",
    approval: "not_approved",
    category: "future_dependent_remediation",
    ownBlockingReason: "Removal of named products from editorial prose requires editorial approval.",
    declaredUnder: ["H-04"],
  },
  {
    id: "P5C-CR-05",
    approval: "not_approved",
    category: "future_dependent_remediation",
    ownBlockingReason: "Content edit approval scope is not yet granted.",
    declaredUnder: ["H-06"],
  },
  { id: "P5C-EX-01", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: ["H-04"] },
  { id: "P5C-EX-02", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: ["H-04"] },
  { id: "P5C-EX-03", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: [] },
  { id: "P5C-EX-04", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: ["H-04"] },
  { id: "P5C-EX-05", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: ["H-04"] },
  { id: "P5C-EX-06", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: ["H-04"] },
  { id: "P5C-EX-07", approval: "not_approved", category: "future_dependent_remediation", ownBlockingReason: EX_CONTENT_EDIT, declaredUnder: [] },
  {
    id: "P5C-RD-04",
    approval: "not_approved",
    category: "incorrectly_blocked",
    ownBlockingReason: "None - detector work can start immediately.",
    declaredUnder: [],
  },
  {
    id: "P5C-RD-05",
    approval: "not_approved",
    category: "future_dependent_remediation",
    ownBlockingReason: "Rewriting or deleting editorial prose requires editorial approval.",
    declaredUnder: [],
  },
])

export const H01_GATE_LABELLED_ITEMS = [
  "P5C-AL-01",
  "P5C-AL-02",
  "P5C-AL-03",
  "P5C-AL-04",
  "P5C-AL-05",
  "P5C-CC-01",
  "P5C-CC-02",
  "P5C-CC-03",
  "P5C-CC-04",
  "P5C-CC-05",
  "P5C-CC-06",
  "P5C-CC-07",
  "P5C-CC-08",
  "P5C-CC-09",
  "P5C-CR-01",
  "P5C-CR-02",
  "P5C-CR-05",
  "P5C-CR-06",
  "P5C-EX-01",
  "P5C-EX-02",
  "P5C-EX-03",
  "P5C-EX-04",
  "P5C-EX-05",
  "P5C-EX-06",
  "P5C-EX-07",
  "P5C-RD-01",
  "P5C-RD-02",
  "P5C-RD-03",
  "P5C-RD-04",
  "P5C-RD-05",
] as const

export const H01_CLAIM_PATHS = [
  "company.founded",
  "company.customers",
  "company.employeeCount",
  "company.{founded,headquarters,customers,employeeCount,industries}",
  "alternatives",
  "rating_tuple_restatement",
  "10-claim EXTERNAL_VERIFICATION_REQUIRED checklist",
] as const

export const H01_INCORRECTLY_BLOCKED_ITEMS = H01_EXCLUDED_ITEMS.filter(
  item => item.category === "incorrectly_blocked",
).map(item => item.id)

export const H01_FUTURE_DEPENDENT_ITEMS = H01_EXCLUDED_ITEMS.filter(
  item => item.category === "future_dependent_remediation",
).map(item => item.id)

export interface H01ScopeMeasure {
  value: number
  unit: "content_item" | "evidence_record" | "remediation_item"
  metric: string
  definition: string
}

export const H01_SCOPE_MEASURES: readonly H01ScopeMeasure[] = Object.freeze([
  {
    value: 44,
    unit: "content_item",
    metric: "phase_5a_requirement_8_classes",
    definition: "29 alternatives paragraphs + 15 rating statements",
  },
  {
    value: 161,
    unit: "evidence_record",
    metric: "company_records_in_declared_cr_subset",
    definition: "P5C-CR-01 53 + P5C-CR-02 100 + P5C-CR-06 8",
  },
  {
    value: 251,
    unit: "evidence_record",
    metric: "company_fact_records_cr_01_to_cr_07",
    definition: "53 + 100 + 50 + 24 + 14 + 8 + 2",
  },
  {
    value: 295,
    unit: "evidence_record",
    metric: "combined_evidence_scope",
    definition: "44 content items + 251 company-fact records",
  },
  {
    value: 30,
    unit: "remediation_item",
    metric: H01_GATE_LABEL_SET_METRIC,
    definition: "remediations whose generated blocking_reason gate label cites H-01",
  },
  {
    value: 17,
    unit: "remediation_item",
    metric: H01_DECLARED_BLOCK_SET_METRIC,
    definition: "human_review_queue[0].blocks[]",
  },
])

export const H01_CR_RECORD_COUNTS = Object.freeze({
  "P5C-CR-01": 53,
  "P5C-CR-02": 100,
  "P5C-CR-03": 50,
  "P5C-CR-04": 24,
  "P5C-CR-05": 14,
  "P5C-CR-06": 8,
  "P5C-CR-07": 2,
})

export const H01_REQUIREMENT_8 = Object.freeze({
  source: "_PHASE5A_REMEDIATION_DESIGN.md requirement 8",
  alternativesParagraphs: 29,
  ratingStatements: 15,
  contentItems: 44,
  companyFactRecords: 251,
  combinedEvidenceScope: 295,
})

export interface H01Contract {
  id: string
  title: string
  contractVersion: string
  objective: string
  authority: {
    authoritativeSource: string
    versionControlled: boolean
    supersedes: string
    historicalArtifact: string
    historicalArtifactVersionControlled: boolean
    historicalPhase: string
    historicalMode: string
    historicalGeneratedAt: string
    reason: string
  }
  approvalState: {
    status: string
    scope: string
    explicit: boolean
    implicitFromBlockingReason: boolean
    establishedBy: string
    establishedAt: string
    outsideApprovedScope: string
  }
  approvalScope: {
    source: string
    alternativesParagraphs: number
    ratingStatements: number
    contentItems: number
    companyFactRecords: number
    combinedEvidenceScope: number
    unit: string
    count: number
    approvedRemediationIds: string[]
    excludedRemediationIds: string[]
    permissionBasis: string
  }
  scope: {
    unit: string
    unitDefinition: string
    count: number
    countMetric: string
    source: string
    governedItems: string[]
    excludedItems: H01ExcludedItem[]
    secondary: {
      count: number
      countMetric: string
      source: string
      items: string[]
      isScope: boolean
    }
    resolution: string
  }
  scopeMeasures: H01ScopeMeasure[]
  evidenceScope: {
    unit: string
    inventory: Record<string, number>
    requirement8CombinedScope: number
    requirement8Breakdown: string
    note: string
  }
  classification: {
    kind: string
    queuePosition: number
    phase5ARequirement: number
    claimPaths: string[]
    evidenceDomains: string[]
    evidenceRecordCounts: Record<string, number>
  }
  dependencies: {
    humanReviewItems: string[]
    dependsOn: string[]
    gatesRemediationIds: string[]
  }
  approvalEffect: {
    releases: string
    approvedCount: number
    excludedRemainBlocked: string[]
    doesNotGrant: string[]
  }
  handlingReclassifications: {
    remediationId: string
    recordCount: number
    previousHandling: string
    handling: string
    createsCompanyProvenancePath: boolean
    reason: string
  }[]
  sourceRequirements: {
    registerFile: string
    registerSize: number
    tierDistribution: Record<string, number>
    internalSourceCount: number
    danglingRefsAllowed: boolean
    invalidSourceReferenceFails: boolean
  }
  statusRules: {
    allowed: string[]
    forbiddenTransitions: string[]
    planningOnlyTokens: string[]
    automaticVerification: boolean
    reservedStatus: string
    reservedStatusRecordCount: number
  }
  handlingRules: {
    allowed: string[]
    advisoryOnly: boolean
    rendererSuppressionFromHandling: boolean
  }
  freshnessRules: {
    policy: Record<string, string>
    windowsDays: Record<string, number>
    reportingOnly: boolean
    staleSuppressesRendering: boolean
  }
  conflictRules: {
    inRepoValueDisagreementOmitsField: boolean
    provenanceConflictSuppressesRendering: boolean
    conflictGroupSource: string
  }
  renderingPosture: {
    provenanceEnforcement: string
    rendererGate: boolean
    contentSuppression: boolean
    missingProvenanceSuppressesRendering: boolean
    staleProvenanceSuppressesRendering: boolean
    conflictingProvenanceSuppressesRendering: boolean
    h08AdvisoryOnlyCompatible: boolean
  }
  seoSafety: {
    invariant: Record<string, number>
    forbiddenSurfaces: string[]
    indexabilityMayChange: boolean
    urlSetMayChange: boolean
    aggregateRatingMayChange: boolean
    reviewRatingMayChange: boolean
  }
  acceptanceCriteria: string[]
}

export const H01_CONTRACT: H01Contract = Object.freeze({
  id: H01_ID,
  title: H01_TITLE,
  contractVersion: H01_CONTRACT_VERSION,
  objective:
    "Grant or withhold editorial approval to edit published review content (Phase 5A input requirement 8).",
  authority: {
    authoritativeSource: "src/lib/content/h01-contract.ts",
    versionControlled: true,
    supersedes: "_p5c_remediation_plan.json#/human_review_queue/0",
    historicalArtifact: "_p5c_remediation_plan.json",
    historicalArtifactVersionControlled: false,
    historicalPhase: "5C",
    historicalMode: "READ_ONLY_DESIGN",
    historicalGeneratedAt: "2026-10-03",
    reason:
      "The Phase 5C plan is generated, gitignored by _*.json and marked READ_ONLY_DESIGN, so it cannot carry a versioned H-01 contract.",
  },
  approvalState: {
    status: "GRANTED",
    scope: "approved_remediation_ids",
    explicit: true,
    implicitFromBlockingReason: false,
    establishedBy: "H-01 contract v1.0.0",
    establishedAt: "2026-10-04",
    outsideApprovedScope: "blocked",
  },
  approvalScope: {
    source: H01_REQUIREMENT_8.source,
    alternativesParagraphs: H01_REQUIREMENT_8.alternativesParagraphs,
    ratingStatements: H01_REQUIREMENT_8.ratingStatements,
    contentItems: H01_REQUIREMENT_8.contentItems,
    companyFactRecords: H01_REQUIREMENT_8.companyFactRecords,
    combinedEvidenceScope: H01_REQUIREMENT_8.combinedEvidenceScope,
    unit: H01_SCOPE_UNIT,
    count: 17,
    approvedRemediationIds: [...H01_GOVERNED_ITEMS],
    excludedRemediationIds: H01_EXCLUDED_ITEMS.map(item => item.id),
    permissionBasis: "declared_block_set",
  },
  scope: {
    unit: H01_SCOPE_UNIT,
    unitDefinition: H01_SCOPE_UNIT_DEFINITION,
    count: 17,
    countMetric: H01_DECLARED_BLOCK_SET_METRIC,
    source: "_p5c_remediation_plan.json#/human_review_queue/0/blocks",
    governedItems: [...H01_GOVERNED_ITEMS],
    excludedItems: [...H01_EXCLUDED_ITEMS],
    secondary: {
      count: 30,
      countMetric: H01_GATE_LABEL_SET_METRIC,
      source: "_p5c_build.cjs GATES_BY_PREFIX -> remediations[].blocking_reason suffix",
      items: [...H01_GATE_LABELLED_ITEMS],
      isScope: false,
    },
    resolution:
      "17 and 30 both count remediation_item but describe different metrics: 17 is the hand-authored declared block set certified by the Phase 5C definition of done, 30 is the machine-generated family gate label. The 13-item delta splits into 2 incorrectly blocked items whose own reason states they are not gated by content-edit approval and 11 future-dependent remediation items whose own reason cites content-edit approval.",
  },
  scopeMeasures: [...H01_SCOPE_MEASURES],
  evidenceScope: {
    unit: "evidence_record",
    inventory: {
      company_conflicts: 260,
      alternatives: 29,
      rating_duplication: 15,
      external_reviews: 70,
      total: 374,
    },
    requirement8CombinedScope: 295,
    requirement8Breakdown: "44 content items (29 alternatives paragraphs + 15 rating statements) + 251 company-fact records",
    note: "374 is the Phase 5B evidence inventory, 295 is the Phase 5A/H-01 approval wording; they are different units and are not interchangeable.",
  },
  classification: {
    kind: "human_review_approval",
    queuePosition: 0,
    phase5ARequirement: 8,
    claimPaths: [...H01_CLAIM_PATHS],
    evidenceDomains: [
      "company_conflicts",
      "alternatives",
      "rating_duplication",
      "external_reviews",
    ],
    evidenceRecordCounts: {
      company_conflicts: 260,
      alternatives: 29,
      rating_duplication: 15,
      external_reviews: 70,
      total: 374,
    },
  },
  dependencies: {
    humanReviewItems: ["H-02", "H-03", "H-04", "H-05", "H-06"],
    dependsOn: [
      "P5C-PR-01 / P5C-PR-02 provenance foundation (delivered by 8431367)",
      "Phase 5B evidence recorded in _p5b_source_verification.json",
    ],
    gatesRemediationIds: [...H01_GOVERNED_ITEMS],
  },
  approvalEffect: {
    releases: "content-edit approval gate for approvedRemediationIds only",
    approvedCount: 17,
    excludedRemainBlocked: H01_EXCLUDED_ITEMS.map(item => item.id),
    doesNotGrant: [
      "renderer gate",
      "company.* provenance paths",
      "provenance-backed VERIFIED company claims",
      "indexability or noindex changes",
      "publication of content/alternatives/*.json",
      "approval of any remediation id outside approvedRemediationIds",
    ],
  },
  handlingReclassifications: [
    {
      remediationId: "P5C-CR-03",
      recordCount: 50,
      previousHandling: "ADD_PROVENANCE",
      handling: "REMAIN_UNVERIFIED",
      createsCompanyProvenancePath: false,
      reason:
        "ADD_PROVENANCE requires a company.* provenance path that does not exist, and its paired rule 'keep the field omitted until the provenance status reaches VERIFIED' is a provenance renderer gate forbidden by the ADVISORY_ONLY posture. REMAIN_UNVERIFIED records the no-citation condition using the existing handling enum and the existing resolveCompanyFacts() equality gate without creating paths, records or statuses.",
    },
  ],
  sourceRequirements: {
    registerFile: "content/provenance/sources.json",
    registerSize: 283,
    tierDistribution: { "1": 217, "2": 29, "3": 37 },
    internalSourceCount: 0,
    danglingRefsAllowed: false,
    invalidSourceReferenceFails: true,
  },
  statusRules: {
    allowed: [...PROVENANCE_STATUSES],
    forbiddenTransitions: [
      "MISSING -> VERIFIED without a new retrieval",
      "CONFLICTING -> VERIFIED without resolving both sides",
      "STALE -> VERIFIED without a newer source",
      "any status change made by a script rather than by a new retrieval",
    ],
    planningOnlyTokens: ["EVIDENCE_INSUFFICIENT", "SOURCE_UNAVAILABLE", "NOT_MACHINE_VERIFIABLE"],
    automaticVerification: false,
    reservedStatus: "MANUALLY_REVIEWED",
    reservedStatusRecordCount: 0,
  },
  handlingRules: {
    allowed: [...PROVENANCE_HANDLINGS],
    advisoryOnly: true,
    rendererSuppressionFromHandling: false,
  },
  freshnessRules: {
    policy: { ...PROVENANCE_POLICY_BY_PATH },
    windowsDays: { ...PROVENANCE_FRESHNESS_DAYS },
    reportingOnly: true,
    staleSuppressesRendering: false,
  },
  conflictRules: {
    inRepoValueDisagreementOmitsField: true,
    provenanceConflictSuppressesRendering: false,
    conflictGroupSource: "content/provenance/claims/*.json#/conflict_group",
  },
  renderingPosture: {
    provenanceEnforcement: "ADVISORY_ONLY",
    rendererGate: false,
    contentSuppression: false,
    missingProvenanceSuppressesRendering: false,
    staleProvenanceSuppressesRendering: false,
    conflictingProvenanceSuppressesRendering: false,
    h08AdvisoryOnlyCompatible: true,
  },
  seoSafety: {
    invariant: { totalReviews: 151, indexable: 99, noindex: 52 },
    forbiddenSurfaces: [
      "src/app/robots.ts",
      "noindex-list.json",
      "next.config.ts",
      "src/app/sitemap.ts",
      "src/app/rss.xml/route.ts",
      "src/app/reviews/[slug]/page.tsx",
      "src/components/seo/json-ld.tsx",
      "src/lib/format.ts",
      "src/lib/noindex.ts",
    ],
    indexabilityMayChange: false,
    urlSetMayChange: false,
    aggregateRatingMayChange: false,
    reviewRatingMayChange: false,
  },
  acceptanceCriteria: [
    "H-01 id, title and a semver contract version are present and parseable",
    "the scope unit is stated explicitly and the scope count equals the governed item count",
    "approved and excluded remediation ids are unique, non-overlapping P5C remediation ids",
    "the 17 / 30 / 44 / 161 / 251 / 295 scope model is represented with an explicit unit per number",
    "the declared block set and the generated gate label set reconcile with no unexplained mismatch",
    "no remediation id outside approvedRemediationIds is granted approval implicitly",
    "every excluded item stays blocked by its own authored blocking reason or its own queue gate",
    "every H-01 claim path stays disjoint from the 13 active provenance claim paths",
    "the ADD_PROVENANCE company contradiction is reclassified without creating company.* paths",
    "the provenance register keeps 283 sources with no dangling or internal references",
    "no status is promoted to VERIFIED automatically and MANUALLY_REVIEWED stays unrecorded",
    "provenance enforcement is ADVISORY_ONLY with no renderer gate and no content suppression",
    "missing, stale and conflicting provenance never suppress rendered review content",
    "the review indexability invariant stays 151 total / 99 indexable / 52 noindex",
    "no SEO surface references the H-01 contract or the provenance module",
  ],
})

export const H01_ACTIVE_CLAIM_PATH_COUNT = PROVENANCE_CLAIM_PATHS.length
