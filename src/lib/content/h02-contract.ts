export const H02_ID = "H-02"

export const H02_TITLE = "alternatives publication decision"

export const H02_CONTRACT_VERSION = "1.3.0"

export const H02_CONTRACT_PREVIOUS_VERSION = "1.2.0"

export const H02_PHASE_5A_REQUIREMENT = 5

export const H02_DECISION = "B"

export const H02_DECISION_LABEL = "REMOVE_UNPUBLISHED_ALTERNATIVES_REFERENCES"

export const H02_DECISION_SUMMARY =
  "Publish no content/alternatives/*.json record. Keep every object-set file published:false and remove the repository-artefact references from the 23 fixed review pages."

export const H02_BLOCKS = ["P5C-AL-03"] as const

export const H02_OBJECT_SET_METRIC = "cohort_alternative_file"

export const H02_OBJECT_SET_FILE_PATTERN = "content/alternatives/<slug>-alternatives.json"

export const H02_OBJECT_SET_SLUGS = [
  "affinity",
  "auth0",
  "basecamp",
  "circleci",
  "close-crm",
  "copper-crm",
  "copy-ai",
  "crowdstrike",
  "dialpad",
  "evernote",
  "expensify",
  "fathom",
  "grafana",
  "grammarly",
  "greenhouse",
  "heap",
  "hi-bob",
  "invision",
  "jfrog",
  "lever",
  "marketo",
  "midjourney",
  "new-relic",
  "obsidian",
  "okta",
  "optimizely",
  "outreach-io",
  "plausible",
  "postman",
  "power-bi",
  "ringcentral",
  "roam-research",
  "runway",
  "sage-intacct",
  "salesloft",
  "sentinelone",
  "smartsheet",
  "survey-monkey",
  "synthesia",
  "tableau",
  "telegram",
  "terraform",
  "todoist",
  "vonage",
  "wave",
  "workday",
  "wrike",
  "writesonic",
  "zeplin",
  "zoho-books",
  "zoho-crm",
  "zoho-people",
] as const

export const H02_OBJECT_SET_SIZE = 52

export interface H02ExcludedCandidate {
  id: string
  size: number
  declaration: string
  excluded: true
  exclusionReason: string
}

export const H02_EXCLUDED_CANDIDATE_SETS: readonly H02ExcludedCandidate[] = Object.freeze([
  {
    id: "unpublished_all",
    size: 75,
    declaration: "_p5c_build.cjs human[1] / _PHASE5C_REMEDIATION_DESIGN.md H-02 row",
    excluded: true,
    exclusionReason:
      "No declaration names the 75-file published:false superset. Adopting it would expand H-02 beyond the Phase 5A requirement 5 object set by inference.",
  },
  {
    id: "filesystem_total",
    size: 101,
    declaration: "_p5c_build.cjs human[1] parenthetical '(101 files, all published:false)'",
    excluded: true,
    exclusionReason:
      "The parenthetical premise is factually false: content/alternatives holds 101 files split 75 published:false, 25 published:undefined and 1 already published. Publishing all 101 would also drive the frozen H-01 assertion `expect(unpublished).toBeGreaterThan(0)` in src/test/h01-contract.test.ts to zero.",
  },
])

export const H02_PROSE_SCOPE_METRIC = "review_page"

export const H02_PROSE_SCOPE_SLUGS = [
  "affinity",
  "basecamp",
  "close-crm",
  "copper-crm",
  "evernote",
  "expensify",
  "invision",
  "marketo",
  "obsidian",
  "optimizely",
  "outreach-io",
  "ringcentral",
  "roam-research",
  "sage-intacct",
  "salesloft",
  "survey-monkey",
  "todoist",
  "wave",
  "workday",
  "wrike",
  "zoho-books",
  "zoho-crm",
  "zoho-people",
] as const

export const H02_PROSE_SCOPE_SIZE = 23

export const H02_PROSE_FIELDS = [
  "content[].title",
  "content[].body",
  "faqs[].question",
  "faqs[].answer",
  "pros[]",
  "cons[]",
] as const

export const H02_PROSE_FIELD_RATIONALE =
  "content[].body, faqs[].question, faqs[].answer, pros[] and cons[] render as body prose on /reviews/<slug> (content[].body; faqs[].question and faqs[].answer in the FAQ block; pros[] through EditorialProsCons; cons[] at reviews/[slug]/page.tsx:149, :161, :194 and :226). content[].title is the sixth field added by contract v1.1.0: a section title is rendered user-visible prose emitted as the <h2> at reviews/[slug]/page.tsx:374 and :383, and it can carry the same H02_PROSE_REFERENCE_PATTERNS as body prose, so the enumeration must include it for T-H02-05 to cover every reference. description and tagline are metadata surfaces and carry zero artefact references across all 29 Phase 5B cases."

export const H02_PROSE_REFERENCE_PATTERNS = [
  "alternatives\\s+files?\\b",
  "alternatives\\s+pages?\\b",
  "alternatives\\s+(listing|listings|list)s?\\b",
  "alternatives\\s+datasets?\\b",
  "alternatives\\s+(descriptions?|entries|records?)\\b",
  "\\/alternatives\\/",
  "recorded alternatives",
] as const

