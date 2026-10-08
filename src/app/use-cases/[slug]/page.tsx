import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, FAQSchema, ArticleSchema, WebPageSchema, ItemListSchema, softwareApp } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getUseCase, getAllUseCases, getReview } from "@/lib/content/registry"
import { truncate, formatDate } from "@/lib/utils"
import { InternalLinks } from "@/components/content/internal-links"
import { RelatedReading } from "@/components/content/related-reading"
import { notFound } from "next/navigation"
import { isNoindexed } from "@/lib/noindex"
import Link from "next/link"
import { Star, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react"
import { EditorialHero, GlassCard, InfoCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"
import { InFeedAd } from "@/components/ads"

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const uc = getUseCase(slug)
  if (!uc) return {}
  const readingTime = Math.max(5, Math.ceil((uc.description.split(/\s+/).length + uc.recommendations.length * 20) / 200))
  const shortTitle = uc.title.length > 58 ? uc.title.slice(0, 55) + "..." : uc.title
  return createMetadata({ title: shortTitle, description: truncate(uc.description, 160), path: `/use-cases/${uc.slug}`, ogType: "article", publishedAt: uc.lastUpdated, updatedAt: uc.lastUpdated, articleSection: uc.category, readingTime , noIndex: isNoindexed("use-cases", uc.slug) })
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const uc = getUseCase(slug)
  if (!uc) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Use Cases", href: "/use-cases" }, { name: uc.title, href: `/use-cases/${slug}` }]} />
      <ArticleSchema title={uc.title} description={uc.description} publishedAt={uc.lastUpdated} updatedAt={uc.lastUpdated} author="PilotStack Team" url={`${site.url}/use-cases/${slug}`} wordCount={uc.description.split(/\s+/).length + uc.useCaseDescription.split(/\s+/).filter(Boolean).length + uc.recommendations.reduce((n, r) => n + r.toolName.split(/\s+/).length + r.bestFor.split(/\s+/).filter(Boolean).length + r.keyFeatures.join(" ").split(/\s+/).filter(Boolean).length, 0) + uc.selectionCriteria.reduce((n, r) => n + r.factor.split(/\s+/).length + r.description.split(/\s+/).filter(Boolean).length, 0) + uc.commonPitfalls.join(" ").split(/\s+/).filter(Boolean).length + uc.faqs.reduce((n, q) => n + q.question.split(/\s+/).length + q.answer.split(/\s+/).filter(Boolean).length, 0)} category={uc.category} />
      <WebPageSchema name={uc.title} description={uc.description} url={`${site.url}/use-cases/${slug}`} dateModified={uc.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: uc.recommendations.map((rec, i) => ({ "@type": "ListItem", position: i + 1, item: softwareApp({ name: rec.toolName, url: `${site.url}/reviews/${rec.toolSlug}`, category: getReview(rec.toolSlug)?.category || uc.category }) })) }} />
      <ItemListSchema items={uc.recommendations.map(rec => ({ name: rec.toolName, url: `${site.url}/reviews/${rec.toolSlug}` }))} url={`${site.url}/use-cases/${slug}`} />
      <CollectionPageSchema name={uc.title} description={uc.description} url={`${site.url}/use-cases/${slug}`} />
      <FAQSchema questions={uc.faqs} path={`/use-cases/${slug}`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Use Cases", href: "/use-cases" }, { name: uc.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={uc.slug} title={uc.title} subtitle={uc.description} category={uc.category} variant="guide" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{uc.category}</Badge>
            <span>{uc.recommendations.length} recommendations</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>By PilotStack Team</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>Updated {formatDate(uc.lastUpdated)}</span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we score</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{uc.useCaseDescription}</p>

              <section className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-4">At a Glance</h2>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted-bg">
                        <th className="text-left py-2.5 px-3 font-semibold">Tool</th>
                        <th className="text-left py-2.5 px-3 font-semibold">Rating</th>
                        <th className="text-left py-2.5 px-3 font-semibold">Best for</th>
                        <th className="text-left py-2.5 px-3 font-semibold">Pricing</th>
                        <th className="text-left py-2.5 px-3 font-semibold"><span className="sr-only">Review</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {uc.recommendations.map((rec) => {
                        const review = getReview(rec.toolSlug)
                        return (
                          <tr key={rec.toolSlug} className="border-b border-border/50 hover:bg-accent-subtle/20 transition-colors">
                            <td className="py-2.5 px-3 font-medium">
                              <Link href={`/reviews/${rec.toolSlug}`} className="hover:text-primary transition-colors">{rec.toolName}</Link>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">{rec.rating}/5</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{rec.bestFor}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {review?.priceRange ? `${review.priceRange} (${review.pricing})` : review?.pricing || "See review"}
                            </td>
                            <td className="py-2.5 px-3">
                              <Link href={`/reviews/${rec.toolSlug}`} className="text-primary hover:underline whitespace-nowrap">Read review</Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ratings and pricing ranges are taken from our published reviews and may change when vendors update their plans.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Top Recommendations</h2>
                <div className="space-y-4">
                  {uc.recommendations.map((rec) => (
                    <GlassCard key={rec.toolSlug}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <Link href={`/reviews/${rec.toolSlug}`} className="text-lg font-bold hover:text-primary transition-colors">{rec.toolName}</Link>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={14} className="fill-accent text-accent" />
                            <span className="font-semibold">{rec.rating}</span>
                            <span className="text-muted-foreground">/5</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-primary mb-2">{rec.bestFor}</p>
                        <ul className="space-y-1 mb-3">
                          {rec.keyFeatures.map((feat, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 size={12} className="text-success mt-0.5 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href={`/reviews/${rec.toolSlug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                          Read full review <ArrowRight size={12} />
                        </Link>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>

              {/* Ad: In-feed between sections */}
              <section className="my-10">
                <InFeedAd className="mx-auto max-w-[728px]" />
              </section>

              {uc.selectionCriteria.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Selection Criteria</h2>
                  <div className="space-y-3">
                    {uc.selectionCriteria.map((criteria, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{criteria.factor}</p>
                            <Badge variant={criteria.importance === "Critical" ? "danger" : criteria.importance === "High" ? "default" : "outline"}>{criteria.importance}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{criteria.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {uc.commonPitfalls.length > 0 && (
                <section className="mb-10 p-5 rounded-xl border border-error/20 bg-error-subtle/10">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} className="text-error" />
                    <h2 className="text-lg font-bold">Common Mistakes</h2>
                  </div>
                  <ul className="space-y-2">
                    {uc.commonPitfalls.map((pitfall, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-error mt-0.5 shrink-0">•</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-6">FAQs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {uc.faqs.map((faq) => (
                    <GlassCard key={faq.question}>
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
                    <h3 className="font-semibold mb-3 text-sm">Recommended Tools</h3>
                    <div className="space-y-2">
                      {uc.recommendations.slice(0, 4).map((rec) => (
                        <Link key={rec.toolSlug} href={`/reviews/${rec.toolSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{rec.toolName}</span>
                          <span className="text-xs font-medium">{rec.rating}/5</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <EEATProcess category={uc.category} />
              </div>
            </aside>
          </div>

          <InternalLinks category={uc.category} excludeSlug={uc.slug} />
          
          <RelatedReading
            title="Keep Reading"
            excludeSlug={uc.slug}
            comparisons={uc.relatedComparisons}
            guides={uc.relatedGuides}
            posts={uc.relatedPosts}
          />
        </Container>
      </article>
    </>
  )
}
