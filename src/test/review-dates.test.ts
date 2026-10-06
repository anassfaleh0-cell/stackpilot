import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execFileSync } from "node:child_process"
import { getReview } from "@/lib/content/registry"

const ROOT = process.cwd()
const REVIEWS_DIR = path.join(ROOT, "content", "reviews")
const NOINDEX_FILE = path.join(ROOT, "noindex-list.json")
const REVIEW_PAGE = path.join(ROOT, "src", "app", "reviews", "[slug]", "page.tsx")
const EDITORIAL_EXPERT = path.join(ROOT, "src", "components", "editorial", "editorial-expert.tsx")
const SITEMAP = path.join(ROOT, "src", "app", "sitemap.ts")
const RSS = path.join(ROOT, "src", "app", "rss.xml", "route.ts")
const TYPES_FILE = path.join(ROOT, "src", "types", "content.ts")
const REGISTRY_FILE = path.join(ROOT, "src", "lib", "content", "registry.ts")

const ISO = /^\d{4}-\d{2}-\d{2}$/
const EXPECTED_REVIEW_COUNT = 151
const EXPECTED_INDEXABLE = 138
const EXPECTED_NOINDEXED = 13

// Frozen before the H-09A migration: the review slug set and its indexability split
// must not move as part of a date-semantics change. The split hashes were re-frozen by
// Phase INDEX-01 after exactly the approved 39 review recoveries (151 total unchanged).
const EXPECTED_ALL_HASH = "ad1f5547a64c4dc2"
const EXPECTED_INDEXABLE_HASH = "32f68eb41ed3dc83"
const EXPECTED_NOINDEX_HASH = "e2c85693b32a936a"

function read(file: string): string {
  return fs.readFileSync(file, "utf8")
}

function sha16(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16)
}

const slugFiles = fs.readdirSync(REVIEWS_DIR).filter((f) => f.endsWith(".json")).sort()
const slugs = slugFiles.map((f) => f.replace(/\.json$/, "")).sort()

const stored = slugFiles.map((file) => {
  const data = JSON.parse(read(path.join(REVIEWS_DIR, file))) as Record<string, unknown>
  return { slug: file.replace(/\.json$/, ""), data }
})

const reviewPageSrc = read(REVIEW_PAGE)
const editorialExpertSrc = read(EDITORIAL_EXPERT)
const sitemapSrc = read(SITEMAP)
const rssSrc = read(RSS)
const typesSrc = read(TYPES_FILE)
const registrySrc = read(REGISTRY_FILE)

const noindexDoc = JSON.parse(read(NOINDEX_FILE)) as {
  directories: { reviews: { keep: string[]; noindex: string[] } }
}
const keepSlugs = [...noindexDoc.directories.reviews.keep].sort()
const noindexSlugs = [...noindexDoc.directories.reviews.noindex].sort()
const allNoindexSlugs = [...keepSlugs, ...noindexSlugs].sort()

let hasGit = false
try {
  hasGit =
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: ROOT, encoding: "utf8" }).trim() === "true"
} catch {
  hasGit = false
}

// One traversal: for every review file, the (newest-first) dates of the commits that touched it.
// Used to prove both canonical dates are repository-backed rather than invented or clock-derived.
function reviewCommitDates(): Map<string, string[]> {
  const out = execFileSync(
    "git",
    ["log", "--format=%cs", "--name-only", "--", "content/reviews"],
    { cwd: ROOT, encoding: "utf8" },
  )
  const map = new Map<string, string[]>()
  let currentDate = ""
  for (const rawLine of out.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    if (ISO.test(line)) {
      currentDate = line
      continue
    }
    if (currentDate && line.startsWith("content/reviews/") && line.endsWith(".json")) {
      const dates = map.get(line)
      if (dates) dates.push(currentDate)
      else map.set(line, [currentDate])
    }
  }
  return map
}

// The migration derived contentPublished with
//   git log --follow --diff-filter=A --format=%cs -- content/reviews/<slug>.json
// The batch above stops at a rename, so for a renamed file it reports the rename commit
// rather than the original creation. Only calendly.json has such a chain today
// (calndly.json -> calendly.json, R099 @ f7b7b2c), so the slow --follow path runs for it.
function gitAddedDate(relPath: string): string {
  const out = execFileSync(
    "git",
    ["log", "--follow", "--diff-filter=A", "--format=%cs", "--", relPath],
    { cwd: ROOT, encoding: "utf8" },
  )
  const lines = out.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines[lines.length - 1]
}

