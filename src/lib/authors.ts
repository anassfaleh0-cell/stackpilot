export const PUBLIC_AUTHOR_SLUGS = ["pilotstack-team"] as const

export function isPublicAuthor(slug: string): boolean {
  return (PUBLIC_AUTHOR_SLUGS as readonly string[]).includes(slug)
}
