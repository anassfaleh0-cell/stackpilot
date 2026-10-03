import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const PROVENANCE_DIR = path.join(CONTENT_DIR, "provenance")
const CLAIMS_DIR = path.join(PROVENANCE_DIR, "claims")
const SOURCES_FILE = path.join(PROVENANCE_DIR, "sources.json")

export const PROVENANCE_CLAIM_PATHS = [
  "rating",
  "review_count",
  "price_range",
  "pricing_object",
  "author",
  "last_reviewed",
  "pros",
  "cons",
  "features",
  "faqs",
  "difficulty",
  "learning_curve",
  "who_should_use",
  "who_should_not_use",
] as const

export const PROVENANCE_CLASSES = ["A", "B", "C", "D", "E"] as const

export const PROVENANCE_STATUSES = [
  "VERIFIED",
  "SOURCED",
  "MANUALLY_REVIEWED",
  "STALE",
  "MISSING",
  "CONFLICTING",
  "NOT_APPLICABLE",
] as const

export const PROVENANCE_HANDLINGS = [
  "KEEP",
  "OMIT",
  "UPDATE",
  "REVIEW_RENDERER",
  "ADD_PROVENANCE",
  "REQUIRE_MANUAL_REVIEW",
  "REMAIN_UNVERIFIED",
] as const

export const PROVENANCE_FRESHNESS_DAYS = Object.freeze({
  pricing_90d: 90,
  company_180d: 180,
  editorial_365d: 365,
})

export const PROVENANCE_POLICY_BY_PATH = Object.freeze({
  price_range: "pricing_90d",
  pricing_object: "pricing_90d",
})

export const PROVENANCE_REVIEW_SLUG_COUNT = 52
export const PROVENANCE_CLAIM_COUNT = PROVENANCE_REVIEW_SLUG_COUNT * PROVENANCE_CLAIM_PATHS.length

export const PROVENANCE_CLAIM_KEYS = [
  "claim_id",
  "claim_path",
  "provenance_class",
  "status",
  "handling",
  "source_ids",
  "conflict_group",
  "last_checked",
  "next_check_due",
] as const

export const PROVENANCE_SOURCE_KEYS = [
  "source_id",
  "canonical_url",
  "title",
  "source_tier",
  "retrieved_at",
  "published_or_updated_at",
] as const

export type ProvenanceClass = (typeof PROVENANCE_CLASSES)[number]
export type ProvenanceStatus = (typeof PROVENANCE_STATUSES)[number]
export type ProvenanceHandling = (typeof PROVENANCE_HANDLINGS)[number]
export type ProvenanceClaimPath = (typeof PROVENANCE_CLAIM_PATHS)[number]

export interface ProvenanceClaim {
  claim_id: string
  claim_path: string
  provenance_class: ProvenanceClass
  status: ProvenanceStatus
  handling: ProvenanceHandling
  source_ids: string[]
  conflict_group: string | null
  last_checked: string
  next_check_due: string
}

export interface ProvenanceSource {
  source_id: string
  canonical_url: string
  title: string
  source_tier: 1 | 2 | 3
  retrieved_at: string
  published_or_updated_at: string | null
}

export interface ProvenanceCoverage {
  scope: "review" | "all"
  slug: string | null
  slugsWithClaimsFile: number
  totalExpectedClaims: number
  claimsWithProvenance: number
  claimsWithValidSourceRefs: number
  claimsWithoutSourceRefs: number
  claimsWithDanglingSourceRefs: number
  claimsMissingProvenance: number
  recordCoveragePercent: number
  sourceLinkedCoveragePercent: number
  recordsComplete: boolean
  sourceLinksComplete: boolean
  byStatus: Record<string, number>
  byClass: Record<string, number>
  byHandling: Record<string, number>
}

export class ProvenanceValidationError extends Error {
  readonly subject: string

  constructor(subject: string, reason: string) {
    super(`provenance validation failed: ${subject}: ${reason}`)
    this.name = "ProvenanceValidationError"
    this.subject = subject
  }
}

const ISO_FULL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const SOURCE_ID = /^src_[0-9a-f]{16}$/

const TRACKING_PARAM = /^(utm_|gclid|fbclid|mc_cid|mc_eid|igshid|yclid|msclkid|_ga|_gl|cmpid|icid)/i

