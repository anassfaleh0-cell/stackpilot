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
])

export function isNoindexed(dir: string, slug: string): boolean {
  return dir === "comparisons" && EDITORIAL_NOINDEX_COMPARISONS.has(slug)
}

export function getNoindexSlugs(dir: string): string[] {
  return Array.from(loadNoindexList(dir))
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
