const CATEGORY_ALIASES: Record<string, string> = {
  "e-commerce": "e-commerce & retail",
  ecommerce: "e-commerce & retail",
  "analytics": "analytics & data",
  "hr & payroll": "hr & people",
  "video communication": "communication",
}

function normalizeCategory(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ")
  return CATEGORY_ALIASES[normalized] ?? normalized
}

/**
 * Match editorial content to a category despite known legacy taxonomy labels.
 * Keep this deliberately conservative: unrelated categories must not be merged.
 */
export function categoryMatches(contentCategory: string | undefined, categoryName: string): boolean {
  if (!contentCategory?.trim()) return false
  return normalizeCategory(contentCategory) === normalizeCategory(categoryName)
}
