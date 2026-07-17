import { site } from "@/lib/constants"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    description: site.description,
    sameAs: [site.links.twitter, site.links.github],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-organization" />
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-website" />
}

export function BreadcrumbSchema({ items }: { items: { name: string; href: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-breadcrumb" />
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.svg` },
    },
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: image || `${site.url}/og.svg`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url || site.url },
    inLanguage: "en-US",
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-article" />
}

export function SoftwareSchema({ name, description, applicationCategory, operatingSystem, offers }: {
  name: string
  description: string
  applicationCategory: string
  operatingSystem?: string
  offers?: { price: string; priceCurrency: string }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem: operatingSystem || "Web",
    offers: offers ? { "@type": "Offer", ...offers } : undefined,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-software" />
}

export function ReviewSchema({ name, description, rating, reviewCount, url }: { name: string; description: string; rating: number; reviewCount: number; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: rating,
        bestRating: 5,
      },
      author: {
        "@type": "Organization",
        name: "StackPilot",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      bestRating: 5,
      ratingCount: reviewCount,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-review" />
}

export function DefinedTermSchema({ term, definition }: { term: string; definition: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description: definition,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-defined-term" />
}

export function CollectionPageSchema({ name, description, url }: { name: string; description: string; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-collection-page" />
}

export function FAQSchema({ questions }: { questions: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-faq" />
}

export function ItemListSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-item-list" />
}

export function HowToSchema({ name, description, steps }: { name: string; description: string; steps: { name: string; text: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} key="ld-howto" />
}