/**
 * Canonical URL normalization. Rules, in order:
 *  1. scheme is forced to https
 *  2. hostname is lowercased
 *  3. default ports are dropped
 *  4. a trailing slash is removed from any non-root path, and the root path carries no slash
 *  5. the fragment is dropped
 *  6. tracking parameters are dropped: utm_*, gclid, fbclid, mc_cid, mc_eid, igshid,
 *     yclid, msclkid, _ga, _gl, cmpid, icid
 *  7. every other query parameter is preserved, sorted by key then value
 *  8. the result is idempotent: canonicalUrl(canonicalUrl(x)) === canonicalUrl(x)
 */
export function canonicalUrl(raw: string): string {
  const input = String(raw ?? "").trim()
  if (!input) return ""
  let parsed: URL
  try {
    parsed = new URL(input)
  } catch {
    return input
  }
  let pathname = parsed.pathname || "/"
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1)
  if (pathname === "/") pathname = ""
  const params = [...parsed.searchParams.entries()]
    .filter(([key]) => !TRACKING_PARAM.test(key))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1))
  const query = params
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")
  return `https://${parsed.hostname.toLowerCase()}${pathname}${query ? `?${query}` : ""}`
}

export function sourceIdFor(canonical: string): string {
  return `src_${createHash("sha256").update(canonical, "utf8").digest("hex").slice(0, 16)}`
}

const DEFAULT_FRESHNESS_POLICY = "editorial_365d"

export function freshnessDaysForClaimPath(claimPath: string): number {
  const mapped: string | undefined =
    PROVENANCE_POLICY_BY_PATH[claimPath as keyof typeof PROVENANCE_POLICY_BY_PATH]
  const policy = mapped ?? DEFAULT_FRESHNESS_POLICY
  return PROVENANCE_FRESHNESS_DAYS[policy as keyof typeof PROVENANCE_FRESHNESS_DAYS]
}

export interface SourceRowInput {
  source_url: string
  source_title: string
  source_tier: string
  retrieved_at: string
  published_or_updated_at: string
}

export interface SourceMergeConflicts {
  title: boolean
  source_tier: boolean
  retrieved_at: boolean
  published_or_updated_at: boolean
}

export interface SourceMergeResult {
  canonical_url: string
  source: ProvenanceSource | null
  conflicts: SourceMergeConflicts
  rows: number
}

function tierOf(value: string): 1 | 2 | 3 | null {
  if (value === "Tier 1") return 1
  if (value === "Tier 2") return 2
  if (value === "Tier 3") return 3
  return null
}

export function groupSourceRowsByCanonicalUrl(rows: readonly SourceRowInput[]): Map<string, SourceRowInput[]> {
  const grouped = new Map<string, SourceRowInput[]>()
  for (const row of rows) {
    const canonical = canonicalUrl(row.source_url)
    if (!canonical) continue
    const bucket = grouped.get(canonical)
    if (bucket) bucket.push(row)
    else grouped.set(canonical, [row])
  }
  return grouped
}

/**
 * Merges every register row that normalized to one canonical URL into a single source.
 * Conflicting metadata is never dropped silently: it is returned in `conflicts`.
 * Title resolves to the lexicographically smallest title from the latest retrieval,
 * retrieved_at resolves to the latest retrieval, source_tier resolves to the most
 * authoritative (lowest) tier, and a publication date resolves to the single stated
 * full date or to null. Two different stated full publication dates are a hard failure.
 * A row set carrying no Tier 1/2/3 tier yields a null source rather than a fabricated tier.
 */