export const H02_PROSE_REFERENCE_SOURCE = "Phase 5B F2 pointer sentence matched by the patterns above"

export const H02_PROSE_REFERENCE_PREDICATE =
  "A prose sentence is in scope when it matches one of H02_PROSE_REFERENCE_PATTERNS AND resolves either to at least one of the 52 object-set records or to no record at all. The sentence is the unit of work: rewriting or removing it clears every target it names, including targets outside the object set. published:undefined records are already reachable through getAlternative() (registry.ts drops published === false only), so they are never treated as unpublished targets."

export interface H02ContractChangelogEntry {
  version: string
  date: string
  summary: string
  reason: string
}

export const H02_CONTRACT_CHANGELOG: readonly H02ContractChangelogEntry[] = Object.freeze([
  {
    version: "1.3.0",
    date: "2026-10-06",
    summary:
      "Records the approved Phase INDEX-02A wave 1 noindex recovery: exactly the 31 P0 RECOVER slugs (29 comparisons and 2 alternatives) move from directories.*.noindex to directories.*.keep, H02_SEO_INVARIANT follows the observed post-recovery sitemap of 576 with 9 alternatives, and T-H02-12 is added to police the wave-1 recovery set itself.",
    reason:
      "Phase INDEX-02 re-derived the indexation classes from the read-only audit and proved that 31 published, 300+ word, non-duplicate pages with recorded GSC impressions (1-18) and live HTTP 200 responses were suppressed by noindex-list.json, so the approved wave 1 removes noindex from exactly those 31 and nothing else. The 52-file object set, the 23-page prose scope, decision B, robots.txt, canonical rules, the 135 thin / 97 duplicate / 171 no-evidence classifications measured at the Phase INDEX-01 baseline and every H-01 posture are unchanged; sitemapExpansion stays 0 because it measures decision-B expansion only, while the +31 observed growth is recorded in H02_INDEX02A_RECOVERY.",
  },
  {
    version: "1.2.0",
    date: "2026-10-05",
    summary:
      "Records the approved Phase INDEX-01 noindex recovery: exactly the 52 evidence-backed B-class slugs move from directories.*.noindex to directories.*.keep, H02_SEO_INVARIANT follows the observed post-recovery sitemap and review split, and T-H02-04 / T-H02-08 are restated against the post-recovery file with T-H02-11 added to police the recovery set itself.",
    reason:
      "Phase GSC-01 proved that 52 published, non-duplicate, 300+ word pages with recorded GSC impressions or clicks were suppressed by noindex-list.json, so the approved recovery removes noindex from exactly those 52 and nothing else. Decision B, the 52-file object set, the 23-page prose scope, robots.txt, canonical rules, sitemap quality rules, the 135 thin / 97 duplicate / 171 no-evidence classifications and every H-01 posture are unchanged; sitemapExpansion stays 0 because it measures decision-B expansion only, while the +52 observed growth is recorded in H02_INDEX01_RECOVERY.",
  },
  {
    version: "1.1.0",
    date: "2026-10-04",
    summary:
      "Reopens the prose enumeration: content[].title joins H02_PROSE_FIELDS and T-H02-05 is restated so it covers every rendered prose field rather than only the five v1.0.0 fields.",
    reason:
      "The v1.0.0 five-field enumeration omitted rendered section titles even though a title is user-visible prose emitted as an <h2> and can match H02_PROSE_REFERENCE_PATTERNS; content/reviews/zoho-people.json content[5].title proved the omission on an in-scope page. The 52-file object set, the 23-page prose scope, decision B, approval status GRANTED and every H-01 posture are unchanged.",
  },
  {
    version: "1.0.0",
    date: "2026-10-04",
    summary:
      "Initial versioned H-02 contract: decision B, the 52-file object set, the 23-page prose scope with 6 documented exclusions, MODEL 1 for T-ALT-03 and ten safety clauses.",
    reason:
      "Established in Phase 5F to freeze the resolved scope so Phase 5G does not re-derive it.",
  },
])

export interface H02CrossReferenceNote {
  page: string
  outOfSetTargets: string[]
  alreadyReachableTargets: string[]
  absentTargets: string[]
  handling: string
}

export const H02_CROSS_REFERENCE_NOTES: readonly H02CrossReferenceNote[] = Object.freeze([
  {
    page: "invision",
    outOfSetTargets: ["framer-alternatives", "webflow-alternatives"],
    alreadyReachableTargets: [],
    absentTargets: [],
    handling:
      "content[6] and faqs[4].answer name affinity, framer, webflow and zeplin alternatives pages. affinity and zeplin are object-set records, so the sentences are already in scope; rewriting them also clears the two out-of-set published:false targets. No object-set expansion happens.",
  },
  {
    page: "expensify",
    outOfSetTargets: [],
    alreadyReachableTargets: [
      "freshbooks-alternatives",
      "quickbooks-alternatives",
      "stripe-alternatives",
      "xero-alternatives",
    ],
    absentTargets: [],
    handling:
      "content[7], content[9] and faqs[4].answer also name quickbooks, xero, freshbooks and stripe pages. Those four are published:undefined and therefore reachable today, so they are not H-02 targets; the sentences are in scope only because sage-intacct, zoho-books and wave are object-set records.",
  },
  {
    page: "ringcentral",
    outOfSetTargets: [],
    alreadyReachableTargets: [],
    absentTargets: ["messaging-alternatives"],
    handling:
      "content[2] cites a repository 'messaging-alternatives listing'. No content/alternatives record with that slug exists, so the sentence matches the absent-target branch of the predicate and is in scope. H-02 neither creates nor renames a record to satisfy it.",
  },
])

