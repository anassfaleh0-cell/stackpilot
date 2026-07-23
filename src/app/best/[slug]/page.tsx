import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, FAQSchema, ItemListSchema, WebPageSchema, CollectionPageSchema, OrganizationSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { truncate, formatDate } from "@/lib/utils"
import { getBest, getAllBest, getContentTitle } from "@/lib/content/registry"
import { InternalLinks } from "@/components/content/internal-links"
import { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"

export function generateStaticParams() {
  return getAllBest().map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getBest(slug)
  if (!page) return {}
  const readingTime = Math.max(5, Math.ceil((page.description.split(/\s+/).length + page.picks.reduce((a, p) => a + p.pros.length + p.cons.length, 0) * 20) / 200))
  return createMetadata({ title: truncate(page.title, 60), description: `Compare the top ${page.picks.length} ${page.category.toLowerCase()} tools. Expert picks with pros, cons, pricing, and buying advice for 2026.`, path: `/best/${page.slug}`, ogType: "article", publishedAt: page.lastUpdated, updatedAt: page.lastUpdated, articleSection: page.category, readingTime })
}

export default async function BestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getBest(slug)
  if (!page) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Best Software", href: "/best" }, { name: page.title, href: `/best/${slug}` }]} />
      <ArticleSchema title={page.title} description={page.description} publishedAt={page.lastUpdated} updatedAt={page.lastUpdated} author={page.author} url={`${site.url}/best/${slug}`} wordCount={page.description.split(/\s+/).length + page.picks.reduce((a, p) => a + p.pros.length + p.cons.length, 0) * 20} category={page.category} keywords={["best " + page.category.toLowerCase(), page.category + " software ranking", "top " + page.category.toLowerCase() + " tools", "software recommendations 2026", "expert picks"].filter(Boolean)} mentions={page.picks.map(p => ({ name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}` }))} />
      <CollectionPageSchema name={page.title} description={page.description} url={`${site.url}/best/${slug}`} />
      <ItemListSchema items={page.picks.map(p => ({ name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}` }))} url={`${site.url}/best/${slug}`} />
      <WebPageSchema name={page.title} description={page.description} url={`${site.url}/best/${slug}`} dateModified={page.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: page.picks.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "SoftwareApplication", name: p.toolName, url: `${site.url}/reviews/${p.toolSlug}` } })) }} />
      <OrganizationSchema />
      <FAQSchema questions={page.faqs} path={`/best/${slug}`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Best Software", href: "/best" }, { name: page.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={page.slug} title={page.title} subtitle={page.description} category={page.category} variant="review" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
            <p className="text-sm text-muted-foreground">After hands-on testing of {page.picks.length} leading {page.category.toLowerCase()} tools, our top pick is <strong>{page.picks[0]?.toolName}</strong> (rating {page.picks[0]?.rating}/5, from {page.picks[0]?.priceRange}). Each tool was evaluated across {page.criteria.length} criteria including features, ease of use, value, and performance.</p>
          </div>

          <div className="tl-dr mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">TL;DR</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
              <li><strong>#1 pick:</strong> {page.picks[0]?.toolName} — {page.picks[0]?.bestFor}</li>
              <li>{page.picks.length} tools tested and ranked across {page.criteria.length} evaluation criteria</li>
              <li>Price range: from {page.picks.reduce((min, p) => Math.min(min, parseInt(p.priceRange.replace(/[^0-9]/g, "")) || 999), 999)} to {page.picks.reduce((max, p) => Math.max(max, parseInt(p.priceRange.replace(/[^0-9]/g, "")) || 0), 0)} per month</li>
              <li>Every pick includes real pros, cons, and best-fit use cases</li>
              <li>Category: {page.category} — last verified {formatDate(page.lastUpdated)}</li>
            </ul>
          </div>

          <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
              <li>{page.picks.length} top {page.category.toLowerCase()} tools ranked after hands-on testing</li>
              <li>Evaluation criteria: {page.criteria.join(", ")}</li>
              <li>Top pick: {page.picks[0]?.toolName} ({page.picks[0]?.rating}/5, from {page.picks[0]?.priceRange}) — {page.picks[0]?.bestFor}</li>
              {page.picks[1] ? <li>Runner-up: {page.picks[1].toolName} ({page.picks[1].rating}/5, from {page.picks[1].priceRange})</li> : null}
              <li>Pricing ranges from free to enterprise, depending on features and scale</li>
              <li>Each pick includes verified pros, cons, and best-fit recommendations</li>
              <li>Full comparison table with feature-by-feature breakdown included below</li>
              <li>Updated {formatDate(page.lastUpdated)} — pricing and features verified at time of review</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{page.category}</Badge>
            <span>{page.picks.length} editor-reviewed picks</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>By {page.author}</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>Updated {formatDate(page.lastUpdated)}</span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we review</a>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
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
                            <Link href={`/reviews/${pick.toolSlug}`} className="text-lg font-bold hover:text-primary transition-colors">{pick.toolName}</Link>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={14} className="fill-accent text-accent" />
                            <span className="font-semibold">{pick.rating}</span>
                            <span className="text-muted-foreground">/5</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-primary mb-2">{pick.bestFor}</p>
                        <p className="text-xs text-muted-foreground mb-3">From {pick.priceRange}</p>
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
                        <Link href={`/reviews/${pick.toolSlug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                          Read full review <ArrowRight size={12} />
                        </Link>
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
                      {page.comparisonTable.columns.map((col, i) => (
                        <th key={i} className="text-left py-3 px-3 font-semibold text-foreground">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {page.comparisonTable.rows.map((row, i) => (
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
                  {page.faqs.map((faq, i) => (
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
                      {page.picks.slice(0, 5).map((pick) => (
                        <Link key={pick.toolSlug} href={`/reviews/${pick.toolSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{pick.rank}. {pick.toolName}</span>
                          <span className="text-xs font-medium">{pick.rating}/5</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <EEATProcess category={page.category} />
              </div>
            </aside>
          </div>

          <InternalLinks category={page.category} excludeSlug={page.slug} />
          
          <EnhancedRelatedContent
            title="More Resources"
            maxItems={6}
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
