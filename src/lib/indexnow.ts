import { site } from "./constants"

const INDEXNOW_KEY = "a1b2c3d4e5f67890abcdef1234567890"
const INDEXNOW_URL = "https://api.indexnow.org/indexnow"

export function indexNowUrl(url: string): string {
  const params = new URLSearchParams({
    url,
    key: INDEXNOW_KEY,
  })
  return `${INDEXNOW_URL}?${params.toString()}`
}

export async function submitUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(indexNowUrl(url), { method: "GET" })
    return res.ok
  } catch {
    return false
  }
}

export async function submitBatch(urls: string[]): Promise<boolean> {
  try {
    const res = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(site.url).host,
        key: INDEXNOW_KEY,
        keyLocation: `${site.url}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
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