export interface H02ProseExclusion {
  slug: string
  classification: string
  reason: string
}

export const H02_PROSE_EXCLUSIONS: readonly H02ProseExclusion[] = Object.freeze([
  {
    slug: "fathom",
    classification: "different_artefact",
    reason:
      "content[4] names content/blog/google-analytics-alternatives.json, a blog artefact outside content/alternatives and outside the H-02 object set.",
  },
  {
    slug: "midjourney",
    classification: "unrelated_generic_use",
    reason:
      "faqs[4].question is the generic string 'What are good alternatives to Midjourney for images?'; faqs[4].answer points at content/best/best-ai-image-generators.json and the eleven midjourney comparison files, none of which is an alternatives record.",
  },
  {
    slug: "new-relic",
    classification: "false_positive_qa_interpretation",
    reason:
      "Phase 5B records issue_class QA_INTERPRETATION with where=data:content/reviews/new-relic.json (alternatives field) and states that no sentence references an alternatives file or page; F2 fired on repositoryHasAlts only.",
  },
  {
    slug: "postman",
    classification: "different_artefact",
    reason:
      "content[8] points at content/comparisons/* ('this repository's API tooling comparison', 'the stored head-to-head files'), not at an alternatives record.",
  },
  {
    slug: "terraform",
    classification: "unrelated_generic_use",
    reason:
      "content[9] points at content/best/best-infrastructure-as-code.json and content/comparisons/*, and its closing clause asserts that this repository reviews none of the meaningful alternatives.",
  },
  {
    slug: "writesonic",
    classification: "false_positive_qa_interpretation",
    reason:
      "Phase 5B records issue_class QA_INTERPRETATION with where=data:content/reviews/writesonic.json (alternatives field) and states that no sentence references an alternatives file or page; F2 fired on repositoryHasAlts only.",
  },
])

export const H02_F2_CASE_COUNT = 29

export const H02_ALT_T3_MODEL = "MODEL_1"

export const H02_ALT_T3_MODEL_LABEL = "contract_approval_gate_without_provenance"

export const H02_ALT_T3_MODEL_RULES = Object.freeze({
  requiresVerifiedStatus: false,
  requiresAlternativesProvenancePath: false,
  requiresRendererGate: false,
  requiresContentSuppression: false,
  gatedOn: "H02_CONTRACT.approval.status === GRANTED && H02_CONTRACT.decision === B",
  reason:
    "T-ALT-03 catches P5C-AL-01 and P5C-AL-02, which are gated by H-05 and H-01, not by H-02. Requiring status VERIFIED or an active alternatives provenance path would contradict the shipped H-01 assertions that PROVENANCE_CLAIM_PATHS excludes 'alternatives', that coverage.byStatus.VERIFIED is undefined and that enforcement is ADVISORY_ONLY.",
})

export const H02_REVIEW_ALTERNATIVES_ARRAY = Object.freeze({
  reviewAlternativesArray: "unchanged",
  populatedByH02: false,
  cohortEntries: 0,
  rendererDependencyCreated: false,
  note:
    "All 52 cohort reviews currently carry an empty content/reviews/*.json alternatives array and the #alternatives section stays entity-derived. Option B keeps the Key Takeaways fallback at reviews/[slug]/page.tsx:163-167 correct as-is.",
})

export const H02_SEO_INVARIANT = Object.freeze({
  sitemapAlternatives: 9,
  sitemapReviews: 138,
  sitemapTotal: 576,
  reviewsTotal: 151,
  reviewsIndexable: 138,
  reviewsNoindex: 13,
  alternativesTotal: 101,
  alternativesRenderable: 26,
  newAlternativesUrls: 0,
  sitemapExpansion: 0,
})

export interface H02Index01Recovery {
  phase: string
  action: string
  approvedCount: number
  baselineCommit: string
  hashBasis: string
  baseline: {
    noindexListSha256: string
    sitemapTotal: number
    keep: Record<string, number>
    noindex: Record<string, number>
  }
  after: {
    noindexListSha256: string
    sitemapTotal: number
    keep: Record<string, number>
    noindex: Record<string, number>
  }
  slugs: Record<string, string[]>
  unchangedDirectories: Record<string, { keep: number; noindex: number }>
  classification: { thin: number; duplicate: number; noEvidence: number }
  protectedNoindex: string[]
}

/**
 * Phase INDEX-01 recovery record. Both hashes are sha256 over the canonical
 * 2-space JSON serialization of noindex-list.json, so they are independent of
 * git line-ending normalisation. Values are observed, never assumed.
 */
