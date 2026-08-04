import { site } from "@/lib/constants"

const ctx = "https://schema.org"

function ld<T>(schema: T, key: string) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key={key} />
}

function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_, v) => v ?? undefined))
}

export function OrganizationSchema() {
  const schema = clean({
    "@context": ctx,
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject", url: `${site.url}/favicon.svg`, width: 512, height: 512 },
    description: site.description,
    sameAs: [
      site.links.twitter,
      site.links.github,
      site.links.facebook,
      site.links.linkedin,
      site.links.pinterest,
    ],
    foundingDate: "2024-01-01",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 5, maxValue: 15 },
    address: { "@type": "PostalAddress", addressCountry: "US" },
  })
  return ld(schema, "ld-organization")
}

export function WebsiteSchema() {
  const schema = clean({
    "@context": ctx,
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": {
        "@type": "PropertyValueSpecification",
        valueRequired: true,
        valueName: "search_term_string",
      },
    },
  })
  return ld(schema, "ld-website")
}

export function BreadcrumbSchema({ items }: { items: { name: string; href: string }[] }) {
  const schema = clean({
    "@context": ctx,
    "@type": "BreadcrumbList",
    "@id": `${site.url}${items.length > 1 ? items[items.length - 1].href : "/"}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  })
  return ld(schema, "ld-breadcrumb")
}

export function ArticleSchema({
  title, description, publishedAt, updatedAt, author, image, url, wordCount, category, keywords, mentions, mainEntity,
}: {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  image?: string
  url?: string
  wordCount?: number
  category?: string
  keywords?: string[]
  mentions?: { name: string; url: string }[]
  mainEntity?: Record<string, unknown>
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "Article",
    "@id": (url || site.url) + "#article",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: { "@type": "ImageObject", url: image || `${site.url}/og.png` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url || site.url },
    inLanguage: "en-US",
    wordCount: wordCount || undefined,
    articleSection: category || undefined,
    keywords: keywords?.join(", ") || undefined,
    isBasedOn: `${site.url}/methodology`,
    about: { "@id": `${site.url}/#organization` },
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".article-summary", ".article-content", ".quick-answer", ".tl-dr", ".key-takeaways"] },
    ...(mentions && mentions.length > 0 ? { mentions: mentions.map((m) => ({ "@type": "Thing", name: m.name, url: m.url })) } : {}),
    ...(mainEntity ? { mainEntity } : {}),
    citation: [{ "@type": "CreativeWork", name: "Methodology", url: `${site.url}/methodology` }],
  })
  return ld(schema, "ld-article")
}

export function NewsArticleSchema({
  title, description, publishedAt, updatedAt, author, image, url, wordCount, category,
}: {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  image?: string
  url?: string
  wordCount?: number
  category?: string
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "NewsArticle",
    "@id": (url || site.url) + "#newsarticle",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: { "@type": "ImageObject", url: image || `${site.url}/og.png` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url || site.url },
    inLanguage: "en-US",
    wordCount: wordCount || undefined,
    articleSection: category || undefined,
    isBasedOn: `${site.url}/methodology`,
    about: { "@id": `${site.url}/#organization` },
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".article-summary", ".article-content"] },
  })
  return ld(schema, "ld-newsarticle")
}

export function BlogPostingSchema({
  title, description, publishedAt, updatedAt, author, image, url,
}: {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  image?: string
  url?: string
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "BlogPosting",
    "@id": (url || site.url) + "#blogposting",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: { "@type": "ImageObject", url: image || `${site.url}/og.svg` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url || site.url },
    inLanguage: "en-US",
    wordCount: description.split(" ").length,
  })
  return ld(schema, "ld-blogposting")
}

const VALID_APP_CATEGORIES = new Set([
  "BusinessApplication", "GameApplication", "SocialNetworkingApplication", "TravelApplication",
  "ShoppingApplication", "SportsApplication", "LifestyleApplication", "DesignApplication",
  "DeveloperApplication", "DriverApplication", "EducationalApplication", "HealthApplication",
  "FinanceApplication", "SecurityApplication", "BrowserApplication", "CommunicationApplication",
  "DesktopApplication", "EntertainmentApplication", "HomeApplication", "MultimediaApplication",
  "MobileApplication", "ReferenceApplication", "ScienceApplication", "UtilitiesApplication",
  "VideoApplication", "WebApplication", "ProjectManagementApplication",
])

