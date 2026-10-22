/**
 * Parse a content-supplied modification date for XML sitemap output.
 * Return undefined when no trustworthy date is available rather than
 * inventing a deployment-time lastmod value.
 */
export function getSitemapLastModified(value: unknown): Date | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined
  }

  // JavaScript normalizes impossible calendar dates such as 2026-02-31.
  // Validate the ISO calendar portion before parsing so bad content cannot
  // produce a misleading sitemap <lastmod> value.
  const isoDatePrefix = value.match(/^(\d{4}-\d{2}-\d{2})(?:$|[Tt\s])/)
  if (isoDatePrefix) {
    const calendarDate = new Date(`${isoDatePrefix[1]}T00:00:00.000Z`)
    if (
      Number.isNaN(calendarDate.getTime()) ||
      calendarDate.toISOString().slice(0, 10) !== isoDatePrefix[1]
    ) {
      return undefined
    }
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}