export const H02_INDEX01_RECOVERY: H02Index01Recovery = Object.freeze({
  phase: "INDEX-01",
  action: "MOVE_NOINDEX_TO_KEEP_ONLY",
  approvedCount: 52,
  baselineCommit: "3908cca962f1ebbe9ad6a88e4ededbb08cf58c79",
  hashBasis: "sha256 of JSON.stringify(JSON.parse(noindex-list.json), null, 2)",
  baseline: {
    noindexListSha256: "28715ee5e2facf7509b57c5289c6c4cca0d3221ac3f5acb7de13a9787839be3f",
    sitemapTotal: 493,
    keep: { reviews: 99, best: 1, guides: 36, statistics: 20 },
    noindex: { reviews: 52, best: 175, guides: 64, statistics: 84 },
  },
  after: {
    noindexListSha256: "d823cc56067e4d7ee47ac97ca311007f6cdb641ef85cd57f7fbe672e17c9a2a9",
    sitemapTotal: 545,
    keep: { reviews: 138, best: 6, guides: 40, statistics: 24 },
    noindex: { reviews: 13, best: 170, guides: 60, statistics: 80 },
  },
  slugs: {
    reviews: [
      "auth0",
      "basecamp",
      "circleci",
      "close-crm",
      "copper-crm",
      "crowdstrike",
      "evernote",
      "expensify",
      "fathom",
      "grafana",
      "grammarly",
      "greenhouse",
      "heap",
      "jfrog",
      "lever",
      "marketo",
      "midjourney",
      "new-relic",
      "obsidian",
      "okta",
      "optimizely",
      "outreach-io",
      "plausible",
      "postman",
      "power-bi",
      "ringcentral",
      "roam-research",
      "runway",
      "sage-intacct",
      "salesloft",
      "sentinelone",
      "smartsheet",
      "survey-monkey",
      "tableau",
      "wave",
      "workday",
      "wrike",
      "writesonic",
      "zeplin",
    ],
    best: [
      "best-accounting-software",
      "best-crm-software",
      "best-ecommerce-platforms",
      "best-erp-software",
      "best-project-management-software",
    ],
    guides: [
      "project-management-software-buyers-guide",
      "security-software-buyers-guide",
      "vendor-risk-assessment",
      "web-design-platform-selection",
    ],
    statistics: ["dental-software", "manufacturing-software", "productanalytics-software", "saas-statistics"],
  },
  unchangedDirectories: {
    comparisons: { keep: 9, noindex: 916 },
    alternatives: { keep: 7, noindex: 71 },
    glossary: { keep: 30, noindex: 92 },
    blog: { keep: 97, noindex: 0 },
  },
  classification: { thin: 135, duplicate: 97, noEvidence: 171 },
  protectedNoindex: ["/search", "/dashboard", "/authors/pilotstack-team"],
})

export interface H02Index02aRecovery {
  phase: string
  wave: string
  action: string
  approvedCount: number
  baselineCommit: string
  hashBasis: string
  selectionBasis: string
  baseline: {
    noindexListSha256: string
    sitemapTotal: number
    keep: Record<string, number>
    noindex: Record<string, number>
  }
  after: {
    noindexListSha256: string
    sitemapTotal: number
    keep: Record<string, number>
    noindex: Record<string, number>
  }
  slugs: Record<string, string[]>
  unaffectedDirectories: Record<string, { keep: number; noindex: number }>
  protectedNoindex: string[]
}

/**
 * Phase INDEX-02A wave 1 recovery record. baseline is the exact post-INDEX-01
 * state (its sha256 equals H02_INDEX01_RECOVERY.after.noindexListSha256) and
 * after is the observed canonical sha256 of noindex-list.json once exactly the
 * approved 31 P0 RECOVER slugs moved noindex -> keep. Values are observed,
 * never assumed.
 */
