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
import { isNoindexed } from "@/lib/noindex"

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

export const dynamicParams = true
export const revalidate = 86400

export function generateStaticParams() {
  // Keep the full corpus indexable without forcing 2,000+ pages through every production build.
  // Pages are rendered on first request and cached for 24h.
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getBest(slug)
  if (!page) return {}
  const readingTime = Math.max(5, Math.ceil((page.description.split(/\s+/).length + page.picks.reduce((a, p) => a + p.pros.length + p.cons.length, 0) * 20) / 200))
  const safeDescription = stripUnverifiedRatingClaims(page.description)
  const metaDescription = safeDescription.length < 120
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
    if (!pick?.toolSlug) return null
    const review = getReview(pick.toolSlug)
    return review?.ratingVerified === true && typeof review.rating === "number" && Number.isFinite(review.rating)
      ? review.rating
      : null
  }
  const verifiedPickPrice = (pick: (typeof page.picks)[number] | undefined): string | null =>
    pick?.priceRangeVerified === true && typeof pick.priceRange === "string" && pick.priceRange.trim()
      ? pick.priceRange
      : null
  const safeDescription = stripUnverifiedRatingClaims(page.description)
  const safeFaqs = page.faqs.map((faq) => ({ question: stripUnverifiedRatingClaims(faq.question), answer: stripUnverifiedRatingClaims(faq.answer) }))
  const hasUnverifiedPickRatings = page.picks.some((pick) => typeof pick.rating === "number" && verifiedPickRating(pick) === null)
  const hasUnverifiedPickPrices = page.picks.some((pick) => Boolean(pick.priceRange?.trim()) && verifiedPickPrice(pick) === null)
  const visibleComparisonColumnIndexes = page.comparisonTable.columns.map((column, index) => ({ column, index })).filter(({ column }) => !((hasUnverifiedPickRatings && /rating|score/i.test(column)) || (hasUnverifiedPickPrices && /price|pricing/i.test(column)))).map(({ index }) => index)
  const visibleComparisonColumns = visibleComparisonColumnIndexes.map((index) => page.comparisonTable.columns[index])
  const visibleComparisonRows = page.comparisonTable.rows.map((row) => visibleComparisonColumnIndexes.map((index) => stripUnverifiedRatingClaims(String(row[index] ?? ""))))
  const reviewHref = (toolSlug: string) => (getReview(toolSlug) ? `/reviews/${toolSlug}` : null)
  const relatedLinks = getRelatedByCategory(page.category, page.slug, 4)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Best Software", href: "/best" }, { name: page.title, href: `/best/${slug}` }]} />
      <ArticleSchema title={page.title} description={safeDescription} publishedAt={page.lastUpdated} updatedAt={page.lastUpdated} author={page.author} url={`${site.url}/best/${slug}`} wordCount={page.description.split(/\s+/).length + page.criteria.join(" ").split(/\s+/).filter(Boolean).length + page.picks.reduce((n, p) => n + p.toolName.split(/\s+/).length + p.bestFor.split(/\s+/).filter(Boolean).length + p.pros.join(" ").split(/\s+/).filter(Boolean).length + p.cons.join(" ").split(/\s+/).filter(Boolean).length, 0) + page.pricingSummary.split(/\s+/).filter(Boolean).length + page.comparisonTable.rows.flat().join(" ").split(/\s+/).filter(Boolean).length + page.faqs.reduce((n, q) => n + q.question.split(/\s+/).length + q.answer.split(/\s+/).filter(Boolean).length, 0)} category={page.category} keywords={["best " + page.category.toLowerCase(), page.category + " software ranking", "top " + page.category.toLowerCase() + " tools", "software recommendations 2026"].filter(Boolean)} mentions={linkedPicks.map(p => ({ name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}` }))} />
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
            <p className="text-sm text-muted-foreground">The first listed option is <strong>{page.picks[0]?.toolName}</strong>{verifiedPickRating(page.picks[0]) !== null ? ` (verified editorial rating ${verifiedPickRating(page.picks[0])}/5)` : ""} (pricing: {verifiedPickPrice(page.picks[0]) ?? "check current vendor pricing"}). Use this shortlist as a starting point, verify current details with the vendor, and compare each option against your workflow.</p>
          </div>

          <div className="tl-dr mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">TL;DR</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
              <li><strong>#1 listed option:</strong> {page.picks[0]?.toolName} — {page.picks[0]?.bestFor}{verifiedPickRating(page.picks[0]) !== null ? ` Verified editorial rating: ${verifiedPickRating(page.picks[0])}/5.` : ""}</li>
              <li>{page.picks.length} listed tools with recorded details; compare them using {page.criteria.length} criteria</li>
              <li>Pricing: {page.pricingSummary}</li>
              <li>Each pick includes pros, cons, and a best-fit use case</li>
              <li>Category: {page.category} — updated {formatDate(page.lastUpdated)}</li>
            </ul>
          </div>

          <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
              {page.picks.slice(0, 3).map((pick) => (
                <li key={pick.toolSlug || pick.toolName}>
                  <strong>{pick.toolName}:</strong> {pick.bestFor}{verifiedPickRating(pick) !== null ? ` Verified editorial rating: ${verifiedPickRating(pick)}/5.` : ""} Pricing shown: {pick.priceRange}. Verify current plan limits and included features with the vendor.
                </li>
              ))}
              {page.criteria.length > 0 && <li><strong>Compare on:</strong> {page.criteria.join(", ")}.</li>}
              <li><strong>Selection context:</strong> {page.pricingSummary}</li>
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
                <h2 className="text-2xl font-bold tracking-tight mb-6">Top Picks</h2>
                <div className="space-y-6">
                  {page.picks.map((pick) => (
                    <GlassCard key={pick.toolSlug} glow={pick.rank === 1}>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">{pick.rank}</span>
                            {reviewHref(pick.toolSlug) ? (
                              <Link href={`/reviews/${pick.toolSlug}`} className="text-lg font-bold hover:text-primary transition-colors">{pick.toolName}</Link>
                            ) : (
                              <span className="text-lg font-bold">{pick.toolName}</span>
                            )}
                          </div>
                          {verifiedPickRating(pick) !== null && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star size={14} className="fill-accent text-accent" />
                              <span className="font-semibold">{verifiedPickRating(pick)}</span>
                              <span className="text-muted-foreground">/5</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-primary mb-2">{pick.bestFor}</p>
                        {verifiedPickPrice(pick) !== null ? (
                          <p className="text-xs text-muted-foreground mb-3">Listed pricing: {verifiedPickPrice(pick)}. Verify current plans, limits, and billing terms with the vendor.</p>
                        ) : (
                          <p className="text-xs text-muted-foreground mb-3">Pricing is not independently verified for this shortlist; check the vendor&apos;s current plans, regional terms, and usage limits.</p>
                        )}
                        <div className="grid sm:grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="text-xs font-semibold text-success mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Pros</p>
                            <ul className="space-y-1">
                              {pick.pros.map((pro, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-success mt-0.5">•</span>{pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-error mb-1 flex items-center gap-1"><XCircle size={12} /> Cons</p>
                            <ul className="space-y-1">
                              {pick.cons.map((con, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-error mt-0.5">•</span>{con}</li>
                              ))}
                            </ul>
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
                <p className="text-muted-foreground leading-relaxed">{page.pricingSummary}</p>
              </section>

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
                    <h3 className="font-semibold mb-3 text-sm">Top Picks</h3>
                    <div className="space-y-2">
                      {page.picks.slice(0, 5).map((pick) => reviewHref(pick.toolSlug) ? (
                        <Link key={pick.toolSlug} href={`/reviews/${pick.toolSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{pick.rank}. {pick.toolName}</span>
                          <span className="text-xs font-medium">{verifiedPickRating(pick) !== null ? `${verifiedPickRating(pick)}/5` : "Rating not verified"}</span>
                        </Link>
                      ) : (
                        <div key={pick.toolSlug} className="flex items-center justify-between text-sm text-muted-foreground py-1">
                          <span>{pick.rank}. {pick.toolName}</span>
                          <span className="text-xs font-medium">{verifiedPickRating(pick) !== null ? `${verifiedPickRating(pick)}/5` : "Rating not verified"}</span>
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
