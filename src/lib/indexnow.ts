import { site } from "./constants"
import sitemap from "@/app/sitemap"

const INDEXNOW_KEY = "a1b2c3d4e5f67890abcdef1234567890"
const INDEXNOW_URL = "https://api.indexnow.org/indexnow"

let indexablePaths: Set<string> | null = null

function sitemapPaths(): Set<string> {
  if (!indexablePaths) {
    indexablePaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))
  }
  return indexablePaths
}

/**
 * True only for a URL on the canonical origin that the sitemap declares indexable.
 * Third-party hosts, the non-www mirror, unpublished or noindexed content and unknown
 * paths must never leave this site through an engine submission surface.
 */
export function isIndexableUrl(raw: string): boolean {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }
  if (url.origin !== site.url) return false
  if (url.search !== "" || url.hash !== "") return false
  const path = url.pathname.replace(/\/$/, "") || "/"
  return sitemapPaths().has(path)
}

export function indexNowUrl(url: string): string {
  const params = new URLSearchParams({
    url,
    key: INDEXNOW_KEY,
  })
  return `${INDEXNOW_URL}?${params.toString()}`
}

export async function submitUrl(url: string): Promise<boolean> {
  if (!isIndexableUrl(url)) return false
  try {
    const res = await fetch(indexNowUrl(url), { method: "GET" })
    return res.ok
  } catch {
    return false
  }
}

export async function submitBatch(urls: string[]): Promise<boolean> {
  const allowed = urls.filter(isIndexableUrl)
  if (allowed.length === 0) return false
  try {
    const res = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(site.url).host,
        key: INDEXNOW_KEY,
        keyLocation: `${site.url}/${INDEXNOW_KEY}.txt`,
        urlList: allowed,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function getContentUrls(type: string, slug: string): string[] {
  const base = site.url
  switch (type) {
    case "review": return [`${base}/reviews/${slug}`]
    case "comparison": return [`${base}/comparisons/${slug}`]
    case "guide": return [`${base}/guides/${slug}`]
    case "blog": return [`${base}/blog/${slug}`]
    case "glossary": return [`${base}/glossary/${slug}`]
    case "alternative": return [`${base}/alternatives/${slug}`]
    case "use-case": return [`${base}/use-cases/${slug}`]
    case "industry": return [`${base}/industries/${slug}`]
    case "research": return [`${base}/research/${slug}`]
    case "statistic": return [`${base}/statistics/${slug}`]
    case "best": return [`${base}/best/${slug}`]
    case "hub": return [`${base}/hubs/${slug}`]
    default: return []
  }
}
