import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import {
  canonicalUrl,
  freshnessDaysForClaimPath,
  getClaim,
  getClaims,
  getCoverage,
  getSource,
  getSources,
  groupSourceRowsByCanonicalUrl,
  mergeSourceRows,
  sourceIdFor,
  PROVENANCE_CLAIM_COUNT,
  PROVENANCE_CLAIM_KEYS,
  PROVENANCE_CLAIM_PATHS,
  PROVENANCE_CLASSES,
  PROVENANCE_HANDLINGS,
  PROVENANCE_REVIEW_SLUG_COUNT,
  PROVENANCE_SOURCE_KEYS,
  PROVENANCE_STATUSES,
} from "@/lib/content/provenance"
import type { ProvenanceClaim, ProvenanceSource } from "@/lib/content/provenance"
import { getClaims as registryGetClaims } from "@/lib/content/registry"
import { ProvenanceValidationError } from "@/lib/content/provenance"

const ROOT = process.cwd()
const PROVENANCE_DIR = path.join(ROOT, "content", "provenance")
const CLAIMS_DIR = path.join(PROVENANCE_DIR, "claims")
const SOURCES_FILE = path.join(PROVENANCE_DIR, "sources.json")
const REVIEWS_DIR = path.join(ROOT, "content", "reviews")
const PHASE5B_FILE = path.join(ROOT, "_p5b_source_verification.json")

const FIXED_LAST_CHECKED = "2026-10-03T00:00:00Z"
const ISO_FULL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

function claimFileNames(): string[] {
  return fs
    .readdirSync(CLAIMS_DIR)
    .filter(name => name.endsWith(".json"))
    .sort()
}

function slugOf(fileName: string): string {
  return fileName.replace(/\.json$/, "")
}

function readStoredClaims(): { slug: string; claims: ProvenanceClaim[] }[] {
  return claimFileNames().map(fileName => {
    const raw = fs.readFileSync(path.join(CLAIMS_DIR, fileName), "utf8")
    return { slug: slugOf(fileName), claims: JSON.parse(raw) as ProvenanceClaim[] }
  })
}

function readStoredSources(): ProvenanceSource[] {
  return JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8")) as ProvenanceSource[]
}

function rawBytesOfProvenance(): string[] {
  const bytes = [fs.readFileSync(SOURCES_FILE, "utf8")]
  for (const name of claimFileNames()) {
    bytes.push(fs.readFileSync(path.join(CLAIMS_DIR, name), "utf8"))
  }
  return bytes
}

function expectedDueDate(days: number): string {
  const base = Date.UTC(2026, 9, 3)
  return new Date(base + days * 86400000).toISOString().slice(0, 19) + "Z"
}

function validationSnapshot(): Record<string, unknown> {
  const sources = getSources()
  const claims = readStoredClaims()
  const flat = claims.flatMap(entry => entry.claims)
  return {
    sourceCount: sources.length,
    canonicalUnique: new Set(sources.map(s => s.canonical_url)).size,
    sourceIdUnique: new Set(sources.map(s => s.source_id)).size,
    claimCount: flat.length,
    claimIdUnique: new Set(flat.map(c => c.claim_id)).size,
    tierDistribution: [1, 2, 3].map(tier => sources.filter(s => s.source_tier === tier).length),
    statusDistribution: Object.fromEntries(
      [...new Set(flat.map(c => c.status))].sort().map(status => [
        status,
        flat.filter(c => c.status === status).length,
      ])
    ),
    coverage: getCoverage(),
  }
}