export const H02_INDEX02A_RECOVERY: H02Index02aRecovery = Object.freeze({
  phase: "INDEX-02A",
  wave: "WAVE_1",
  action: "MOVE_NOINDEX_TO_KEEP_ONLY",
  approvedCount: 31,
  baselineCommit: "3ee40abe275506dc46c3969e4bbdc9be1fc3366c",
  hashBasis: "sha256 of JSON.stringify(JSON.parse(noindex-list.json), null, 2)",
  selectionBasis:
    "Phase INDEX-02 read-only audit rows with class RECOVER and priority P0: published, live HTTP 200, 300+ words, GSC impressions > 0, verified non-duplicate by shingle and title analysis; 29 comparisons plus the 2 alternatives cluster primaries",
  baseline: {
    noindexListSha256: "d823cc56067e4d7ee47ac97ca311007f6cdb641ef85cd57f7fbe672e17c9a2a9",
    sitemapTotal: 545,
    keep: { comparisons: 9, alternatives: 7 },
    noindex: { comparisons: 916, alternatives: 71 },
  },
  after: {
    noindexListSha256: "87e2cef4d8c93490ee4590d4968378b83042deac33fbb0ef1da3b6ddc2aa8411",
    sitemapTotal: 576,
    keep: { comparisons: 38, alternatives: 9 },
    noindex: { comparisons: 887, alternatives: 69 },
  },
  slugs: {
    alternatives: ["monday-com-alternatives", "semrush-alternatives"],
    comparisons: [
      "ahrefs-vs-moz",
      "airtable-vs-asana",
      "airtable-vs-clickup",
      "airtable-vs-notion",
      "amplitude-vs-hotjar",
      "asana-vs-clickup",
      "asana-vs-linear",
      "bamboohr-vs-adp",
      "bitwarden-vs-lastpass",
      "calendly-vs-acuity",
      "canva-vs-adobe-express",
      "confluence-vs-notion",
      "docker-vs-podman",
      "github-vs-bitbucket",
      "github-vs-sourceforge",
      "google-analytics-vs-amplitude",
      "google-analytics-vs-matomo",
      "hubspot-vs-pipedrive",
      "jira-vs-confluence",
      "mailchimp-vs-activecampaign",
      "microsoft-teams-vs-discord",
      "netlify-vs-cloudflare-pages",
      "rippling-vs-adp",
      "salesforce-vs-freshsales",
      "salesforce-vs-zoho",
      "sentry-vs-datadog",
      "slack-vs-zoom",
      "stripe-vs-paddle",
      "supabase-vs-appwrite",
    ],
  },
  unaffectedDirectories: {
    best: { keep: 6, noindex: 170 },
    blog: { keep: 97, noindex: 0 },
    glossary: { keep: 30, noindex: 92 },
    guides: { keep: 40, noindex: 60 },
    reviews: { keep: 138, noindex: 13 },
    statistics: { keep: 24, noindex: 80 },
  },
  protectedNoindex: ["/search", "/dashboard", "/authors/pilotstack-team"],
})

export interface H02SafetyClause {
  id: string
  clause: string
}

export const H02_SAFETY_CLAUSES: readonly H02SafetyClause[] = Object.freeze([
  {
    id: "SC-01",
    clause:
      "No content/alternatives/*.json published field may be created, edited or removed by H-02. All 52 object-set files stay published:false.",
  },
  {
    id: "SC-02",
    clause:
      "No /alternatives/* URL is added. getAllAlternatives() keeps returning the same 26 renderable records and sitemap.ts keeps emitting alternatives URLs only for non-noindexed slugs - 9 after the approved Phase INDEX-02A wave 1 recoveries, with no URL created by H-02.",
  },
  {
    id: "SC-03",
    clause:
      "H-02 itself edits none of these surfaces: noindex-list.json, src/app/robots.ts, src/app/sitemap.ts, next.config.ts and every canonical URL stay byte-identical across H-02's own execution. The only later changes to noindex-list.json are the separately approved Phase INDEX-01 recovery of exactly 52 slugs recorded in H02_INDEX01_RECOVERY and the separately approved Phase INDEX-02A wave 1 recovery of exactly 31 slugs recorded in H02_INDEX02A_RECOVERY.",
  },
  {
    id: "SC-04",
    clause:
      "No provenance path, record, status or source is created, edited or deleted. The register keeps 13 claim paths with no 'alternatives' entry, 676 records, 0 VERIFIED and 283 sources.",
  },
  {
    id: "SC-05",
    clause:
      "H-01 is not modified, bypassed or amended. h01-contract.ts, h01-contract.test.ts and their assertions keep their shipped values.",
  },
  {
    id: "SC-06",
    clause:
      "No renderer gate and no content suppression is introduced. Missing, stale or conflicting provenance never suppresses rendered review content.",
  },
  {
    id: "SC-07",
    clause:
      "content/reviews/*.json alternatives arrays are not populated by H-02 and the #alternatives section gains no dependency on content/reviews data.",
  },
  {
    id: "SC-08",
    clause:
      "The only content H-02 authorises changing is review prose inside the 23 fixed pages, and only where the sentence matches H02_PROSE_REFERENCE_PATTERNS against an unpublished or absent alternatives record.",
  },
  {
    id: "SC-09",
    clause:
      "Removing an alternatives-artefact pointer never fabricates a replacement recommendation. A removed sentence may not be replaced by an unsourced product claim.",
  },
  {
    id: "SC-10",
    clause:
      "No generated artefact (_*.json, _*.cjs, _*.md), no SEO file, no generated data file and no deployment is touched by H-02.",
  },
])

export interface H02AcceptanceTest {
  id: string
  name: string
  asserts: string
  catches: string
}

