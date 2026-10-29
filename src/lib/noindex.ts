import fs from "fs"
import path from "path"

const NOINDEX_CACHE = new Map<string, Set<string>>()

function loadNoindexList(dir: string): Set<string> {
  if (NOINDEX_CACHE.has(dir)) return NOINDEX_CACHE.get(dir)!

  const listPath = path.join(process.cwd(), "noindex-list.json")
  const set = new Set<string>()

  try {
    if (fs.existsSync(listPath)) {
      const data = JSON.parse(fs.readFileSync(listPath, "utf-8"))
      if (data.directories?.[dir]?.noindex) {
        for (const slug of data.directories[dir].noindex) {
          set.add(slug)
        }
      }
    }
  } catch {
    // File doesn't exist or is invalid — allow all
  }

  NOINDEX_CACHE.set(dir, set)
  return set
}

// Editorially triaged, unrelated head-to-head pages are retained for direct
// access and revision, but must not be advertised as indexable buying advice.
// Do NOT apply this rule indiscriminately to the legacy manifest: that inventory
// has not been reviewed URL by URL against Search Console performance data.
export const EDITORIAL_NOINDEX_COMPARISONS = new Set([
  "1password-vs-appwrite", // password manager vs application backend
  "1password-vs-crowdstrike", // password manager vs endpoint security
  // Buyer intent is accounting/expense management or integration, not a
  // head-to-head alternative to Square's payments/commerce platform.
  "expensify-vs-square",
  "freshbooks-vs-square",
  "quickbooks-vs-square",
  "sage-intacct-vs-square",
  "sage-vs-square",
  "square-vs-wave",
  "square-vs-zoho-books",
])


// A market-statistics page is search-ready only after a source audit with
// checkable per-figure URLs and dates. An unverified number must not become an
// indexable Dataset simply because its raw JSON contains a publisher name.
const statisticEvidenceCache = new Map<string, boolean>()

export function hasCompleteStatisticEvidence(slug: string): boolean {
  if (!/^[a-z0-9-]+$/.test(slug)) return false
  const cached = statisticEvidenceCache.get(slug)
  if (cached !== undefined) return cached

  let verified = false
  try {
    const file = path.join(process.cwd(), "content", "statistics", slug + ".json")
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
      sourceAuditComplete?: boolean
      sections?: Array<{ stats?: Array<{ sourceUrl?: unknown; sourceCheckedAt?: unknown; checkedOn?: unknown }> }>
    }
    const allFigures = (raw.sections ?? []).flatMap((section) =>
      Array.isArray(section.stats) ? section.stats : []
    )
    const isValidSource = (value: unknown): boolean => {
      if (typeof value !== "string") return false
      try {
        const url = new URL(value)
        return url.protocol === "https:" && Boolean(url.hostname)
      } catch {
        return false
      }
    }
    const isValidDate = (value: unknown): boolean =>
      typeof value === "string" && /^\\d{4}-\\d{2}-\\d{2}$/.test(value) &&
      !Number.isNaN(new Date(value + "T00:00:00Z").getTime()) &&
      new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value

    verified = raw.sourceAuditComplete === true &&
      allFigures.length >= 1 &&
      allFigures.every((figure) =>
        isValidSource(figure.sourceUrl) &&
        isValidDate(figure.sourceCheckedAt ?? figure.checkedOn)
      )
  } catch {
    verified = false
  }
  statisticEvidenceCache.set(slug, verified)
  return verified
}

export function isNoindexed(dir: string, slug: string): boolean {
  if (dir === "statistics") return !hasCompleteStatisticEvidence(slug)
  return dir === "comparisons" && EDITORIAL_NOINDEX_COMPARISONS.has(slug)
}

export function getNoindexSlugs(dir: string): string[] {
  // Report the real rendered metadata policy, not the older quality manifest.
  if (dir === "comparisons") return Array.from(EDITORIAL_NOINDEX_COMPARISONS)
  if (dir === "statistics") {
    try {
      return fs.readdirSync(path.join(process.cwd(), "content", "statistics"))
        .filter((filename) => filename.endsWith(".json"))
        .map((filename) => filename.slice(0, -5))
        .filter((slug) => isNoindexed("statistics", slug))
    } catch {
      return []
    }
  }
  return []
}

export function getKeepSlugs(dir: string): string[] {
  const listPath = path.join(process.cwd(), "noindex-list.json")
  try {
    if (fs.existsSync(listPath)) {
      const data = JSON.parse(fs.readFileSync(listPath, "utf-8"))
      return data.directories?.[dir]?.keep || []
    }
  } catch {}
  return []
}