describe("T-PROV-01: every review slug has provenance and coverage is numeric", () => {
  const files = claimFileNames()
  const stored = readStoredClaims()

  it("has one claim file for each of the 52 review slugs", () => {
    expect(files).toHaveLength(PROVENANCE_REVIEW_SLUG_COUNT)
    expect(files).toHaveLength(52)
    for (const file of files) {
      expect(fs.existsSync(path.join(REVIEWS_DIR, file))).toBe(true)
    }
  })

  it("represents all 728 expected claim paths", () => {
    expect(PROVENANCE_CLAIM_PATHS).toHaveLength(14)
    expect(PROVENANCE_CLAIM_COUNT).toBe(728)

    let total = 0
    for (const entry of stored) {
      expect(entry.claims).toHaveLength(PROVENANCE_CLAIM_PATHS.length)
      const paths = entry.claims.map(claim => claim.claim_path)
      expect([...paths].sort()).toEqual([...PROVENANCE_CLAIM_PATHS].sort())
      expect(new Set(paths).size).toBe(PROVENANCE_CLAIM_PATHS.length)
      total += entry.claims.length
    }
    expect(total).toBe(PROVENANCE_CLAIM_COUNT)
    expect(total).toBe(728)
  })

  it("reports record coverage and source-linked coverage as separate numbers", () => {
    const coverage = getCoverage()

    expect(typeof coverage.recordCoveragePercent).toBe("number")
    expect(typeof coverage.sourceLinkedCoveragePercent).toBe("number")

    expect(coverage.totalExpectedClaims).toBe(728)
    expect(coverage.claimsWithProvenance).toBe(728)
    expect(coverage.claimsMissingProvenance).toBe(0)
    expect(coverage.recordCoveragePercent).toBe(100)
    expect(coverage.recordsComplete).toBe(true)

    expect(coverage.claimsWithValidSourceRefs).toBe(14)
    expect(coverage.claimsWithoutSourceRefs).toBe(714)
    expect(coverage.sourceLinkedCoveragePercent).toBe(1.92)
    expect(coverage.sourceLinksComplete).toBe(false)

    expect(coverage.recordCoveragePercent).toBeGreaterThan(coverage.sourceLinkedCoveragePercent)
    expect(coverage.sourceLinkedCoveragePercent).toBeLessThan(100)
  })

  it("does not describe incomplete coverage as verified", () => {
    const coverage = getCoverage()
    expect(coverage.byStatus).toEqual({ MISSING: 728 })
    expect(coverage.byStatus.VERIFIED).toBeUndefined()
    expect(coverage.sourceLinksComplete).toBe(false)
  })

  it("computes per-slug coverage against 14 expected claims", () => {
    const coverage = getCoverage("okta")
    expect(coverage.scope).toBe("review")
    expect(coverage.slug).toBe("okta")
    expect(coverage.totalExpectedClaims).toBe(14)
    expect(coverage.claimsWithProvenance).toBe(14)
    expect(coverage.claimsMissingProvenance).toBe(0)
    expect(coverage.recordCoveragePercent).toBe(100)
    expect(coverage.sourceLinkedCoveragePercent).toBeGreaterThan(0)
    expect(coverage.sourceLinksComplete).toBe(false)
  })

  it("matches the Phase 5B classification when that artefact is available", () => {
    if (!fs.existsSync(PHASE5B_FILE)) return
    const phase5b = JSON.parse(fs.readFileSync(PHASE5B_FILE, "utf8")) as {
      provenance_claims: { slug: string; fact: string; class: string; phase4_status: string; recommended_handling: string }[]
    }
    const expected = new Map(
      phase5b.provenance_claims.map(record => [`${record.slug}#${record.fact}`, record])
    )
    expect(expected.size).toBe(728)

    const actual = new Map<string, ProvenanceClaim>()
    for (const entry of stored) {
      for (const claim of entry.claims) actual.set(claim.claim_id, claim)
    }
    expect(actual.size).toBe(728)
    expect([...actual.keys()].sort()).toEqual([...expected.keys()].sort())

    for (const [claimId, claim] of actual) {
      const record = expected.get(claimId)
      expect(record).toBeDefined()
      if (!record) continue
      expect(claim.status).toBe(record.phase4_status)
      expect(claim.provenance_class).toBe(record.class)
      expect(claim.handling).toBe(record.recommended_handling)
    }
  })
})