export function mergeSourceRows(canonical: string, rows: readonly SourceRowInput[]): SourceMergeResult {
  if (!canonical) throw new ProvenanceValidationError("source", "canonical url is empty")
  if (rows.length === 0) throw new ProvenanceValidationError(canonical, "no rows to merge")

  const titles = [...new Set(rows.map(r => (r.source_title ?? "").trim()))]
  const tiers = rows.map(r => tierOf(r.source_tier ?? "")).filter((t): t is 1 | 2 | 3 => t !== null)
  const distinctTiers = [...new Set(tiers)]
  const retrieved = [...new Set(rows.map(r => (r.retrieved_at ?? "").trim()).filter(Boolean))].sort()
  const published = [...new Set(rows.map(r => (r.published_or_updated_at ?? "").trim()).filter(Boolean))]

  const conflicts: SourceMergeConflicts = {
    title: titles.length > 1,
    source_tier: distinctTiers.length > 1,
    retrieved_at: retrieved.length > 1,
    published_or_updated_at: published.length > 1,
  }

  if (tiers.length === 0) {
    return { canonical_url: canonical, source: null, conflicts, rows: rows.length }
  }

  const latestRetrieved = retrieved[retrieved.length - 1]
  if (!latestRetrieved) throw new ProvenanceValidationError(canonical, "no retrieved_at on any row")
  if (!ISO_DATE.test(latestRetrieved)) {
    throw new ProvenanceValidationError(canonical, `retrieved_at is not an ISO date: ${latestRetrieved}`)
  }

  const tiedTitles = rows
    .filter(r => (r.retrieved_at ?? "").trim() === latestRetrieved && (r.source_title ?? "").trim())
    .map(r => r.source_title.trim())
  const titleCandidates = [...new Set(tiedTitles.length ? tiedTitles : titles.filter(Boolean))].sort()
  if (titleCandidates.length === 0) throw new ProvenanceValidationError(canonical, "no title on any row")

  const statedFullDates = published.filter(v => ISO_DATE.test(v))
  if (statedFullDates.length > 1) {
    throw new ProvenanceValidationError(
      canonical,
      `conflicting stated publication dates: ${JSON.stringify(statedFullDates)}`
    )
  }

  const source: ProvenanceSource = {
    source_id: sourceIdFor(canonical),
    canonical_url: canonical,
    title: titleCandidates[0],
    source_tier: Math.min(...tiers) as 1 | 2 | 3,
    retrieved_at: `${latestRetrieved}T00:00:00Z`,
    published_or_updated_at: statedFullDates.length === 1 ? `${statedFullDates[0]}T00:00:00Z` : null,
  }

  return { canonical_url: canonical, source, conflicts, rows: rows.length }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function sameKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const keys = Object.keys(value)
  return keys.length === expected.length && expected.every(key => keys.includes(key))
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string")
}

function invalid(subject: string, reason: string): never {
  throw new ProvenanceValidationError(subject, reason)
}

function validateClaim(raw: unknown, slug: string): ProvenanceClaim {
  if (!isPlainObject(raw)) invalid(`${slug}#<unknown>`, "claim is not an object")
  if (!sameKeys(raw, PROVENANCE_CLAIM_KEYS)) {
    invalid(`${slug}#<unknown>`, `claim keys must be exactly ${PROVENANCE_CLAIM_KEYS.join(",")}`)
  }

  const claimPath = typeof raw.claim_path === "string" ? raw.claim_path : ""
  const subject = `${slug}#${claimPath || "<unknown>"}`
  if (!claimPath) invalid(subject, "claim_path must be a non-empty string")

  const claimId = typeof raw.claim_id === "string" ? raw.claim_id : ""
  const expectedId = `${slug}#${claimPath}`
  if (claimId !== expectedId) invalid(subject, `claim_id must equal ${expectedId}`)

  const provenanceClass = typeof raw.provenance_class === "string" ? raw.provenance_class : ""
  if (!(PROVENANCE_CLASSES as readonly string[]).includes(provenanceClass)) {
    invalid(subject, `provenance_class must be one of ${PROVENANCE_CLASSES.join("|")}`)
  }

  const status = typeof raw.status === "string" ? raw.status : ""
  if (!(PROVENANCE_STATUSES as readonly string[]).includes(status)) {
    invalid(subject, `status must be one of ${PROVENANCE_STATUSES.join("|")}`)
  }

  const handling = typeof raw.handling === "string" ? raw.handling : ""
  if (!(PROVENANCE_HANDLINGS as readonly string[]).includes(handling)) {
    invalid(subject, `handling must be one of ${PROVENANCE_HANDLINGS.join("|")}`)
  }

  if (!isStringArray(raw.source_ids)) invalid(subject, "source_ids must be an array of strings")

  const conflictGroup = raw.conflict_group
  if (conflictGroup !== null && typeof conflictGroup !== "string") {
    invalid(subject, "conflict_group must be null or a non-empty string")
  }
  if (typeof conflictGroup === "string" && !conflictGroup) {
    invalid(subject, "conflict_group must be null or a non-empty string")
  }

  const lastChecked = typeof raw.last_checked === "string" ? raw.last_checked : ""
  if (!ISO_FULL.test(lastChecked)) invalid(subject, "last_checked must be a fixed ISO timestamp")

  const nextCheckDue = typeof raw.next_check_due === "string" ? raw.next_check_due : ""
  if (!ISO_FULL.test(nextCheckDue)) invalid(subject, "next_check_due must be a fixed ISO timestamp")
  if (nextCheckDue <= lastChecked) invalid(subject, "next_check_due must be after last_checked")

  return {
    claim_id: claimId,
    claim_path: claimPath,
    provenance_class: provenanceClass as ProvenanceClass,
    status: status as ProvenanceStatus,
    handling: handling as ProvenanceHandling,
    source_ids: [...raw.source_ids].sort(),
    conflict_group: typeof conflictGroup === "string" ? conflictGroup : null,
    last_checked: lastChecked,
    next_check_due: nextCheckDue,
  }
}

