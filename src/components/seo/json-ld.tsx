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
    sameAs: [site.links.twitter, site.links.github, site.links.reddit],
    foundingDate: "2024",
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
    "@type": "Article",
    "@id": (url || site.url) + "#article",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${site.url}/#organization` },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: { "@type": "ImageObject", url: image || `${site.url}/og.svg` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url || site.url },
    inLanguage: "en-US",
  })
  return ld(schema, "ld-article")
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

export function SoftwareSchema({ name, description, applicationCategory, operatingSystem, offers, brand }: {
  name: string
  description: string
  applicationCategory: string
  operatingSystem?: string
  offers?: { price: string; priceCurrency: string; url?: string }
  brand?: string
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description,
    applicationCategory: `https://schema.org/${applicationCategory}`,
    operatingSystem: operatingSystem || undefined,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    offers: offers ? { "@type": "Offer", ...offers } : undefined,
  })
  return ld(schema, "ld-software")
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
    ...(companyInfo?.founded ? { productionDate: companyInfo.founded.toString() } : {}),
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

export function FAQSchema({ questions }: { questions: { question: string; answer: string }[] }) {
  const schema = clean({
    "@context": ctx,
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
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

export function WebPageSchema({ name, description, url, dateModified, mainEntity }: {
  name: string
  description: string
  url: string
  dateModified?: string
  mainEntity?: Record<string, unknown>
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
    ...(mainEntity ? { mainEntity } : {}),
  })
  return ld(schema, "ld-webpage")
}

export function AboutPageSchema({ name, description, url, about }: {
  name: string
  description: string
  url: string
  about: { "@type": string; name: string; url: string }[]
}) {
  const schema = clean({
    "@context": ctx,
    "@type": "WebPage",
    "@id": url + "#about-page",
    name,
    description,
    url,
    mainEntity: { "@type": "ItemList", itemListElement: about.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": a["@type"], name: a.name, url: a.url } })) },
    about: about.map((a) => ({ "@type": a["@type"], name: a.name, url: a.url })),
  })
  return ld(schema, "ld-about-page")
}
