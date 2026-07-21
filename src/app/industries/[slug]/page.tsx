import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, FAQSchema, AboutPageSchema, ArticleSchema, WebPageSchema, ItemListSchema, OrganizationSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getIndustry, getAllIndustries, getContentTitle } from "@/lib/content/registry"
import { formatDate } from "@/lib/utils"
import { InternalLinks } from "@/components/content/internal-links"
import { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react"
import { EditorialHero, GlassCard, InfoCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"

export function generateStaticParams() {
  return getAllIndustries().map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) return {}
  const readingTime = Math.max(5, Math.ceil((ind.description.split(/\s+/).length + ind.recommendations.length * 15) / 200))
  const shortTitle = ind.title.length > 58 ? ind.title.slice(0, 55) + "..." : ind.title
  return createMetadata({ title: shortTitle, description: `Best software for ${ind.industry.toLowerCase()} businesses. Expert picks with ratings, pricing, and implementation tips for 2026.`, path: `/industries/${ind.slug}`, ogType: "article", publishedAt: ind.lastUpdated, updatedAt: ind.lastUpdated, articleSection: ind.industry, readingTime })
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) notFound()

  // Group recommendations by category
  const byCategory: Record<string, typeof ind.recommendations> = {}
  ind.recommendations.forEach(rec => {
    if (!byCategory[rec.category]) byCategory[rec.category] = []
    byCategory[rec.category].push(rec)
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: ind.title, href: `/industries/${slug}` }]} />
      <ArticleSchema title={ind.title} description={ind.description} publishedAt={ind.lastUpdated} updatedAt={ind.lastUpdated} author="PilotStack Team" url={`${site.url}/industries/${slug}`} wordCount={ind.description.split(/\s+/).length + ind.recommendations.length * 15} category={ind.industry} />
      <WebPageSchema name={ind.title} description={ind.description} url={`${site.url}/industries/${slug}`} dateModified={ind.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: ind.recommendations.map((rec, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "SoftwareApplication", name: rec.toolName, url: `${site.url}/reviews/${rec.toolSlug}` } })) }} />
      <ItemListSchema items={ind.recommendations.map(rec => ({ name: rec.toolName, url: `${site.url}/reviews/${rec.toolSlug}` }))} url={`${site.url}/industries/${slug}`} />
      <CollectionPageSchema name={ind.title} description={ind.description} url={`${site.url}/industries/${slug}`} />
      <AboutPageSchema name={ind.title} description={ind.description} url={`${site.url}/industries/${slug}`} about={ind.recommendations.map((rec) => ({ "@type": "SoftwareApplication", name: rec.toolName, url: `${site.url}/reviews/${rec.toolSlug}` }))} />
      <OrganizationSchema />
      <FAQSchema questions={ind.faqs} path={`/industries/${slug}`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Industries", href: "/industries" }, { name: ind.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={ind.slug} title={ind.title} subtitle={ind.description} category="Business" variant="guide" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{ind.industry}</Badge>
            <span>{ind.recommendations.length} software recommendations</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>By PilotStack Team</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>Updated {formatDate(ind.lastUpdated)}</span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we test</a>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{ind.industryOverview}</p>

              {ind.softwareNeeds.length > 0 && (
                <section className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary-subtle/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-primary" />
                    <h2 className="text-lg font-bold">Key Software Needs</h2>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {ind.softwareNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={14} className="text-success mt-0.5 shrink-0" />
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {Object.entries(byCategory).map(([category, recs]) => (
                <section key={category} className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">{category}</h2>
                  <div className="space-y-4">
                    {recs.map((rec) => (
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
                          <p className="text-sm text-primary mb-1">{rec.bestFor}</p>
                          <Link href={`/reviews/${rec.toolSlug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                            Read full review <ArrowRight size={12} />
                          </Link>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </section>
              ))}

              {ind.implementationTips.length > 0 && (
                <section className="mb-10 p-5 rounded-xl border border-success/20 bg-success-subtle/10">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-success" />
                    <h2 className="text-lg font-bold">Implementation Tips</h2>
                  </div>
                  <ul className="space-y-2">
                    {ind.implementationTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-success mt-0.5 shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-6">FAQs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {ind.faqs.map((faq) => (
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
                    <h3 className="font-semibold mb-3 text-sm">Software by Category</h3>
                    <div className="space-y-1.5">
                      {Object.keys(byCategory).map((cat) => (
                        <a key={cat} href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`} className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1">{cat} ({byCategory[cat].length})</a>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3 text-sm">Top Picks</h3>
                    <div className="space-y-2">
                      {ind.recommendations.sort((a, b) => b.rating - a.rating).slice(0, 4).map((rec) => (
                        <Link key={rec.toolSlug} href={`/reviews/${rec.toolSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{rec.toolName}</span>
                          <span className="text-xs font-medium">{rec.rating}/5</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <EEATProcess category={ind.industry} />
              </div>
            </aside>
          </div>

          <InternalLinks category={ind.industry} excludeSlug={ind.slug} />
          
          <EnhancedRelatedContent
            title="More Resources"
            maxItems={6}
          />
        </Container>
      </article>
    </>
  )
}
