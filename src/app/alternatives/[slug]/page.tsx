import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema, FAQSchema, AboutPageSchema, WebPageSchema, OrganizationSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAlternative, getAllAlternatives, getContentTitle } from "@/lib/content/registry"
import { InternalLinks } from "@/components/content/internal-links"
import { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"

export function generateStaticParams() {
  return getAllAlternatives().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const alt = getAlternative(slug)
  if (!alt) return {}
  const shortTitle = alt.title.length > 58 ? alt.title.slice(0, 55) + "..." : alt.title
  return createMetadata({ title: shortTitle, description: `Looking for ${alt.toolName} alternatives? Compare the top ${alt.alternatives.length} competitors with ratings, pricing, and expert analysis.`, path: `/alternatives/${alt.slug}`, ogType: "article", publishedAt: alt.lastUpdated, updatedAt: alt.lastUpdated, articleSection: alt.category })
}

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const alt = getAlternative(slug)
  if (!alt) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Alternatives", href: "/alternatives" }, { name: alt.title, href: `/alternatives/${slug}` }]} />
      <CollectionPageSchema name={alt.title} description={alt.description} url={`${site.url}/alternatives/${slug}`} />
      <ItemListSchema items={alt.alternatives.map(a => ({ name: a.name, url: `${site.url}/reviews/${a.slug}` }))} url={`${site.url}/alternatives/${slug}`} />
      <WebPageSchema name={alt.title} description={alt.description} url={`${site.url}/alternatives/${slug}`} dateModified={alt.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: alt.alternatives.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "SoftwareApplication", name: a.name, url: `${site.url}/reviews/${a.slug}` } })) }} />
      <OrganizationSchema />
      <ArticleSchema title={alt.title} description={alt.description} publishedAt={alt.lastUpdated} updatedAt={alt.lastUpdated} author="PilotStack Team" url={`${site.url}/alternatives/${slug}`} wordCount={alt.description.split(/\s+/).length} category={alt.category} />
      <AboutPageSchema name={alt.title} description={alt.description} url={`${site.url}/alternatives/${slug}`} about={alt.alternatives.map((a) => ({ "@type": "SoftwareApplication", name: a.name, url: `${site.url}/reviews/${a.slug}` }))} />
      <FAQSchema questions={alt.faqs} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Alternatives", href: "/alternatives" }, { name: alt.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={alt.slug} title={alt.title} subtitle={alt.description} category={alt.category} variant="guide" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{alt.category}</Badge>
            <span>Based on {alt.alternatives.length} alternatives</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>Researched by PilotStack Team</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>Updated {alt.lastUpdated}</span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we compare</a>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <section className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Top Alternatives to {alt.toolName}</h2>
                <div className="space-y-4">
                  {alt.alternatives.map((item) => (
                    <GlassCard key={item.slug}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <Link href={`/reviews/${item.slug}`} className="text-lg font-bold hover:text-primary transition-colors">{item.name}</Link>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={14} className="fill-accent text-accent" />
                            <span className="font-semibold">{item.rating}</span>
                            <span className="text-muted-foreground">/5</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        <Link href={`/reviews/${item.slug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                          Read full review <ArrowRight size={12} />
                        </Link>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>

              {alt.selectionCriteria.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">How to Choose</h2>
                  <div className="space-y-3">
                    {alt.selectionCriteria.map((criteria, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{criteria}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {alt.sections.map((section, i) => (
                <section key={i} className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                  {section.type === "list" && section.items ? (
                    <>
                      <p className="text-muted-foreground leading-relaxed mb-4">{section.body}</p>
                      <ul className="space-y-2">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 size={14} className="text-success mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                  )}
                </section>
              ))}

              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-6">FAQs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {alt.faqs.map((faq) => (
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
                    <h3 className="font-semibold mb-3 text-sm">Quick Comparison</h3>
                    <div className="space-y-2">
                      {alt.alternatives.slice(0, 5).map((item) => (
                        <Link key={item.slug} href={`/reviews/${item.slug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{item.name}</span>
                          <span className="text-xs font-medium">{item.rating}/5</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3 text-sm">On This Page</h3>
                    <nav className="space-y-1.5">
                      <a href="#top-alternatives" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1">Top Alternatives</a>
                      {alt.selectionCriteria.length > 0 && <a href="#how-to-choose" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1">How to Choose</a>}
                      <a href="#faq" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1">FAQ</a>
                    </nav>
                  </div>
                </GlassCard>

                {alt.toolSlug && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 text-sm">Original Tool</h3>
                      <Link href={`/reviews/${alt.toolSlug}`} className="text-sm text-primary hover:underline">{alt.toolName} Review</Link>
                    </div>
                  </GlassCard>
                )}

                <EEATProcess category={alt.category} />
              </div>
            </aside>
          </div>

          <InternalLinks category={alt.category} excludeSlug={alt.slug} />
          
          <EnhancedRelatedContent
            title="More Resources"
            maxItems={6}
          />
        </Container>
      </article>
    </>
  )
}