function validateSource(raw: unknown, index: number): ProvenanceSource {
  const subject = `sources[${index}]`
  if (!isPlainObject(raw)) invalid(subject, "source is not an object")
  if (!sameKeys(raw, PROVENANCE_SOURCE_KEYS)) {
    invalid(subject, `source keys must be exactly ${PROVENANCE_SOURCE_KEYS.join(",")}`)
  }

  const sourceId = typeof raw.source_id === "string" ? raw.source_id : ""
  if (!SOURCE_ID.test(sourceId)) invalid(subject, "source_id must match src_<16 hex>")

  const canonical = typeof raw.canonical_url === "string" ? raw.canonical_url : ""
  if (!canonical) invalid(subject, "canonical_url must be a non-empty string")
  if (canonical !== canonicalUrl(canonical)) invalid(subject, `canonical_url is not normalized: ${canonical}`)
  if (sourceId !== sourceIdFor(canonical)) invalid(subject, `source_id is not deterministic for ${canonical}`)

  const title = typeof raw.title === "string" ? raw.title : ""
  if (!title) invalid(subject, "title must be a non-empty string")

  const tier = raw.source_tier
  if (tier !== 1 && tier !== 2 && tier !== 3) invalid(subject, "source_tier must be 1, 2 or 3")

  const retrievedAt = typeof raw.retrieved_at === "string" ? raw.retrieved_at : ""
  if (!ISO_FULL.test(retrievedAt)) invalid(subject, "retrieved_at must be a fixed ISO timestamp")

  const published = raw.published_or_updated_at
  if (published !== null) {
    if (typeof published !== "string" || !ISO_FULL.test(published)) {
      invalid(subject, "published_or_updated_at must be null or a fixed ISO timestamp")
    }
  }

  return {
    source_id: sourceId,
    canonical_url: canonical,
    title,
    source_tier: tier,
    retrieved_at: retrievedAt,
    published_or_updated_at: published,
  }
}

const claimsCache = new Map<string, { mtimeMs: number; claims: ProvenanceClaim[] }>()
const sourcesCache = { mtimeMs: -1, sources: [] as ProvenanceSource[] }

function mtimeOf(filePath: string): number {
  try {
    return fs.statSync(filePath).mtimeMs
  } catch {
    return -1
  }
}

function claimFilePath(slug: string): string {
  return path.join(CLAIMS_DIR, `${slug}.json`)
}

function readClaimFile(slug: string): ProvenanceClaim[] {
  const filePath = claimFilePath(slug)
  const mtimeMs = mtimeOf(filePath)
  const cached = claimsCache.get(slug)
  if (cached && cached.mtimeMs === mtimeMs) return cached.claims

  if (mtimeMs === -1) {
    claimsCache.set(slug, { mtimeMs: -1, claims: [] })
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"))
  } catch (error) {
    throw new ProvenanceValidationError(filePath, `unreadable JSON: ${(error as Error).message}`)
  }
  if (!Array.isArray(parsed)) invalid(filePath, "claim file must be a JSON array")

  const claims = parsed.map(item => validateClaim(item, slug))
  claimsCache.set(slug, { mtimeMs, claims })
  return claims
}

function readSources(): ProvenanceSource[] {
  const mtimeMs = mtimeOf(SOURCES_FILE)
  if (sourcesCache.mtimeMs === mtimeMs && mtimeMs !== -1) return sourcesCache.sources
  if (mtimeMs === -1) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"))
  } catch (error) {
    throw new ProvenanceValidationError(SOURCES_FILE, `unreadable JSON: ${(error as Error).message}`)
  }
  if (!Array.isArray(parsed)) invalid(SOURCES_FILE, "sources file must be a JSON array")

  const sources = parsed.map((item, index) => validateSource(item, index))
  const urls = new Set(sources.map(s => s.canonical_url))
  if (urls.size !== sources.length) invalid(SOURCES_FILE, "canonical_url must be unique")
  const ids = new Set(sources.map(s => s.source_id))
  if (ids.size !== sources.length) invalid(SOURCES_FILE, "source_id must be unique")

  sourcesCache.mtimeMs = mtimeMs
  sourcesCache.sources = sources
  return sources
}