// Keyword map (normalized, most specific first) from site/product category
// names to Schema.org SoftwareApplication applicationCategory values.
// Anything not matched falls back to BusinessApplication.
const APP_CATEGORY_KEYWORDS: [string[], string][] = [
  [["project management", "projectmanager", "project manager"], "ProjectManagementApplication"],
  [["video communication", "video conferencing", "video meeting", "webinar"], "CommunicationApplication"],
  [["design creative", "web design", "graphic design", "design", "creative", "prototyping", "ui ux"], "DesignApplication"],
  [["developer tools", "developer", "devops", "dev tool", "software development", "ci cd", "cloud computing", "api"], "DeveloperApplication"],
  [["security compliance", "security", "cybersecurity", "compliance", "endpoint", "vulnerability", "identity"], "SecurityApplication"],
  [["communication", "messaging", "chat", "phone", "ucaa"], "CommunicationApplication"],
  [["finance accounting", "finance", "accounting", "bookkeeping", "banking", "payroll", "expense", "invoicing"], "FinanceApplication"],
  [["health", "medical", "healthcare"], "HealthApplication"],
  [["education", "e learning", "learning management", "lms", "course", "school"], "EducationalApplication"],
  [["game", "gaming"], "GameApplication"],
  [["travel", "booking"], "TravelApplication"],
  [["shopping", "ecommerce", "e commerce", "retail", "store"], "ShoppingApplication"],
  [["sports", "fitness"], "SportsApplication"],
  [["lifestyle"], "LifestyleApplication"],
  [["social networking", "social network", "social media"], "SocialNetworkingApplication"],
  [["video", "video editing"], "VideoApplication"],
  [["multimedia", "photo", "audio", "image editing"], "MultimediaApplication"],
  [["entertainment", "streaming", "music"], "EntertainmentApplication"],
  [["home"], "HomeApplication"],
  [["browser", "browsing"], "BrowserApplication"],
  [["reference"], "ReferenceApplication"],
  [["science"], "ScienceApplication"],
  [["utilities", "utility"], "UtilitiesApplication"],
  [["driver"], "DriverApplication"],
  [["desktop"], "DesktopApplication"],
  [["mobile app", "mobile"], "MobileApplication"],
  [["web application", "web"], "WebApplication"],
]

