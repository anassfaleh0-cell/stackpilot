import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, FAQSchema, ItemListSchema, WebPageSchema, CollectionPageSchema, softwareApp } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { truncate, formatDate } from "@/lib/utils"
import { getBest, getAllBest, getContentTitle, getReview } from "@/lib/content/registry"
import { getRelatedByCategory } from "@/lib/content/internal-links"
import { InternalLinks, LEGACY_RELATED_TYPES, extendedRelatedItems } from "@/components/content/internal-links"
import { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"
import { notFound, permanentRedirect } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"
import { EditorialArticleBody } from "@/components/content/editorial-article-body"
import { isNoindexed } from "@/lib/noindex"
import { REDIRECTED_BEST_SLUGS } from "@/lib/sitemap/redirected-content"

const VETTED_LONG_FORM_BEST_SLUGS = new Set([
  "best-marketing-seo-enterprise",
  "best-prototyping-tools",
  "best-remote-work-tools",
  "best-crm-sales-small-business",
  "best-enterprise-analytics",
])

function stripUnverifiedPriceClaims(value: string): string {
  return value
    .replace(/(?:starting at|starts at|from)?\s*[$€£]\s?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:user|seat|month|year|mo|yr))?/gi, "pricing not independently verified")
    .replace(/\b(?:free|freemium|paid|enterprise)\s+(?:plan|tier)\b/gi, "plan availability not independently verified")
    .replace(/\bfree trial\b/gi, "trial availability not independently verified")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim()
}

function stripUnverifiedRatingClaims(value: string): string {
  return value
    .replace(/\(\s*\d(?:\.\d+)?\s*\/\s*5\s*,\s*from\s+[^)]*\)/gi, "")
    .replace(/\(\s*\d(?:\.\d+)?\s*\/\s*5\s*\)/gi, "")
    .replace(/\b(?:recorded\s+)?rating(?:\s+of)?\s*[:\-]?\s*\d(?:\.\d+)?\s*\/\s*5\b/gi, "rating not independently verified")
    .replace(/\b\d(?:\.\d+)?\s*\/\s*5\b/gi, "rating not independently verified")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim()
}

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  // Pre-render the complete published route inventory; Cloudflare Workers must
  // never fall back to filesystem-backed on-demand route rendering.

  // Content is read from committed JSON files; prerender the corpus for Workers compatibility.
  return getAllBest()
    .filter((item) => (item as typeof item & { publicationStatus?: string }).publicationStatus !== "draft" && !REDIRECTED_BEST_SLUGS.has(item.slug))
    .map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getBest(slug)
  if (!page) return {}
  const readingTime = Math.max(5, Math.ceil((page.description.split(/\s+/).length + page.picks.reduce((a, p) => a + p.pros.length + p.cons.length, 0) * 20) / 200))
  const safeDescription = stripUnverifiedPriceClaims(stripUnverifiedRatingClaims(page.description))
  const hasUnverifiedPickData = page.picks.some((pick) => pick.ratingVerified !== true || pick.priceRangeVerified !== true)
  // Do not turn unverified ratings/prices into a search-result ranking claim.
  // Keep the snippet useful without naming a "leader" when the underlying data is not verified.
  const metaDescription = VETTED_LONG_FORM_BEST_SLUGS.has(slug)
    ? safeDescription
    : hasUnverifiedPickData
      ? `${page.title}. Compare the listed options against your workflow, feature requirements, integrations, and budget. Verify current features and plan terms directly with each vendor before choosing.`
      : safeDescription.length < 120
      ? `${safeDescription} Compare the listed options using the recorded details and criteria below. Verify current features and plan terms with each vendor.`
      : safeDescription
  const noindexed = isNoindexed("best", slug)
  return createMetadata({ title: truncate(page.title, 60), description: truncate(metaDescription, 160), path: `/best/${page.slug}`, ogType: "article", publishedAt: page.lastUpdated, updatedAt: page.lastUpdated, articleSection: page.category, readingTime, noIndex: noindexed })
}

