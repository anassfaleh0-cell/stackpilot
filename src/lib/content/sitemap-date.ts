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

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}
