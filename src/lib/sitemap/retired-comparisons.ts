/**
 * Legacy comparison slugs that intentionally redirect to primary review pages.
 * Keep this list centralized so sitemap generation and its regression tests use
 * the same source of truth.
 */
export const RETIRED_COMPARISON_SLUGS = new Set([
  "affinity-vs-wix",
  "dialpad-vs-loom",
  "adp-vs-airtable",
  "clickup-vs-gusto",
  "ahrefs-vs-claude",
  "copy-ai-vs-heap",
  "cal-com-vs-discord",
  "auth0-vs-bitbucket",
  "bitwarden-vs-circleci",
  "bitwarden-vs-google-analytics",
  "canva-vs-cloudflare-pages",
  "cloudflare-pages-vs-crowdstrike",
  "cloudflare-pages-vs-copy-ai",
  "freshbooks-vs-greenhouse",
  "appwrite-vs-chatgpt",
  "bitbucket-vs-claude",
  "circleci-vs-copilot",
  "crowdstrike-vs-heap",
  "expensify-vs-fullstory",
  "freshbooks-vs-google-analytics",
  "freshdesk-vs-google-meet",
  "copper-crm-vs-discord",
  "gusto-vs-paddle",
  "convertkit-vs-copilot",
  "activecampaign-vs-chatgpt",
  "activecampaign-vs-fathom",
  "adobe-xd-vs-ahrefs",
  "ahrefs-vs-copper-crm",
  "ahrefs-vs-fullstory",
  "bigcommerce-vs-fathom",
  "chatgpt-vs-fathom",
  "copilot-vs-google-analytics",
  "convertkit-vs-google-analytics",
  "freshsales-vs-microsoft-teams",
  "heap-vs-paddle",
  "convertkit-vs-freshdesk",
  "canva-vs-mailchimp",
  "acuity-vs-airtable",
  "asana-vs-cal-com",
  "basecamp-vs-calendly",
  "calendly-vs-google-meet",
  "copy-ai-vs-mailchimp",
  "evernote-vs-microsoft-teams",
  "heap-vs-mailchimp",
  "claude-vs-fullstory",
])

export function isRetiredComparisonSlug(slug: string): boolean {
  return RETIRED_COMPARISON_SLUGS.has(slug)
}

type SitemapEntry = { url: string; [key: string]: unknown }

/** Drop retired comparison URLs and duplicate URLs from generated sitemap entries. */
export function filterSitemapEntries<T extends SitemapEntry>(entries: T[]): T[] {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    let parsed: URL
    try {
      parsed = new URL(entry.url)
    } catch {
      return false
    }

    // Sitemap locations should be canonical page URLs, not query/fragment variants.
    if (parsed.search || parsed.hash) return false

    const pathname = parsed.pathname.length > 1 ? parsed.pathname.replace(/\/+$/, "") : parsed.pathname
    const segments = pathname.split("/").filter(Boolean)
    const comparisonSlug = segments.length === 2 && segments[0] === "comparisons" ? segments[1] : undefined
    if (comparisonSlug && isRetiredComparisonSlug(comparisonSlug)) return false

    // Treat trailing-slash variants as the same canonical location.
    const canonicalKey = `${parsed.origin}${pathname}`
    if (seen.has(canonicalKey)) return false
    seen.add(canonicalKey)
    return true
  })
}
