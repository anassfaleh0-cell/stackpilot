const ACRONYM_LABELS: Record<string, string> = {
  ai: "AI",
  api: "API",
  b2b: "B2B",
  crm: "CRM",
  gdpr: "GDPR",
  hr: "HR",
  roi: "ROI",
  saas: "SaaS",
  seo: "SEO",
  sql: "SQL",
  url: "URL",
}

const LOWERCASE_CONNECTORS = new Set(["and", "for", "in", "of", "to", "vs", "with"])

/** Build readable fallback text for legacy/internal anchors with empty labels. */
export function getReadableLinkFallbackLabel(href: string): string {
  const pathname = href.split(/[?#]/, 1)[0] || ""
  const slug = pathname.split("/").filter(Boolean).pop() || ""
  const words = slug.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean)
  if (words.length === 0) return "Related content"
  return words.map((word, index) => {
    const lower = word.toLowerCase()
    if (ACRONYM_LABELS[lower]) return ACRONYM_LABELS[lower]
    if (index > 0 && LOWERCASE_CONNECTORS.has(lower)) return lower
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }).join(" ")
}