function claimPathRank(claimPath: string): number {
  const index = (PROVENANCE_CLAIM_PATHS as readonly string[]).indexOf(claimPath)
  return index === -1 ? PROVENANCE_CLAIM_PATHS.length : index
}

function sortClaims(claims: ProvenanceClaim[]): ProvenanceClaim[] {
  return [...claims].sort((a, b) => {
    const rank = claimPathRank(a.claim_path) - claimPathRank(b.claim_path)
    if (rank !== 0) return rank
    return a.claim_path < b.claim_path ? -1 : a.claim_path > b.claim_path ? 1 : 0
  })
}

function claimFiles(): string[] {
  try {
    return fs
      .readdirSync(CLAIMS_DIR)
      .filter(name => name.endsWith(".json"))
      .sort()
  } catch {
    return []
  }
}

export function getClaims(slug: string): ProvenanceClaim[] {
  if (!slug) return []
  return sortClaims(readClaimFile(slug))
}

export function getClaim(slug: string, claimPath: string): ProvenanceClaim | null {
  if (!slug || !claimPath) return null
  return getClaims(slug).find(claim => claim.claim_path === claimPath) ?? null
}

export function getSources(): ProvenanceSource[] {
  return readSources()
}

export function getSource(sourceId: string): ProvenanceSource | null {
  if (!sourceId) return null
  return readSources().find(source => source.source_id === sourceId) ?? null
}

function percent(part: number, whole: number): number {
  if (whole <= 0) return 0
  return Math.round((part / whole) * 10000) / 100
}

function countBy(claims: ProvenanceClaim[], key: "status" | "provenance_class" | "handling"): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const claim of claims) {
    const value = claim[key]
    counts[value] = (counts[value] ?? 0) + 1
  }
  return Object.fromEntries(
    Object.keys(counts)
      .sort()
      .map(key => [key, counts[key]] as const)
  )
}

function summarise(
  scope: "review" | "all",
  slug: string | null,
  slugsWithClaimsFile: number,
  expected: number,
  claims: ProvenanceClaim[]
): ProvenanceCoverage {
  const knownSourceIds = new Set(readSources().map(s => s.source_id))
  let withValidRefs = 0
  let withoutRefs = 0
  let withDangling = 0

  for (const claim of claims) {
    if (claim.source_ids.length === 0) {
      withoutRefs++
      continue
    }
    const resolved = claim.source_ids.every(id => knownSourceIds.has(id))
    if (resolved) withValidRefs++
    else withDangling++
  }

  const stored = claims.length
  const missing = Math.max(0, expected - stored)
  const recordCoveragePercent = percent(stored, expected)
  const sourceLinkedCoveragePercent = percent(withValidRefs, expected)

  return {
    scope,
    slug,
    slugsWithClaimsFile,
    totalExpectedClaims: expected,
    claimsWithProvenance: stored,
    claimsWithValidSourceRefs: withValidRefs,
    claimsWithoutSourceRefs: withoutRefs,
    claimsWithDanglingSourceRefs: withDangling,
    claimsMissingProvenance: missing,
    recordCoveragePercent,
    sourceLinkedCoveragePercent,
    recordsComplete: stored === expected,
    sourceLinksComplete: withValidRefs === expected,
    byStatus: countBy(claims, "status"),
    byClass: countBy(claims, "provenance_class"),
    byHandling: countBy(claims, "handling"),
  }
}

export function getCoverage(slug?: string): ProvenanceCoverage {
  if (typeof slug === "string" && slug) {
    const claims = getClaims(slug)
    const present = claims.length > 0 || mtimeOf(claimFilePath(slug)) !== -1 ? 1 : 0
    return summarise("review", slug, present, PROVENANCE_CLAIM_PATHS.length, claims)
  }

  const files = claimFiles()
  const claims: ProvenanceClaim[] = []
  for (const file of files) {
    claims.push(...getClaims(file.replace(/\.json$/, "")))
  }
  return summarise("all", null, files.length, PROVENANCE_CLAIM_COUNT, sortClaims(claims))
}
