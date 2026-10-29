import type { ComparisonContent } from "@/types/content"

type CategoryLookup = (slug: string) => string | undefined

/**
 * Recommend only editorially cross-linked head-to-head alternatives that share
 * a product with the current page. Two products in a broad catalog category
 * alone are not evidence that the buyer could substitute one for the other.
 *
 * Keep all source records available; this filters only contextual links.
 */
export function getRelevantComparisonSlugs(
  current: ComparisonContent,
  candidates: ComparisonContent[],
  categoryFor: CategoryLookup,
  limit = 6,
  editorialSlugs: string[] = [],
): string[] {
  const curated = new Set([...(current.relatedComparisons || []), ...editorialSlugs])
  const output = candidates
    .filter((candidate) => {
      if (!curated.has(candidate.slug)) return false
      if (candidate.slug === current.slug) return false
      if ((candidate as ComparisonContent & { publicationStatus?: string }).publicationStatus === "draft") return false
      if (candidate.tool1Slug === current.tool1Slug && candidate.tool2Slug === current.tool2Slug) return false
      if (candidate.tool1Slug === current.tool2Slug && candidate.tool2Slug === current.tool1Slug) return false

      const sharesTool = [candidate.tool1Slug, candidate.tool2Slug].some(
        (slug) => slug === current.tool1Slug || slug === current.tool2Slug,
      )
      if (!sharesTool) return false

      const firstCategory = categoryFor(candidate.tool1Slug)
      const secondCategory = categoryFor(candidate.tool2Slug)
      // Avoid adding nonsensical comparisons merely because they share a name.
      return Boolean(firstCategory && secondCategory && firstCategory === secondCategory)
    })
    .map((candidate) => ({
      slug: candidate.slug,
      relevance: (curated.has(candidate.slug) ? 100 : 0) +
        (candidate.category === current.category ? 20 : 0) +
        (candidate.tool1Slug === current.tool1Slug || candidate.tool2Slug === current.tool1Slug ? 4 : 0) +
        (candidate.tool1Slug === current.tool2Slug || candidate.tool2Slug === current.tool2Slug ? 4 : 0),
    }))
    .sort((a, b) => b.relevance - a.relevance || a.slug.localeCompare(b.slug))
    .slice(0, Math.max(0, limit))
  return output.map((candidate) => candidate.slug)
}