describe("H-09A migration integrity", () => {
  it("1. every review file has contentPublished", () => {
    const missing = stored.filter((r) => typeof r.data.contentPublished !== "string").map((r) => r.slug)
    expect(missing).toEqual([])
    expect(stored.filter((r) => typeof r.data.contentPublished === "string")).toHaveLength(EXPECTED_REVIEW_COUNT)
  })

  it("2. every review file has contentModified", () => {
    const missing = stored.filter((r) => typeof r.data.contentModified !== "string").map((r) => r.slug)
    expect(missing).toEqual([])
    expect(stored.filter((r) => typeof r.data.contentModified === "string")).toHaveLength(EXPECTED_REVIEW_COUNT)
  })

  it("3. no review file and no source file uses lastReviewed", () => {
    const inContent = stored.filter((r) => "lastReviewed" in r.data).map((r) => r.slug)
    expect(inContent).toEqual([])

    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (entry.name !== "test") walk(full)
        } else if (/\.(ts|tsx)$/.test(entry.name) && read(full).includes("lastReviewed")) offenders.push(full)
      }
    }
    walk(path.join(ROOT, "src"))
    expect(offenders).toEqual([])
    expect(typesSrc).not.toContain("lastReviewed")
  })

  it("4./5. both dates are stored ISO strings and are ordered", () => {
    for (const { slug, data } of stored) {
      const published = String(data.contentPublished)
      const modified = String(data.contentModified)
      expect(published, `${slug}: contentPublished`).toMatch(ISO)
      expect(modified, `${slug}: contentModified`).toMatch(ISO)
      expect(published <= modified, `${slug}: ${published} <= ${modified}`).toBe(true)
    }
  })

  it("151 migration integrity: 151 files = 151 contentPublished = 151 contentModified", () => {
    expect(slugFiles).toHaveLength(EXPECTED_REVIEW_COUNT)
    expect(new Set(stored.map((r) => r.data.contentPublished)).size).toBeGreaterThanOrEqual(1)
    const publishedCount = stored.filter((r) => ISO.test(String(r.data.contentPublished))).length
    const modifiedCount = stored.filter((r) => ISO.test(String(r.data.contentModified))).length
    expect(publishedCount).toBe(EXPECTED_REVIEW_COUNT)
    expect(modifiedCount).toBe(EXPECTED_REVIEW_COUNT)
  })

  it("the registry returns the stored values unchanged (no runtime rewriting)", () => {
    for (const { slug, data } of stored) {
      const viaRegistry = getReview(slug)
      expect(viaRegistry?.contentPublished, `${slug}: contentPublished`).toBe(data.contentPublished)
      expect(viaRegistry?.contentModified, `${slug}: contentModified`).toBe(data.contentModified)
    }
  })
})

describe.skipIf(!hasGit)("H-09A git derivation", () => {
  it("contentPublished equals the git first-added date of the review file", () => {
    const byFile = reviewCommitDates()
    for (const { slug, data } of stored) {
      const rel = `content/reviews/${slug}.json`
      const dates = byFile.get(rel) ?? []
      expect(dates.length, `${slug}: git history`).toBeGreaterThan(0)
      const batchEarliest = dates[dates.length - 1]
      const expected = batchEarliest === data.contentPublished ? batchEarliest : gitAddedDate(rel)
      expect(String(data.contentPublished), `${slug}: contentPublished from git`).toBe(expected)
    }
  }, 120000)

  it("contentModified is a real git commit date for the same review file", () => {
    const byFile = reviewCommitDates()
    for (const { slug, data } of stored) {
      const dates = byFile.get(`content/reviews/${slug}.json`) ?? []
      expect(dates.length, `${slug}: git history`).toBeGreaterThan(0)
      expect(dates, `${slug}: contentModified ${data.contentModified} must come from git history`).toContain(
        data.contentModified,
      )
    }
  })
})

describe("H-09A structured data and open graph", () => {
  it("6. Article.datePublished uses contentPublished", () => {
    expect(reviewPageSrc).toMatch(/<ArticleSchema[^>]*publishedAt=\{tool\.contentPublished\}/s)
  })

  it("7. Article.dateModified uses contentModified", () => {
    expect(reviewPageSrc).toMatch(/<ArticleSchema[^>]*updatedAt=\{tool\.contentModified\}/s)
  })

  it("8. WebPage.dateModified uses contentModified", () => {
    expect(reviewPageSrc).toMatch(/<WebPageSchema[^>]*dateModified=\{tool\.contentModified\}/s)
  })

  it("9. OpenGraph publishedTime uses contentPublished", () => {
    expect(reviewPageSrc).toMatch(/publishedAt:\s*tool\.contentPublished/)
    expect(reviewPageSrc).not.toMatch(/publishedAt:\s*tool\.lastReviewed/)
  })

  it("10. OpenGraph modifiedTime uses contentModified", () => {
    expect(reviewPageSrc).toMatch(/updatedAt:\s*tool\.contentModified/)
    expect(reviewPageSrc).not.toMatch(/updatedAt:\s*tool\.lastReviewed/)
  })

  it("Review datePublished uses contentPublished", () => {
    expect(reviewPageSrc).toMatch(/<ReviewSchema[^>]*datePublished=\{tool\.contentPublished\}/s)
  })

  it("no structured-data date is sourced from lastReviewed", () => {
    expect(reviewPageSrc).not.toContain("tool.lastReviewed")
  })
})