export default async function BestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getBest(slug)
  if (!page) {
    const legacyRedirects: Record<string, string> = {
      "best-crm-sales-small-business": "/best/best-crm-for-small-business",
      "best-enterprise-analytics": "/best/best-analytics-software",
      "best-project-management-small-business": "/best/best-project-management-software",
    }
    const redirectTarget = legacyRedirects[slug]
    if (redirectTarget) permanentRedirect(redirectTarget)
    notFound()
  }

  const linkedPicks = page.picks.filter((p) => getReview(p.toolSlug) !== null)
  const verifiedPickRating = (pick: (typeof page.picks)[number] | undefined): number | null => {
    if (pick?.ratingVerified === true && typeof pick.rating === "number" && Number.isFinite(pick.rating)) return pick.rating
    if (!pick?.toolSlug) return null
    const review = getReview(pick.toolSlug)
    return review?.ratingVerified === true && typeof review.rating === "number" && Number.isFinite(review.rating)
      ? review.rating
      : null
  }
  const storedPickRating = (pick: (typeof page.picks)[number] | undefined): number | null => {
    if (typeof pick?.rating === "number" && Number.isFinite(pick.rating) && pick.rating > 0) return pick.rating
    if (!pick?.toolSlug) return null
    const review = getReview(pick.toolSlug)
    return typeof review?.rating === "number" && Number.isFinite(review.rating) && review.rating > 0 ? review.rating : null
  }
  const verifiedPickPrice = (pick: (typeof page.picks)[number] | undefined): string | null =>
    pick?.priceRangeVerified === true && typeof pick.priceRange === "string" && pick.priceRange.trim()
      ? pick.priceRange
      : null
  const safeDescription = stripUnverifiedPriceClaims(stripUnverifiedRatingClaims(page.description))
  const sanitizedBestFaqs = page.faqs
    .map((faq) => ({ question: stripUnverifiedPriceClaims(stripUnverifiedRatingClaims(faq.question)).trim(), answer: stripUnverifiedPriceClaims(stripUnverifiedRatingClaims(faq.answer)).trim() }))
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0)
  // A shortlist must not render an empty FAQ heading after unsafe or blank source FAQs are filtered.
  const safeFaqs = sanitizedBestFaqs.length > 0 ? sanitizedBestFaqs : [
    {
      question: `How should you evaluate options in ${page.title}?`,
      answer: `Use the criteria on this page to shortlist tools, then test the same representative workflow in each candidate. Verify required features, integrations, permissions, export options, and adoption effort with current vendor documentation and a trial.`,
    },
    {
      question: `Are the ratings in this ${page.category.toLowerCase()} shortlist verified?`,
      answer: `Treat each rating according to its visible verification label. A stored number is not proof of an independently validated assessment; review the methodology and evidence before relying on any score.`,
    },
    {
      question: `How should you compare current prices?`,
      answer: `Confirm each vendor's current official plan terms, billing period, seat minimums, usage limits, add-ons, implementation, and renewal terms. Compare the same usage scenario and do not treat unverified stored figures as current prices.`,
    },
    {
      question: `Does the first listed tool always win?`,
      answer: `No. The list order is not a universal recommendation unless the page provides verified criteria and evidence. Choose the product that meets your mandatory requirements with acceptable cost, operational risk, and user adoption effort.`,
    },
  ]
  const hasUnverifiedPickPrices = page.picks.some((pick) => Boolean(pick.priceRange?.trim()) && verifiedPickPrice(pick) === null) || (page.comparisonTable.columns.some((column) => /price|pricing/i.test(column)) && page.picks.some((pick) => verifiedPickPrice(pick) === null)) || (/[$€£]\s?\d/.test(page.pricingSummary) && page.picks.some((pick) => verifiedPickPrice(pick) === null))
  const safePickText = (pick: (typeof page.picks)[number] | undefined, value: string) => {
    const withoutProductEcho = pick?.toolName && value.toLowerCase().startsWith(`${pick.toolName.toLowerCase()} is best suited for `)
      ? `Best suited for ${value.slice(pick.toolName.length + " is best suited for ".length)}`
      : value
    const safeRatingText = stripUnverifiedRatingClaims(withoutProductEcho)
    return verifiedPickPrice(pick) === null ? stripUnverifiedPriceClaims(safeRatingText) : safeRatingText
  }
  // Preserve substantive buying advice even when some recorded prices are unverified.
  // Remove unsupported numeric prices, not the entire pricing discussion.
  const recordedPricingSummary = stripUnverifiedPriceClaims(page.pricingSummary)
  const safePricingSummary = hasUnverifiedPickPrices
    ? `${recordedPricingSummary} Some stored price figures are not independently verified; confirm current plan prices, billing periods, limits, and add-ons directly with each vendor.`
    : recordedPricingSummary
  // Preserve the full comparison matrix, including the rating and pricing columns.
  // A provisional stored score is useful context when labelled; a missing one must not be invented.
  const visibleComparisonColumns = page.comparisonTable.columns
  const visibleComparisonRows = page.comparisonTable.rows.map((row) => {
    const pick = page.picks.find((candidate) =>
      candidate.toolName.trim().toLowerCase() === String(row[0] ?? "").trim().toLowerCase(),
    )
    return row.map((cell, index) => {
      const column = page.comparisonTable.columns[index] ?? ""
      if (/rating|score/i.test(column)) {
        const stored = storedPickRating(pick)
        if (stored !== null) {
          return `${stored}/5 (${verifiedPickRating(pick) !== null ? "verified" : "provisional"})`
        }
        const recordedValue = String(cell ?? "").trim()
        const numericLegacyRating = recordedValue.match(/^([0-5](?:\.\d+)?)\s*(?:\/\s*5)?$/)
        if (numericLegacyRating) {
          const numericScore = Number(numericLegacyRating[1])
          return numericScore > 0 && numericScore <= 5
            ? `${numericScore}/5 (provisional; evidence pending)`
            : "Not assessed"
        }
        // Keep descriptive evaluation notes if no numeric score is recorded.
        return recordedValue && !/^not\s+(?:verified|recorded|available)$/i.test(recordedValue)
          ? stripUnverifiedRatingClaims(recordedValue)
          : "Not assessed"
      }
      if (/price|pricing/i.test(column)) {
        const verifiedPrice = verifiedPickPrice(pick)
        if (verifiedPrice) return verifiedPrice
        const qualitativeNotes = stripUnverifiedPriceClaims(String(cell ?? "")).trim()
        // Never discard pricing conditions such as seat minimums or quote requirements.
        return qualitativeNotes || "Verify current pricing with vendor"
      }
      const safeValue = stripUnverifiedRatingClaims(String(cell ?? ""))
      return hasUnverifiedPickPrices ? stripUnverifiedPriceClaims(safeValue) : safeValue
    })
  })
  const reviewHref = (toolSlug: string) => (getReview(toolSlug) ? `/reviews/${toolSlug}` : null)
  const relatedLinks = getRelatedByCategory(page.category, page.slug, 4)
  // Restore substantive editorial research only where the stored body was reviewed.
  // Do not surface unaudited legacy HTML across the entire catalog indiscriminately.
  const editorialBody = VETTED_LONG_FORM_BEST_SLUGS.has(page.slug)
    ? (page.reviewedBody || page.body)
    : undefined

  const relatedBestPages = (() => {
    const sameCategory = getAllBest()
      .filter((item) => item.category === page.category && !isNoindexed("best", item.slug) && !REDIRECTED_BEST_SLUGS.has(item.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug))
    const currentIndex = sameCategory.findIndex((item) => item.slug === page.slug)
    if (currentIndex < 0 || sameCategory.length < 2) return []
    return Array.from({ length: Math.min(4, sameCategory.length - 1) }, (_, offset) =>
      sameCategory[(currentIndex + offset + 1) % sameCategory.length],
    ).filter((item) => item.slug !== page.slug)
  })()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Best Software", href: "/best" }, { name: page.title, href: `/best/${slug}` }]} />
      <ArticleSchema title={page.title} description={safeDescription} publishedAt={page.lastUpdated} updatedAt={page.lastUpdated} author={page.author} url={`${site.url}/best/${slug}`} wordCount={page.description.split(/\s+/).length + page.criteria.join(" ").split(/\s+/).filter(Boolean).length + page.picks.reduce((n, p) => n + p.toolName.split(/\s+/).length + p.bestFor.split(/\s+/).filter(Boolean).length + p.pros.join(" ").split(/\s+/).filter(Boolean).length + p.cons.join(" ").split(/\s+/).filter(Boolean).length, 0) + page.pricingSummary.split(/\s+/).filter(Boolean).length + page.comparisonTable.rows.flat().join(" ").split(/\s+/).filter(Boolean).length + page.faqs.reduce((n, q) => n + q.question.split(/\s+/).length + q.answer.split(/\s+/).filter(Boolean).length, 0) + (editorialBody ? editorialBody.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length : 0)} category={page.category} keywords={["best " + page.category.toLowerCase(), page.category + " software ranking", "top " + page.category.toLowerCase() + " tools", "software shortlist 2026"].filter(Boolean)} mentions={linkedPicks.map(p => ({ name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}` }))} />
      <CollectionPageSchema name={page.title} description={safeDescription} url={`${site.url}/best/${slug}`} />
      <ItemListSchema items={linkedPicks.map(p => ({ name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}` }))} url={`${site.url}/best/${slug}`} />
      <WebPageSchema name={page.title} description={safeDescription} url={`${site.url}/best/${slug}`} dateModified={page.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: linkedPicks.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: softwareApp({ name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}`, category: getReview(p.toolSlug)?.category || page.category}) })) }} />
      <FAQSchema questions={safeFaqs} path={`/best/${slug}`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Best Software", href: "/best" }, { name: page.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={page.slug} title={page.title} subtitle={safeDescription} category={page.category} variant="review" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
            <p className="text-sm text-muted-foreground">This page compares {page.picks.length} options using recorded editorial scores where available. Scores marked provisional still need evidence review and must not be treated as third-party ratings. The list order is not a verified overall ranking. Compare workflow fit and confirm current plan terms directly with each vendor.</p>
          </div>

          <div className="tl-dr mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">TL;DR</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
              <li><strong>First listed option:</strong> {page.picks[0]?.toolName} — {safePickText(page.picks[0], page.picks[0]?.bestFor ?? "")}{storedPickRating(page.picks[0]) !== null ? ` ${verifiedPickRating(page.picks[0]) !== null ? "Verified" : "Provisional stored"} editorial score: ${storedPickRating(page.picks[0])}/5.` : " Editorial score pending evidence-backed assessment."} The list order is not a verified ranking.</li>
              <li>{page.picks.length} listed tools with recorded details; compare them using {page.criteria.length} criteria</li>
              <li>Pricing: {safePricingSummary}</li>
              <li>Each pick includes pros, cons, and a best-fit use case</li>
              <li>Category: {page.category} — updated {formatDate(page.lastUpdated)}</li>
            </ul>
          </div>

          <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
              {page.picks.slice(0, 3).map((pick) => (
                <li key={pick.toolSlug || pick.toolName}>
                  <strong>{pick.toolName}:</strong> {safePickText(pick, pick.bestFor)}{storedPickRating(pick) !== null ? ` ${verifiedPickRating(pick) !== null ? "Verified" : "Provisional stored"} editorial score: ${storedPickRating(pick)}/5.` : " Editorial score pending evidence-backed assessment."} Pricing: {verifiedPickPrice(pick) ?? "not independently verified in this shortlist"}. Verify current plan limits and included features with the vendor.
                </li>
              ))}
              {page.criteria.length > 0 && <li><strong>Compare on:</strong> {page.criteria.join(", ")}.</li>}
              <li><strong>Selection context:</strong> {safePricingSummary}</li>
              <li><strong>Last updated:</strong> {formatDate(page.lastUpdated)}. Prices, availability, and feature limits may change.</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{page.category}</Badge>
            <span>{page.picks.length} listed options</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>By {page.author}</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>Updated {formatDate(page.lastUpdated)}</span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we review</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {page.criteria.length > 0 && (
                <section className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary-subtle/10">
                  <h2 className="text-lg font-bold mb-3">Selection Criteria</h2>
                  <ul className="space-y-2">
                    {page.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Options to Evaluate</h2>
                <div className="space-y-6">
                  {page.picks.map((pick) => (
                    <GlassCard key={pick.toolSlug}>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold shrink-0">Option</span>
                            {reviewHref(pick.toolSlug) ? (
                              <Link href={`/reviews/${pick.toolSlug}`} className="text-lg font-bold hover:text-primary transition-colors">{pick.toolName}</Link>
                            ) : (
                              <span className="text-lg font-bold">{pick.toolName}</span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 text-sm" aria-label={verifiedPickRating(pick) !== null ? "Verified editorial score" : storedPickRating(pick) !== null ? "Unverified stored value, not a validated rating" : "Editorial score pending assessment"}>
                            {verifiedPickRating(pick) !== null && <Star size={14} className="fill-accent text-accent" aria-hidden="true" />}
                            {storedPickRating(pick) !== null ? (
                              <>
                                <span className="font-semibold">{storedPickRating(pick)}/5</span>
                                {verifiedPickRating(pick) !== null ? (
                                  <span className="text-[10px] text-muted-foreground">Verified editorial score</span>
                                ) : (
                                  <span className="max-w-[190px] text-right text-[10px] leading-snug text-amber-700 dark:text-amber-300">Unverified stored value — not a validated rating</span>
                                )}
                              </>
                            ) : <span className="text-xs text-muted-foreground">Score pending evidence-backed assessment</span>}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-primary mb-2"><span className="font-semibold">Best fit:</span> {safePickText(pick, pick.bestFor)}</p>
                        {verifiedPickPrice(pick) !== null ? (
                          <p className="text-xs text-muted-foreground mb-3">Listed pricing: {verifiedPickPrice(pick)}. Verify current plans, limits, and billing terms with the vendor.</p>
                        ) : (
                          <p className="text-xs text-muted-foreground mb-3">Pricing is not independently verified for this shortlist; check the vendor&apos;s current plans, regional terms, and usage limits.</p>
                        )}
                        <div className="grid sm:grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="text-xs font-semibold text-success mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Pros</p>
                            {pick.pros.length > 0 ? (
                              <ul className="space-y-1">
                                {pick.pros.map((pro, j) => (
                                  <li key={j} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-success mt-0.5">•</span>{safePickText(pick, pro)}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs leading-relaxed text-muted-foreground">No evidence-backed strengths are recorded for {pick.toolName} in this shortlist yet. Test the workflow against the selection criteria before treating it as a benefit.</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-error mb-1 flex items-center gap-1"><XCircle size={12} /> Cons</p>
                            {pick.cons.length > 0 ? (
                              <ul className="space-y-1">
                                {pick.cons.map((con, j) => (
                                  <li key={j} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-error mt-0.5">•</span>{safePickText(pick, con)}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs leading-relaxed text-muted-foreground">No specific limitations are recorded for {pick.toolName} in this shortlist yet. Check plan restrictions, data portability, support boundaries, and failure handling before adoption.</p>
                            )}
                          </div>
                        </div>
                        {reviewHref(pick.toolSlug) && (
                          <Link href={`/reviews/${pick.toolSlug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                            Read full review <ArrowRight size={12} />
                          </Link>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Pricing Summary</h2>
                <p className="text-muted-foreground leading-relaxed">{safePricingSummary}</p>
              </section>

              <EditorialArticleBody html={editorialBody} />

              <section className="mb-10 overflow-x-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Comparison Table</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {visibleComparisonColumns.map((col, i) => (
                        <th key={i} className="text-left py-3 px-3 font-semibold text-foreground">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleComparisonRows.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-accent-subtle/20 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2.5 px-3 text-muted-foreground">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-6">FAQs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {safeFaqs.map((faq, i) => (
                    <GlassCard key={i}>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 text-sm">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky-sidebar space-y-6">
                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3 text-sm">Options to evaluate</h3>
                    <div className="space-y-2">
                      {page.picks.slice(0, 5).map((pick, index) => reviewHref(pick.toolSlug) ? (
                        <Link key={pick.toolSlug} href={`/reviews/${pick.toolSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>Option {index + 1}: {pick.toolName}</span>
                          <span className="text-xs font-medium">{storedPickRating(pick) !== null ? `${storedPickRating(pick)}/5 (${verifiedPickRating(pick) !== null ? "verified" : "provisional"})` : "Not assessed"}</span>
                        </Link>
                      ) : (
                        <div key={pick.toolSlug} className="flex items-center justify-between text-sm text-muted-foreground py-1">
                          <span>Option {index + 1}: {pick.toolName}</span>
                          <span className="text-xs font-medium">{storedPickRating(pick) !== null ? `${storedPickRating(pick)}/5 (${verifiedPickRating(pick) !== null ? "verified" : "provisional"})` : "Not assessed"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <EEATProcess category={page.category} />
              </div>
            </aside>
          </div>

          <InternalLinks category={page.category} excludeSlug={page.slug} families={LEGACY_RELATED_TYPES} />
          
          <EnhancedRelatedContent
            title="More Resources"
            maxItems={6}
            items={extendedRelatedItems(relatedLinks)}
          />

          {relatedBestPages.length > 0 && (
            <section className="mt-12" aria-labelledby="related-best-pages">
              <h2 id="related-best-pages" className="text-2xl font-bold tracking-tight mb-5">More {page.category} Buying Guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedBestPages.map((related) => {
                  const hasUnverifiedRatings = related.picks.some((pick) => pick.ratingVerified !== true)
                  const hasUnverifiedPricing = related.picks.some((pick) => pick.priceRangeVerified !== true)
                  const relatedDescription = hasUnverifiedRatings || hasUnverifiedPricing
                    ? `A practical guide to evaluating ${related.category.toLowerCase()} tools by workflow fit, requirements, integrations, and total cost. Ratings and pricing are not independently verified; compare current vendor terms and test representative workflows.`
                    : stripUnverifiedPriceClaims(stripUnverifiedRatingClaims(related.description))
                  return (
                    <Link key={related.slug} href={`/best/${related.slug}`} className="rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-muted-bg transition-colors">
                      <span className="font-medium text-sm">{related.title}</span>
                      <p className="text-xs text-muted-foreground mt-1">{relatedDescription}</p>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {(() => {
            const cat = categories.find(c => c.name === page.category)
            if (!cat) return null
            return (
              <section className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Related Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.name !== page.category).slice(0, 6).map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </section>
            )
          })()}
        </Container>
      </article>
    </>
  )
}
