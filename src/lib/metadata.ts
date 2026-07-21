import { site } from "./constants"

function truncateAtWordBoundary(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  const truncated = text.slice(0, maxLen)
  const lastSpace = truncated.lastIndexOf(" ")
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…"
}

export function createMetadata({
  title,
  description,
  path,
  ogImage,
  ogImageAlt,
  noIndex = false,
  ogType,
  publishedAt,
  updatedAt,
  articleTags,
  articleSection,
  readingTime,
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogImageAlt?: string
  noIndex?: boolean
  ogType?: "website" | "article"
  publishedAt?: string
  updatedAt?: string
  articleTags?: string[]
  articleSection?: string
  readingTime?: number
}) {
  const url = path ? `${site.url}${path}` : site.url
  const imageUrl = ogImage || `${site.url}/og.svg`
  const isArticle = ogType === "article"

  const fullTitle = truncateAtWordBoundary(title, 60)
  const fullDescription = truncateAtWordBoundary(description, 160)

  return {
    title: fullTitle,
    description: fullDescription,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: site.name,
      locale: site.locale,
      type: isArticle ? "article" : "website",
      ...(isArticle && publishedAt ? { publishedTime: publishedAt } : {}),
      ...(isArticle && updatedAt ? { modifiedTime: updatedAt } : {}),
      ...(isArticle && articleSection ? { section: articleSection } : {}),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: ogImageAlt || `${title} | ${site.name}` }],
    },
    twitter: {
      card: "summary_large_image" as const,
      site: "@pilotstack",
      creator: "@pilotstack",
      title: fullTitle,
      description: fullDescription,
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
    other: {
      ...(readingTime ? { "twitter:label1": "Reading time", "twitter:data1": `${readingTime} min` } : {}),
      "twitter:label2": "Category",
      "twitter:data2": articleSection || "Software Reviews",
      ...(isArticle && articleTags && articleTags.length > 0
        ? Object.fromEntries(articleTags.map((tag, i) => [i === 0 ? "article:tag" : `article:tag:${i}`, tag]))
        : {}),
    },
  }
}