export const H02_ACCEPTANCE_TESTS: readonly H02AcceptanceTest[] = Object.freeze([
  {
    id: "T-H02-01",
    name: "contract identity",
    asserts:
      "H-02 id, title, semver contract version, decision 'B', decision label and approval status GRANTED are present and parseable.",
    catches: "missing or unparseable H-02 contract",
  },
  {
    id: "T-H02-02",
    name: "object set matches the cohort",
    asserts:
      "H02_OBJECT_SET_SLUGS has exactly 52 unique members, each resolves to an existing content/alternatives/<slug>-alternatives.json with published === false, and the set equals the 52 content/provenance/claims/<slug>.json slugs.",
    catches: "B-H02-01 object-set drift",
  },
  {
    id: "T-H02-03",
    name: "object set excludes every other candidate",
    asserts:
      "The 75-file and 101-file candidate sets are recorded as excluded with a reason, and no non-cohort alternatives file appears in H02_OBJECT_SET_SLUGS.",
    catches: "scope expansion by inference",
  },
  {
    id: "T-H02-04",
    name: "prose scope is a fixed list",
    asserts:
      "H02_PROSE_SCOPE_SLUGS has exactly 23 unique members, each is a real content/reviews/<slug>.json, each is inside the object set, and each is declared in noindex-list.json#/directories/reviews (keep or noindex): the 17 prose pages inside the Phase INDEX-01 recovery set are now listed under keep, the other 6 stay under noindex.",
    catches: "B-H02-02 prose-scope drift",
  },
  {
    id: "T-H02-05",
    name: "prose definition covers every rendered prose field",
    asserts:
      "H02_PROSE_FIELDS enumerates content[].title, content[].body, faqs[].question, faqs[].answer, pros[] and cons[] — every field that renders user-visible prose on /reviews/<slug>, section titles included — and H02_PROSE_REFERENCE_PATTERNS is non-empty while H02_PROSE_REFERENCE_PREDICATE states the published === false reachability rule explicitly.",
    catches: "B-H02-02 prose-definition ambiguity",
  },
  {
    id: "T-H02-06",
    name: "exclusions are documented",
    asserts:
      "The 6 Phase 5B cases outside the prose scope each carry a slug, a classification and a reason, and the 23 + 6 counts reconcile to the F2 case count of 29.",
    catches: "silently dropped F2 case",
  },
  {
    id: "T-H02-07",
    name: "decision B publishes nothing",
    asserts:
      "decision === 'B', H02_DECISION_SUMMARY forbids publication, every object-set file is published:false, and H02_SEO_INVARIANT.newAlternativesUrls === 0.",
    catches: "accidental publication",
  },
  {
    id: "T-H02-08",
    name: "SEO surfaces are unchanged",
    asserts:
      "Sitemap membership stays 576 total / 138 reviews / 9 alternatives, the review split stays 151 / 138 / 13, no noindexed URL appears in the sitemap, robots.ts is unmodified, and noindex-list.json differs from its Phase INDEX-01 baseline only by the approved recoveries recorded in H02_INDEX01_RECOVERY (52 slugs) and H02_INDEX02A_RECOVERY (31 slugs).",
    catches: "B-H02-02 downstream indexation change",
  },
  {
    id: "T-H02-09",
    name: "T-ALT-03 uses MODEL 1",
    asserts:
      "H02_ALT_T3_MODEL === 'MODEL_1' with requiresVerifiedStatus, requiresAlternativesProvenancePath, requiresRendererGate and requiresContentSuppression all false.",
    catches: "B-H02-03 T-ALT-03 / H-01 conflict",
  },
  {
    id: "T-H02-10",
    name: "H-01 stays untouched",
    asserts:
      "H01_CONTRACT keeps version 1.0.0, approval status GRANTED, 17 approved and 13 excluded remediation ids, the doesNotGrant entry 'publication of content/alternatives/*.json', and H-02 records that it does not amend H-01.",
    catches: "H-01 amendment by inference",
  },
  {
    id: "T-H02-11",
    name: "INDEX-01 recovery set is exactly the approved 52",
    asserts:
      "H02_INDEX01_RECOVERY lists the approved 52 slugs by family with before/after sha256 and counts; the post-recovery noindex-list.json moved exactly those slugs from noindex[] to keep[], no other slug changed state, no unpublished slug is declared keep, and the 135 thin, 97 duplicate and 171 no-evidence classifications are untouched.",
    catches: "unapproved indexation recovery",
  },
  {
    id: "T-H02-12",
    name: "INDEX-02A wave 1 recovery set is exactly the approved 31",
    asserts:
      "H02_INDEX02A_RECOVERY lists the approved 31 slugs by family (29 comparisons and 2 alternatives) with before/after sha256 and counts; noindex-list.json differs from the Phase INDEX-01 post-recovery state by exactly those 31 slugs moving noindex[] to keep[], every unaffected family keeps its Phase INDEX-01 counts, the post-wave sitemap is 576, and no unpublished slug is declared keep.",
    catches: "unapproved wave-1 indexation recovery",
  },
])

