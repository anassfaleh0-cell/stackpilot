/**
 * Comparison routes consolidated by permanent redirects.
 * Keep old URLs useful while preventing duplicate comparison pages from competing in the sitemap.
 */
export const RETIRED_COMPARISON_SLUGS = new Set<string>([
  // Legacy Zoho comparison slugs redirect to these canonical, evidence-based guides.
  // Keep the redirects for old links, but never submit redirecting source URLs in the sitemap.
  "close-crm-vs-zoho-crm",
  "outreach-io-vs-zoho",
  "pipedrive-vs-zoho",
  "salesloft-vs-zoho",
  "zendesk-vs-zoho",
])

export function isRetiredComparisonSlug(slug: string): boolean {
  return RETIRED_COMPARISON_SLUGS.has(slug)
}

type SitemapEntry = { url: string; [key: string]: unknown }

/** Keep sitemap locations canonical and unique. */
export function filterSitemapEntries<T extends SitemapEntry>(entries: T[]): T[] {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    let parsed: URL
    try {
      parsed = new URL(entry.url)
    } catch {
      return false
    }
    if (parsed.search || parsed.hash) return false
    const pathname = parsed.pathname.length > 1 ? parsed.pathname.replace(/\/+$/, "") : parsed.pathname
    const segments = pathname.split("/").filter(Boolean)
    const comparisonSlug = segments.length === 2 && segments[0] === "comparisons" ? segments[1] : undefined
    if (comparisonSlug && isRetiredComparisonSlug(comparisonSlug)) return false
    const canonicalKey = `${parsed.origin}${pathname}`
    if (seen.has(canonicalKey)) return false
    seen.add(canonicalKey)
    return true
  })
}