describe("T-PROV-02: source references resolve and readers fail soft", () => {
  it("resolves every referenced source_id", () => {
    const known = new Set(getSources().map(source => source.source_id))
    let referenced = 0
    for (const entry of readStoredClaims()) {
      for (const claim of entry.claims) {
        for (const id of claim.source_ids) {
          referenced++
          expect(known.has(id)).toBe(true)
        }
      }
    }
    expect(referenced).toBe(14)
    expect(getCoverage().claimsWithDanglingSourceRefs).toBe(0)
  })

  it("returns deterministic results across repeated lookups", () => {
    const first = getClaims("okta")
    const second = getClaims("okta")
    expect(first).toEqual(second)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))

    const claim = getClaim("okta", "price_range")
    expect(claim).not.toBeNull()
    expect(getClaim("okta", "price_range")).toEqual(claim)
    expect(getClaim("okta", "rating")?.status).toBe("MISSING")

    expect(JSON.stringify(getSources())).toBe(JSON.stringify(getSources()))
  })

  it("fails soft when a claim file does not exist", () => {
    expect(() => getClaims("no-such-review-slug")).not.toThrow()
    expect(getClaims("no-such-review-slug")).toEqual([])
    expect(getClaim("no-such-review-slug", "rating")).toBeNull()

    const coverage = getCoverage("no-such-review-slug")
    expect(coverage.totalExpectedClaims).toBe(14)
    expect(coverage.claimsWithProvenance).toBe(0)
    expect(coverage.claimsMissingProvenance).toBe(14)
    expect(coverage.recordCoveragePercent).toBe(0)
    expect(coverage.recordsComplete).toBe(false)
    expect(() => getClaims("")).not.toThrow()
    expect(getClaims("")).toEqual([])
    expect(getClaim("", "rating")).toBeNull()
  })

  it("returns null instead of fabricating a missing source", () => {
    expect(getSource("src_0000000000000000")).toBeNull()
    expect(getSource("")).toBeNull()
    expect(getSource("not-a-source-id")).toBeNull()
  })

  it("exposes the reader through the content registry without touching published filters", () => {
    expect(registryGetClaims("okta")).toEqual(getClaims("okta"))
  })
})

