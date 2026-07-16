import { site } from "./constants"

export function createMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  ogType,
  publishedAt,
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  noIndex?: boolean
  ogType?: "website" | "article"
  publishedAt?: string
}) {
  const url = path ? `${site.url}${path}` : site.url
  const image = ogImage || `${site.url}/og.png`
  const isArticle = ogType === "article"

  return {
    title: `${title} | ${site.name}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: isArticle ? "article" : "website",
      ...(isArticle && publishedAt ? { publishedTime: publishedAt } : {}),
      ...(isArticle ? { authors: ["StackPilot Team"] } : {}),
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${title} | ${site.name}`,
      description,
      images: [image],
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
