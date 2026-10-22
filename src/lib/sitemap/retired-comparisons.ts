/**
 * Comparison routes remain public while their content is improved.
 * Keep the set available for future intentional retirements, but do not suppress
 * indexable comparison guides merely because they cross product categories.
 */
// The reverse-order QuickBooks vs Xero URL duplicates the canonical Xero vs QuickBooks guide.
 // Preserve the old URL with a permanent redirect while keeping only one comparison in the sitemap.
 export const RETIRED_COMPARISON_SLUGS = new Set<string>(["quickbooks-vs-xero"])

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