describe("T-PROV-03: schema, enums, deterministic identity", () => {
  const stored = readStoredClaims()
  const sources = readStoredSources()

  it("stores claims with exactly the approved nine fields", () => {
    for (const entry of stored) {
      for (const claim of entry.claims) {
        expect(Object.keys(claim).sort()).toEqual([...PROVENANCE_CLAIM_KEYS].sort())
        expect(Array.isArray(claim.source_ids)).toBe(true)
        expect(claim.conflict_group === null || typeof claim.conflict_group === "string").toBe(true)
        expect(claim.last_checked).toMatch(ISO_FULL)
        expect(claim.next_check_due).toMatch(ISO_FULL)
        expect(claim.next_check_due > claim.last_checked).toBe(true)
      }
    }
  })

  it("stores sources with exactly the approved six fields", () => {
    for (const source of sources) {
      expect(Object.keys(source).sort()).toEqual([...PROVENANCE_SOURCE_KEYS].sort())
      expect([1, 2, 3]).toContain(source.source_tier)
      expect(source.retrieved_at).toMatch(ISO_FULL)
      expect(source.published_or_updated_at === null || ISO_FULL.test(source.published_or_updated_at)).toBe(true)
      expect(source.title.length).toBeGreaterThan(0)
    }
  })

  it("uses only allowed classes, statuses and handlings", () => {
    const classes = new Set<string>()
    const statuses = new Set<string>()
    const handlings = new Set<string>()
    for (const entry of stored) {
      for (const claim of entry.claims) {
        classes.add(claim.provenance_class)
        statuses.add(claim.status)
        handlings.add(claim.handling)
      }
    }
    for (const value of classes) expect(PROVENANCE_CLASSES).toContain(value as never)
    for (const value of statuses) expect(PROVENANCE_STATUSES).toContain(value as never)
    for (const value of handlings) expect(PROVENANCE_HANDLINGS).toContain(value as never)

    expect([...classes].sort()).toEqual(["A", "B", "C", "D", "E"])
    expect([...statuses]).toEqual(["MISSING"])
    expect([...handlings].sort()).toEqual(
      ["ADD_PROVENANCE", "KEEP", "REMAIN_UNVERIFIED", "REQUIRE_MANUAL_REVIEW"].sort()
    )
  })

  it("derives deterministic claim ids that are globally unique", () => {
    const ids: string[] = []
    for (const entry of stored) {
      for (const claim of entry.claims) {
        expect(claim.claim_id).toBe(`${entry.slug}#${claim.claim_path}`)
        ids.push(claim.claim_id)
      }
    }
    expect(ids).toHaveLength(728)
    expect(new Set(ids).size).toBe(728)
  })

  it("derives deterministic source ids from the canonical url", () => {
    const ids = new Set<string>()
    const urls = new Set<string>()
    for (const source of sources) {
      expect(source.source_id).toBe(sourceIdFor(source.canonical_url))
      expect(source.canonical_url).toBe(canonicalUrl(source.canonical_url))
      ids.add(source.source_id)
      urls.add(source.canonical_url)
    }
    expect(sources).toHaveLength(283)
    expect(ids.size).toBe(283)
    expect(urls.size).toBe(283)
  })

  it("keeps the Phase 5B tier distribution", () => {
    const byTier = [1, 2, 3].map(tier => sources.filter(s => s.source_tier === tier).length)
    expect(byTier).toEqual([217, 29, 37])
  })
})

