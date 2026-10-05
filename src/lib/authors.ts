export const PUBLIC_AUTHOR_SLUGS = ["sarah-chen", "marcus-rivera", "emily-nakamura"] as const

export function isPublicAuthor(slug: string): boolean {
  return (PUBLIC_AUTHOR_SLUGS as readonly string[]).includes(slug)
}