describe("H-09A sitemap", () => {
  it("12. review lastmod uses contentModified", () => {
    expect(sitemapSrc).toMatch(/lastModified:\s*new Date\(r\.contentModified\)/)
    expect(sitemapSrc).not.toContain("r.lastReviewed")
  })

  it("the review entry block is otherwise untouched", () => {
    expect(sitemapSrc).toContain('url: `${siteConfig.url}/reviews/${r.slug}`')
    expect(sitemapSrc).toContain("isQuality(r.slug, \"reviews\")")
    expect(sitemapSrc).toContain("const LISTING_DATE = new Date()")
  })
})

describe("H-09A rss", () => {
  it("11. review pubDate uses contentPublished", () => {
    expect(rssSrc).toMatch(/<pubDate>\$\{new Date\(r\.contentPublished\)\.toUTCString\(\)\}<\/pubDate>/)
    expect(rssSrc).not.toContain("r.lastReviewed")
    expect(rssSrc).not.toContain("r.contentModified")
  })

  it("16b. research items no longer fall back to a build clock", () => {
    expect(rssSrc).not.toContain("new Date().toISOString()")
    expect(rssSrc).toContain("const pubDate = r.publishedAt || r.updatedAt")
  })
})

describe("H-09A visible dates", () => {
  it("18. no false 'Reviewed:' or 'Last reviewed' label remains", () => {
    expect(reviewPageSrc).not.toMatch(/Last reviewed:/)
    expect(reviewPageSrc).not.toMatch(/Updated \{formatDate\(tool\./)
    expect(editorialExpertSrc).not.toContain("Reviewed:")
    expect(editorialExpertSrc).not.toContain("reviewedAt")
  })

  it("the page renders Published from contentPublished and Content updated from contentModified", () => {
    expect(reviewPageSrc).toMatch(/Published \{formatDate\(tool\.contentPublished\)\}/)
    expect(reviewPageSrc).toMatch(/Content updated: \{formatDate\(tool\.contentModified\)\}/)
  })

  it("the duplicate 'Last updated' sentence is gone", () => {
    expect(reviewPageSrc).not.toMatch(/Last updated \{/)
  })

  it("17. no provenance date is used as a content or SEO date", () => {
    for (const src of [reviewPageSrc, sitemapSrc, rssSrc]) {
      expect(src).not.toContain("last_checked")
      expect(src).not.toContain("next_check_due")
      expect(src).not.toContain("sourcesChecked")
      expect(src).not.toContain("getClaim")
    }
  })

  it("'Sources checked' is deferred to H-09B and is not rendered yet", () => {
    expect(reviewPageSrc).not.toContain("Sources checked")
  })

  it("16. no bare new Date() clock is used for review dates", () => {
    expect(reviewPageSrc).not.toMatch(/new Date\(\)/)
    const bareRssClocks = rssSrc.match(/new Date\(\)/g) ?? []
    expect(bareRssClocks).toHaveLength(1)
    expect(rssSrc).toContain("<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>")
  })
})

describe("H-09A seo safety", () => {
  it("13. the review page emits no AggregateRating", () => {
    expect(reviewPageSrc).not.toContain("AggregateRating")
    expect(reviewPageSrc).not.toContain("aggregateRating")
  })

  it("14. ReviewSchema still receives the stored editorial rating", () => {
    expect(reviewPageSrc).toMatch(/<ReviewSchema[^>]*rating=\{tool\.rating\}/s)
    expect(reviewPageSrc).not.toContain("reviewRating={")
  })

  it("15. review URL set is unchanged and the indexability split matches the Phase INDEX-01 freeze", () => {
    expect(slugs.length).toBe(EXPECTED_REVIEW_COUNT)
    expect(keepSlugs).toHaveLength(EXPECTED_INDEXABLE)
    expect(noindexSlugs).toHaveLength(EXPECTED_NOINDEXED)
    expect(allNoindexSlugs).toEqual(slugs)
    expect(sha16(allNoindexSlugs.join("\n"))).toBe(EXPECTED_ALL_HASH)
    expect(sha16(keepSlugs.join("\n"))).toBe(EXPECTED_INDEXABLE_HASH)
    expect(sha16(noindexSlugs.join("\n"))).toBe(EXPECTED_NOINDEX_HASH)
  })

  it("the type model exposes exactly the two canonical review dates", () => {
    expect(typesSrc).toMatch(/contentPublished: string/)
    expect(typesSrc).toMatch(/contentModified: string/)
    expect(typesSrc).not.toMatch(/lastReviewed:/)
    expect(registrySrc).toContain('"contentPublished"')
    expect(registrySrc).toContain('"contentModified"')
  })
})
