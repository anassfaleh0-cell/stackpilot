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

// Indexability is intentionally not driven by the legacy quality manifest.
// Content quality must be improved in place rather than hidden from search.
export function isNoindexed(_dir: string, _slug: string): boolean {
  return false
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