export interface H02Contract {
  id: string
  title: string
  contractVersion: string
  phase5ARequirement: number
  objective: string
  authority: {
    authoritativeSource: string
    versionControlled: boolean
    supersedes: string
    historicalArtifact: string
    historicalArtifactVersionControlled: boolean
    historicalPhase: string
    historicalMode: string
    reason: string
  }
  approvalState: {
    status: string
    explicit: boolean
    establishedBy: string
    establishedAt: string
    decidedBy: string
    outsideApprovedScope: string
  }
  decision: {
    id: string
    label: string
    summary: string
    publicationAction: string
    proseAction: string
    alternativeOptionRejected: string
    rejectedOption: string
  }
  objectSet: {
    metric: string
    size: number
    filePattern: string
    slugs: string[]
    memberPredicate: string
    excludedCandidates: H02ExcludedCandidate[]
    resolution: string
  }
  proseScope: {
    metric: string
    size: number
    slugs: string[]
    f2CaseCount: number
    fields: string[]
    fieldRationale: string
    referencePatterns: string[]
    referenceSource: string
    referencePredicate: string
    exclusions: H02ProseExclusion[]
    crossReferenceNotes: H02CrossReferenceNote[]
    resolution: string
  }
  alt03Model: {
    model: string
    label: string
    requiresVerifiedStatus: boolean
    requiresAlternativesProvenancePath: boolean
    requiresRendererGate: boolean
    requiresContentSuppression: boolean
    gatedOn: string
    reason: string
  }
  dataSurface: {
    reviewAlternativesArray: string
    populatedByH02: boolean
    cohortEntries: number
    rendererDependencyCreated: boolean
    note: string
  }
  dependencies: {
    humanReviewItems: string[]
    blocksRemediationIds: string[]
    implementedInPhase: string
    gatedBy: string
  }
  approvalEffect: {
    releases: string
    approvedCount: number
    doesNotGrant: string[]
  }
  safetyClauses: H02SafetyClause[]
  acceptanceTests: H02AcceptanceTest[]
  seoSafety: {
    invariant: Record<string, number>
    forbiddenSurfaces: string[]
    indexabilityMayChange: boolean
    urlSetMayChange: boolean
    sitemapMayChange: boolean
    noindexMayChange: boolean
    canonicalMayChange: boolean
    robotsMayChange: boolean
  }
  index01Recovery: H02Index01Recovery
  index02aRecovery: H02Index02aRecovery
  provenancePosture: {
    touched: boolean
    claimPathCount: number
    alternativesClaimPathExists: boolean
    recordCount: number
    verifiedCount: number
    rendererGate: boolean
    contentSuppression: boolean
  }
  h01Posture: {
    modified: boolean
    bypassed: boolean
    amended: boolean
    contractVersion: string
    note: string
  }
  changelog: H02ContractChangelogEntry[]
  acceptanceCriteria: string[]
}

