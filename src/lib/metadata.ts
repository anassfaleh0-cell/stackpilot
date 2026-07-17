import { site } from "./constants"

export function createMetadata({
  title,
  description,
  path,
  ogImage,
  ogImageAlt,
  noIndex = false,
  ogType,
  publishedAt,
  articleTags,
  articleSection,
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogImageAlt?: string
  noIndex?: boolean
  ogType?: "website" | "article"
  publishedAt?: string
  articleTags?: string[]
  articleSection?: string
}) {
  const url = path ? `${site.url}${path}` : site.url
  const imageUrl = ogImage || `${site.url}/og.svg`
  const isArticle = ogType === "article"

  const fullTitle = `${title} | ${site.name}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: isArticle ? "article" : "website",
      ...(isArticle && publishedAt ? { publishedTime: publishedAt } : {}),
      ...(isArticle ? { authors: ["StackPilot Team"] } : {}),
      ...(isArticle && articleTags ? { tags: articleTags } : {}),
      ...(isArticle && articleSection ? { section: articleSection } : {}),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: ogImageAlt || `${title} | ${site.name}` }],
    },
    twitter: {
      card: "summary_large_image" as const,
      site: "@stackpilot",
      creator: "@stackpilot",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}