// Maps a site/product category name to a valid Schema.org applicationCategory.
// Accepts an already-valid Schema.org value as-is; keyword-matches otherwise;
// defaults to BusinessApplication when no mapping exists.
function mapAppCategory(cat?: string): string {
  const raw = (cat || "").trim()
  const bare = raw.replace(/^https:\/\/schema\.org\//, "")
  if (VALID_APP_CATEGORIES.has(bare)) return `https://schema.org/${bare}`
  const haystack = " " + raw.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() + " "
  for (const [keywords, mapped] of APP_CATEGORY_KEYWORDS) {
    for (const kw of keywords) {
      if (haystack.includes(` ${kw} `)) return `https://schema.org/${mapped}`
    }
  }
  return "https://schema.org/BusinessApplication"
}

// Resolves operatingSystem for a software product. Uses an explicitly
// provided value when present; otherwise derives from platform/deployment
// data — "Web" is the default unless the product is desktop-only or
// mobile-only.
function resolveOperatingSystem(operatingSystem?: string, platforms?: string[]): string {
  const explicit = (operatingSystem || "").trim()
  if (explicit) return explicit
  const joined = (platforms || []).join(" ").toLowerCase()
  if (joined === "") return "Web"
  const hasWeb = /(^|[\s,|/])web($|[\s,|/])/.test(joined) || /cloud|saas|browser|hosted|online/.test(joined)
  const hasDesktop = /windows|macos|mac os|linux|desktop/.test(joined)
  const hasMobile = /ios|android|iphone|ipad|mobile/.test(joined)
  if (hasWeb) return "Web"
  if (hasMobile && !hasDesktop) return "iOS, Android"
  if (hasDesktop && !hasMobile) return "Windows, macOS, Linux"
  return "Web"
}

function validPrice(p: unknown): number | null {
  if (typeof p === "number") return Number.isFinite(p) && p >= 0 ? p : null
  if (typeof p !== "string") return null
  const s = p.trim()
  if (s === "") return null
  const stripped = s.replace(/[^0-9.+-]/g, "")
  if (stripped === "") return null
  const n = Number(stripped)
  return Number.isFinite(n) && n >= 0 ? n : null
}

function validCurrency(c?: string): string | undefined {
  const cur = (c || "").trim().toUpperCase()
  return /^[A-Z]{3}$/.test(cur) ? cur : undefined
}

function offerNode(offers?: { price: number | string; priceCurrency: string; url?: string }): Record<string, unknown> | undefined {
  const price = validPrice(offers?.price)
  const currency = validCurrency(offers?.priceCurrency)
  if (price === null || !currency) return undefined
  return {
    "@type": "Offer",
    price,
    priceCurrency: currency,
    ...(offers?.url ? { url: offers.url } : {}),
  }
}

function aggregateRatingNode(ratingValue?: number, reviewCount?: number): Record<string, unknown> | undefined {
  if (typeof ratingValue !== "number" || typeof reviewCount !== "number" || !Number.isFinite(ratingValue) || !Number.isFinite(reviewCount)) return undefined
  if (ratingValue <= 0 || ratingValue > 5 || reviewCount <= 0) return undefined
  return { "@type": "AggregateRating", ratingValue, bestRating: 5, worstRating: 1, ratingCount: reviewCount }
}

export function softwareApp({ name, url, description, category, platforms, applicationCategory, operatingSystem, image, rating, reviewCount, offers }: {
  name: string
  url: string
  description?: string
  category?: string
  platforms?: string[]
  applicationCategory?: string
  operatingSystem?: string
  image?: string
  rating?: number
  reviewCount?: number
  offers?: { price: number | string; priceCurrency: string; url?: string }
}): { "@type": string; name: string; url: string; [key: string]: unknown } {
  const node: Record<string, unknown> = {
    "@type": "SoftwareApplication",
    name,
    url,
    applicationCategory: mapAppCategory(applicationCategory || category),
    operatingSystem: resolveOperatingSystem(operatingSystem, platforms),
  }
  if (description) node.description = description
  if (image) node.image = { "@type": "ImageObject", url: image }
  const ar = aggregateRatingNode(rating, reviewCount)
  if (ar) node.aggregateRating = ar
  const offer = offerNode(offers)
  if (offer) node.offers = offer
  return node as { "@type": string; name: string; url: string; [key: string]: unknown }
}

export function SoftwareSchema({ name, description, category, platforms, applicationCategory, operatingSystem, offers, brand, keywords, url, image, aggregateRating }: {
  name: string
  description?: string
  category?: string
  platforms?: string[]
  applicationCategory?: string
  operatingSystem?: string
  offers?: { price: number | string; priceCurrency: string; url?: string }
  brand?: string
  keywords?: string[]
  url?: string
  image?: string
  aggregateRating?: { ratingValue: number; reviewCount: number }
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
    name,
    ...(description ? { description } : {}),
    ...(url ? { url } : {}),
    applicationCategory: mapAppCategory(applicationCategory || category),
    operatingSystem: resolveOperatingSystem(operatingSystem, platforms),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(offerNode(offers) ? { offers: offerNode(offers) } : {}),
    ...(aggregateRatingNode(aggregateRating?.ratingValue, aggregateRating?.reviewCount) ? { aggregateRating: aggregateRatingNode(aggregateRating?.ratingValue, aggregateRating?.reviewCount) } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    ...(image ? { image: { "@type": "ImageObject", url: image } } : {}),
  })
  return ld(schema, "ld-software")
}

export function ProductSchema({ name, description, image, brand, aggregateRating }: {
  name: string
  description: string
  image?: string
  brand?: string
  aggregateRating?: { ratingValue: number; reviewCount: number }
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "Product",
    "@id": `${site.url}/#product-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description,
    ...(image ? { image: { "@type": "ImageObject", url: image } } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(aggregateRating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        bestRating: 5,
        worstRating: 1,
        ratingCount: aggregateRating.reviewCount,
      },
    } : {}),
  })
  return ld(schema, "ld-product")
}

export function ReviewSchema({ name, description, rating, reviewCount, url, datePublished, body, companyInfo }: {
  name: string
  description: string
  rating: number
  reviewCount: number
  url: string
  datePublished?: string
  body?: string
  companyInfo?: { founded?: number; headquarters?: string; employees?: string }
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "Product",
    "@id": url + "#product",
    name,
    description,
    url,
    brand: { "@type": "Brand", name },
    ...(companyInfo?.founded ? { brand: { "@type": "Brand", name, foundingDate: `${companyInfo.founded}-01-01` } } : {}),
    ...(companyInfo?.headquarters ? { countryOfOrigin: companyInfo.headquarters } : {}),
    review: {
      "@type": "Review",
      "@id": url + "#review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: { "@type": "Organization", "@id": `${site.url}/#organization` },
      datePublished: datePublished || undefined,
      reviewBody: body || undefined,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      "@id": url + "#rating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: reviewCount,
    },
  })
  return ld(schema, "ld-review")
}