export const H02_CONTRACT: H02Contract = Object.freeze({
  id: H02_ID,
  title: H02_TITLE,
  contractVersion: H02_CONTRACT_VERSION,
  phase5ARequirement: H02_PHASE_5A_REQUIREMENT,
  objective:
    "Decide whether content/alternatives/*.json is published or whether the review prose stops referencing it, and freeze the resolved scope so Phase 5G does not re-derive it.",
  authority: {
    authoritativeSource: "src/lib/content/h02-contract.ts",
    versionControlled: true,
    supersedes: "_p5c_remediation_plan.json#/human_review_queue/1",
    historicalArtifact: "_p5c_build.cjs human[1]",
    historicalArtifactVersionControlled: false,
    historicalPhase: "5C",
    historicalMode: "READ_ONLY_DESIGN",
    reason:
      "The Phase 5C queue entry is generated, gitignored by _*.cjs/_*.json and marked READ_ONLY_DESIGN, so it cannot carry a versioned H-02 contract.",
  },
  approvalState: {
    status: "GRANTED",
    explicit: true,
    establishedBy: "H-02 contract v1.0.0",
    establishedAt: "2026-10-04",
    decidedBy: "human production decision recorded in Phase 5F",
    outsideApprovedScope: "blocked",
  },
  decision: {
    id: H02_DECISION,
    label: H02_DECISION_LABEL,
    summary: H02_DECISION_SUMMARY,
    publicationAction: "NONE",
    proseAction: "REMOVE_REFERENCE",
    alternativeOptionRejected: "publish",
    rejectedOption: "A",
  },
  objectSet: {
    metric: H02_OBJECT_SET_METRIC,
    size: H02_OBJECT_SET_SIZE,
    filePattern: H02_OBJECT_SET_FILE_PATTERN,
    slugs: [...H02_OBJECT_SET_SLUGS],
    memberPredicate:
      "a review slug that has a content/provenance/claims/<slug>.json record, i.e. a member of the 52-review noindex cohort, and whose content/alternatives/<slug>-alternatives.json exists with published === false",
    excludedCandidates: [...H02_EXCLUDED_CANDIDATE_SETS],
    resolution:
      "52 is the only candidate whose four Phase 5A requirement 5 conditions all hold: every file exists, every file is published:false, every file belongs to the 52-review cohort and no non-cohort alternatives file is included. 101 fails because only 75 of its files are published:false, and both 75 and 101 would widen scope beyond the declared requirement.",
  },
  proseScope: {
    metric: H02_PROSE_SCOPE_METRIC,
    size: H02_PROSE_SCOPE_SIZE,
    slugs: [...H02_PROSE_SCOPE_SLUGS],
    f2CaseCount: H02_F2_CASE_COUNT,
    fields: [...H02_PROSE_FIELDS],
    fieldRationale: H02_PROSE_FIELD_RATIONALE,
    referencePatterns: [...H02_PROSE_REFERENCE_PATTERNS],
    referenceSource: H02_PROSE_REFERENCE_SOURCE,
    referencePredicate: H02_PROSE_REFERENCE_PREDICATE,
    exclusions: [...H02_PROSE_EXCLUSIONS],
    crossReferenceNotes: [...H02_CROSS_REFERENCE_NOTES],
    resolution:
      "29 Phase 5B F2 cases were classified by reading the matched sentence, not by repositoryHasAlts. 23 sentences genuinely point at a content/alternatives record; 6 point at another artefact, use 'alternatives' generically, or are documented QA false positives.",
  },
  alt03Model: { ...H02_ALT_T3_MODEL_RULES, model: H02_ALT_T3_MODEL, label: H02_ALT_T3_MODEL_LABEL },
  dataSurface: { ...H02_REVIEW_ALTERNATIVES_ARRAY },
  dependencies: {
    humanReviewItems: ["H-01", "H-05"],
    blocksRemediationIds: [...H02_BLOCKS],
    implementedInPhase: "Phase 5G - H-02 Option B Implementation",
    gatedBy: "H02_CONTRACT.approval.status === GRANTED",
  },
  approvalEffect: {
    releases: "alternatives reference gate for P5C-AL-03 under decision B only",
    approvedCount: 1,
    doesNotGrant: [
      "publication of content/alternatives/*.json",
      "renderer gate",
      "content suppression",
      "provenance-backed VERIFIED alternatives claims",
      "an alternatives provenance claim path",
      "new /alternatives/* URLs",
      "sitemap expansion",
      "indexability or noindex changes",
      "canonical, robots or next.config changes",
      "population of content/reviews/*.json.alternatives",
      "amendment of H-01",
      "approval of any remediation id other than P5C-AL-03",
    ],
  },
  safetyClauses: [...H02_SAFETY_CLAUSES],
  acceptanceTests: [...H02_ACCEPTANCE_TESTS],
  seoSafety: {
    invariant: { ...H02_SEO_INVARIANT },
    forbiddenSurfaces: [
      "src/app/robots.ts",
      "noindex-list.json",
      "next.config.ts",
      "src/app/sitemap.ts",
      "src/app/sitemap-html/page.tsx",
      "src/app/rss.xml/route.ts",
      "src/lib/noindex.ts",
      "src/app/alternatives/[slug]/page.tsx",
      "src/lib/content/registry.ts",
    ],
    indexabilityMayChange: false,
    urlSetMayChange: false,
    sitemapMayChange: false,
    noindexMayChange: false,
    canonicalMayChange: false,
    robotsMayChange: false,
  },
  index01Recovery: { ...H02_INDEX01_RECOVERY },
  index02aRecovery: { ...H02_INDEX02A_RECOVERY },
  provenancePosture: {
    touched: false,
    claimPathCount: 13,
    alternativesClaimPathExists: false,
    recordCount: 676,
    verifiedCount: 0,
    rendererGate: false,
    contentSuppression: false,
  },
  h01Posture: {
    modified: false,
    bypassed: false,
    amended: false,
    contractVersion: "1.0.0",
    note:
      "H-02 grants exactly what H-01 lists under approvalEffect.doesNotGrant as 'publication of content/alternatives/*.json' and then declines to exercise it. P5C-AL-03 moves from declaredUnder: ['H-02'] to decided-under, without touching H01_EXCLUDED_ITEMS.",
  },
  changelog: [...H02_CONTRACT_CHANGELOG],
  acceptanceCriteria: [
    "H-02 id, title, a semver contract version and an explicit decision id are present and parseable",
    "approval status is GRANTED explicitly and is never inferred from a blocking_reason string",
    "the object set is exactly 52 cohort slugs, each with an existing published:false alternatives file",
    "the 75-file and 101-file candidate sets are excluded with a written reason",
    "the prose scope is exactly 23 fixed slugs, each a real declared review inside the object set, 17 of which Phase INDEX-01 recovered from noindex to keep",
    "the prose definition names every field that renders user-visible prose, section titles included, and states the published === false reachability rule",
    "the contract changelog records v1.1.0 as the explicit reopen that added content[].title to the five-field v1.0.0 enumeration",
    "the 23 in-scope cases plus the 6 documented exclusions reconcile to the 29 Phase 5B F2 cases",
    "cross-references outside the object set are documented and cleared by the same sentence edit",
    "decision B publishes nothing and adds no /alternatives/* URL",
    "robots.txt, canonical URLs, sitemap quality rules, follow policy, link guards, unpublished 404 behaviour, the content files and the C / D / E classification decisions are unchanged",
    "sitemap membership and noindex policy changed only by the approved 52-slug Phase INDEX-01 recovery recorded in H02_INDEX01_RECOVERY and the approved 31-slug Phase INDEX-02A wave 1 recovery recorded in H02_INDEX02A_RECOVERY, and no noindexed URL is sitemapped",
    "T-ALT-03 is MODEL 1 with no VERIFIED requirement, no alternatives provenance path, no renderer gate and no content suppression",
    "no provenance path, record, status or source changes",
    "H-01 is neither modified, bypassed nor amended",
  ],
})
