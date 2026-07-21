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

  const fullTitle = title
  const now = new Date().toISOString()

  return {
    title: fullTitle,
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
      ...(isArticle && updatedAt ? { modifiedTime: updatedAt } : {}),
      ...(isArticle && articleSection ? { section: articleSection } : {}),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: ogImageAlt || `${title} | ${site.name}` }],
    },
    twitter: {
      card: "summary_large_image" as const,
      site: "@pilotstack",
      creator: "@pilotstack",
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
    other: {
      ...(readingTime ? { "twitter:label1": "Reading time", "twitter:data1": `${readingTime} min` } : {}),
      "twitter:label2": "Category",
      "twitter:data2": articleSection || "Software Reviews",
    },
  }
}