export function DefinedTermSchema({ term, definition }: { term: string; definition: string }) {
  const schema = clean({
    "@context": ctx,
    "@type": "DefinedTerm",
    "@id": `${site.url}/#term-${term.toLowerCase().replace(/\s+/g, "-")}`,
    name: term,
    description: definition,
    inDefinedTermSet: `${site.url}/glossary`,
  })
  return ld(schema, "ld-defined-term")
}

export function CollectionPageSchema({ name, description, url }: { name: string; description: string; url: string }) {
  const schema = clean({
    "@context": ctx,
    "@type": "CollectionPage",
    "@id": url + "#collection",
    name,
    description,
    url,
    mainEntity: { "@id": url + "#item-list" },
  })
  return ld(schema, "ld-collection-page")
}

export function FAQSchema({ questions, path }: { questions: { question: string; answer: string }[]; path?: string }) {
  const schema = clean({
    "@context": ctx,
    "@type": "FAQPage",
    "@id": (path ? `${site.url}${path}` : `${site.url}/`) + "#faq",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer.replace(/<[^>]*>/g, "") },
    })),
  })
  return ld(schema, "ld-faq")
}

export function ItemListSchema({ items, url }: { items: { name: string; url: string }[]; url?: string }) {
  const schema = clean({
    "@context": ctx,
    "@type": "ItemList",
    "@id": (url || site.url) + "#item-list",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  })
  return ld(schema, "ld-item-list")
}

export function HowToSchema({ name, description, steps }: { name: string; description: string; steps: { name: string; text: string }[] }) {
  const schema = clean({
    "@context": ctx,
    "@type": "HowTo",
    "@id": `${site.url}/#howto`,
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  })
  return ld(schema, "ld-howto")
}

export function PersonSchema({ name, url, description, knowsAbout }: {
  name: string
  url: string
  description?: string
  knowsAbout?: string[]
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "Person",
    "@id": url + "#person",
    name,
    url,
    description: description || undefined,
    knowsAbout: knowsAbout?.map((k) => ({ "@type": "Thing", name: k })) || undefined,
  })
  return ld(schema, "ld-person")
}

export function WebPageSchema({ name, description, url, dateModified, mainEntity, keywords }: {
  name: string
  description: string
  url: string
  dateModified?: string
  mainEntity?: Record<string, unknown>
  keywords?: string[]
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "WebPage",
    "@id": url + "#webpage",
    name,
    description,
    url,
    dateModified: dateModified || undefined,
    inLanguage: "en-US",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    keywords: keywords?.join(", ") || undefined,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer", ".tl-dr", ".key-takeaways"] },
    ...(mainEntity ? { mainEntity } : {}),
  })
  return ld(schema, "ld-webpage")
}

export function DatasetSchema({ name, description, url, datePublished, dateModified, keywords, variablesMeasured }: {
  name: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  keywords?: string[]
  variablesMeasured?: string[]
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "Dataset",
    "@id": url + "#dataset",
    name,
    description,
    url,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    keywords: keywords?.join(", ") || undefined,
    ...(variablesMeasured && variablesMeasured.length > 0 ? { variableMeasured: variablesMeasured.map(v => ({ "@type": "PropertyValue", name: v })) } : {}),
    publisher: { "@type": "Organization", "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    mainEntityOfPage: { "@type": "WebPage", "@id": url + "#webpage" },
  })
  return ld(schema, "ld-dataset")
}

export function AboutPageSchema({ name, description, url, about }: {
  name: string
  description: string
  url: string
  about: { "@type": string; name: string; url: string; [key: string]: unknown }[]
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "AboutPage",
    "@id": url + "#about-page",
    name,
    description,
    url,
    mainEntity: { "@type": "ItemList", itemListElement: about.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: { ...a } })) },
    about: about.map((a) => ({ ...a })),
  })
  return ld(schema, "ld-about-page")
}