describe("T-FRESH-02: provenance output is deterministic and clock-free", () => {
  it("produces byte-identical provenance across repeated reads", () => {
    const first = rawBytesOfProvenance()
    const second = rawBytesOfProvenance()
    expect(first).toEqual(second)
    expect(first.length).toBe(53)
  })

  it("reads no current clock from the provenance module", () => {
    const source = fs.readFileSync(path.join(ROOT, "src", "lib", "content", "provenance.ts"), "utf8")
    expect(source).not.toMatch(/Date\.now\(/)
    expect(source).not.toMatch(/new Date\(/)
    expect(source).not.toMatch(/performance\.now\(/)
    expect(source).not.toMatch(/process\.hrtime/)
    expect(source).not.toMatch(/\bDate\b\s*\(/)
  })

  it("pins last_checked to a stored constant instead of build time", () => {
    const statuses = new Set<string>()
    for (const entry of readStoredClaims()) {
      for (const claim of entry.claims) {
        expect(claim.last_checked).toBe(FIXED_LAST_CHECKED)
        statuses.add(claim.last_checked)
      }
    }
    expect([...statuses]).toEqual([FIXED_LAST_CHECKED])
    for (const source of getSources()) {
      expect(source.retrieved_at).toMatch(ISO_FULL)
    }
  })

  it("derives next_check_due from the approved freshness intervals", () => {
    expect(freshnessDaysForClaimPath("price_range")).toBe(90)
    expect(freshnessDaysForClaimPath("pricing_object")).toBe(90)
    expect(freshnessDaysForClaimPath("rating")).toBe(365)
    expect(freshnessDaysForClaimPath("pros")).toBe(365)

    for (const entry of readStoredClaims()) {
      for (const claim of entry.claims) {
        const days = freshnessDaysForClaimPath(claim.claim_path)
        expect(claim.next_check_due).toBe(expectedDueDate(days))
      }
    }
    expect(expectedDueDate(90)).toBe("2027-01-01T00:00:00Z")
    expect(expectedDueDate(180)).toBe("2027-04-01T00:00:00Z")
    expect(expectedDueDate(365)).toBe("2027-10-03T00:00:00Z")
  })

  it("returns an identical validation result on repeated runs", () => {
    expect(validationSnapshot()).toEqual(validationSnapshot())
  })

  it("performs no status promotion anywhere in the stored data", () => {
    const flat = readStoredClaims().flatMap(entry => entry.claims)
    expect(flat.every(claim => claim.status === "MISSING")).toBe(true)
    expect(flat.some(claim => claim.status === "VERIFIED")).toBe(false)
    expect(flat.filter(claim => claim.handling === "KEEP").every(claim => claim.status === "MISSING")).toBe(true)
  })
})

describe("canonical url normalization", () => {
  it("applies the documented rules", () => {
    expect(canonicalUrl("http://example.com/a/b")).toBe("https://example.com/a/b")
    expect(canonicalUrl("HTTPS://EXAMPLE.COM")).toBe("https://example.com")
    expect(canonicalUrl("https://example.com:443/a")).toBe("https://example.com/a")
    expect(canonicalUrl("https://example.com/a/b/")).toBe("https://example.com/a/b")
    expect(canonicalUrl("https://example.com/")).toBe("https://example.com")
    expect(canonicalUrl("https://example.com/page#section")).toBe("https://example.com/page")
    expect(
      canonicalUrl("http://Example.COM:443/a/b/?utm_source=x&utm_medium=y&b=2&a=1#frag")
    ).toBe("https://example.com/a/b?a=1&b=2")
  })

  it("preserves meaningful query parameters", () => {
    expect(canonicalUrl("https://example.com/x?page=2&q=hello%20world")).toBe(
      "https://example.com/x?page=2&q=hello%20world"
    )
    expect(canonicalUrl("https://example.com/x?gclid=abc&page=2")).toBe("https://example.com/x?page=2")
  })

  it("is idempotent", () => {
    const inputs = [
      "http://example.com/a/b/?utm_source=x&b=2&a=1#frag",
      "https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001535527&action=getcompany&count=10",
      "https://example.com/",
      "not a url at all",
    ]
    for (const input of inputs) {
      const once = canonicalUrl(input)
      expect(canonicalUrl(once)).toBe(once)
    }
  })
})

describe("duplicate source merge determinism and conflict detection", () => {
  const rows = [
    {
      source_url: "https://vendor.com/pricing/",
      source_title: "Vendor Pricing Page",
      source_tier: "Tier 1",
      retrieved_at: "2026-10-02",
      published_or_updated_at: "",
    },
    {
      source_url: "https://vendor.com/pricing?utm_source=newsletter",
      source_title: "Vendor Pricing",
      source_tier: "Tier 3",
      retrieved_at: "2026-10-03",
      published_or_updated_at: "",
    },
  ]

  it("groups rows that normalize to one canonical url", () => {
    const grouped = groupSourceRowsByCanonicalUrl(rows)
    expect([...grouped.keys()]).toEqual(["https://vendor.com/pricing"])
    expect(grouped.get("https://vendor.com/pricing")).toHaveLength(2)
  })

  it("merges deterministically and reports every conflict", () => {
    const grouped = groupSourceRowsByCanonicalUrl(rows)
    const [canonical, bucket] = [...grouped.entries()][0]
    const first = mergeSourceRows(canonical, bucket)
    const second = mergeSourceRows(canonical, bucket)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))

    expect(first.source).not.toBeNull()
    expect(first.conflicts).toEqual({
      title: true,
      source_tier: true,
      retrieved_at: true,
      published_or_updated_at: false,
    })
    expect(first.source?.source_tier).toBe(1)
    expect(first.source?.retrieved_at).toBe("2026-10-03T00:00:00Z")
    expect(first.source?.title).toBe("Vendor Pricing")
    expect(first.source?.source_id).toBe(sourceIdFor("https://vendor.com/pricing"))
    expect(first.rows).toBe(2)
  })

  it("keeps partial publication dates null instead of inventing precision", () => {
    const merged = mergeSourceRows("https://vendor.com/about", [
      {
        source_url: "https://vendor.com/about",
        source_title: "About",
        source_tier: "Tier 1",
        retrieved_at: "2026-10-02",
        published_or_updated_at: "September 2026",
      },
      {
        source_url: "https://vendor.com/about",
        source_title: "About",
        source_tier: "Tier 1",
        retrieved_at: "2026-10-02",
        published_or_updated_at: "2026-08",
      },
    ])
    expect(merged.source?.published_or_updated_at).toBeNull()
    expect(merged.conflicts.published_or_updated_at).toBe(true)
  })

  it("keeps a single stated full publication date", () => {
    const merged = mergeSourceRows("https://vendor.com/legal", [
      {
        source_url: "https://vendor.com/legal",
        source_title: "Legal",
        source_tier: "Tier 2",
        retrieved_at: "2026-10-02",
        published_or_updated_at: "2026-03-05",
      },
    ])
    expect(merged.source?.published_or_updated_at).toBe("2026-03-05T00:00:00Z")
    expect(merged.conflicts.published_or_updated_at).toBe(false)
  })

  it("fails validation rather than silently choosing between two stated dates", () => {
    expect(() =>
      mergeSourceRows("https://vendor.com/report", [
        {
          source_url: "https://vendor.com/report",
          source_title: "Report",
          source_tier: "Tier 2",
          retrieved_at: "2026-10-02",
          published_or_updated_at: "2026-01-01",
        },
        {
          source_url: "https://vendor.com/report",
          source_title: "Report",
          source_tier: "Tier 2",
          retrieved_at: "2026-10-02",
          published_or_updated_at: "2026-06-01",
        },
      ])
    ).toThrow(ProvenanceValidationError)
  })

  it("does not fabricate a tier when no row carries one", () => {
    const merged = mergeSourceRows("https://pilotstack.online/methodology", [
      {
        source_url: "https://pilotstack.online/methodology",
        source_title: "Methodology",
        source_tier: "internal",
        retrieved_at: "2026-10-03",
        published_or_updated_at: "",
      },
    ])
    expect(merged.source).toBeNull()
    expect(merged.rows).toBe(1)
  })

  it("rejects an empty row set", () => {
    expect(() => mergeSourceRows("https://vendor.com", [])).toThrow(ProvenanceValidationError)
  })
})

describe("partial and missing publication dates stay null in stored data", () => {
  it("stores null or a full ISO timestamp only", () => {
    const sources = getSources()
    const nulls = sources.filter(s => s.published_or_updated_at === null)
    const dated = sources.filter(s => s.published_or_updated_at !== null)
    expect(nulls.length + dated.length).toBe(sources.length)
    expect(nulls.length).toBeGreaterThan(0)
    for (const source of dated) {
      expect(source.published_or_updated_at).toMatch(ISO_FULL)
    }
  })
})

describe("rendering and SEO surfaces remain untouched", () => {
  it("does not import provenance into the review page or company facts", () => {
    const page = fs.readFileSync(path.join(ROOT, "src", "app", "reviews", "[slug]", "page.tsx"), "utf8")
    const companyFacts = fs.readFileSync(path.join(ROOT, "src", "lib", "company-facts.ts"), "utf8")
    expect(page).not.toMatch(/content\/provenance/)
    expect(page).not.toMatch(/from\s+["']@\/lib\/content\/provenance["']/)
    expect(companyFacts).not.toMatch(/provenance/)
  })

  it("keeps the registry published filters free of provenance imports", () => {
    const registry = fs.readFileSync(path.join(ROOT, "src", "lib", "content", "registry.ts"), "utf8")
    const publishedFilterSection = registry.slice(0, registry.indexOf("export {"))
    expect(publishedFilterSection).not.toMatch(/provenance/)
    expect(registry).toMatch(/from "@\/lib\/content\/provenance"/)
  })
})
