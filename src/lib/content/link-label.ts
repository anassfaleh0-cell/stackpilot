/** Build readable fallback text for legacy/internal anchors with empty labels. */
export function getReadableLinkFallbackLabel(href: string): string {
  const pathname = href.split(/[?#]/, 1)[0] || ""
  const slug = pathname.split("/").filter(Boolean).pop() || ""
  const words = slug.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
  if (!words) return "Related content"
  return words.charAt(0).toUpperCase() + words.slice(1)
}
