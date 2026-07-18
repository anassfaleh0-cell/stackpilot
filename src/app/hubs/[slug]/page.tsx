import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, FAQSchema, ItemListSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getHub, getAllHubs, getContentTitle } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { RelatedContent } from "@/components/dynamic-client"

export function generateStaticParams() {
  return getAllHubs().map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hub = getHub(slug)
  if (!hub) return {}
  return createMetadata({ title: hub.title, description: hub.description, path: `/hubs/${hub.slug}`, ogType: "article", publishedAt: hub.lastUpdated })
}

export default async function HubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hub = getHub(slug)
  if (!hub) notFound()

  const byCategory: Record<string, typeof hub.recommendations> = {}
  hub.recommendations.forEach(rec => {
    if (!byCategory[rec.category]) byCategory[rec.category] = []
    byCategory[rec.category].push(rec)
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "By Business Type", href: "/hubs" }, { name: hub.title, href: `/hubs/${slug}` }]} />
      <ArticleSchema title={hub.title} description={hub.description} publishedAt={hub.lastUpdated} author="PilotStack Team" url={`${site.url}/hubs/${slug}`} />
      <ItemListSchema items={hub.recommendations.map(r => ({ name: r.toolName, url: `${site.url}/reviews/${r.toolSlug}` }))} url={`${site.url}/hubs/${slug}`} />
      <WebPageSchema name={hub.title} description={hub.description} url={`${site.url}/hubs/${slug}`} mainEntity={{ "@type": "ItemList", itemListElement: hub.recommendations.map((r, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "SoftwareApplication", name: r.toolName, url: `${site.url}/reviews/${r.toolSlug}` } })) }} />
      <FAQSchema questions={hub.faqs} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "By Business Type", href: "/hubs" }, { name: hub.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={hub.slug} title={hub.title} subtitle={hub.description} category={hub.audience} variant="guide" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{hub.audience}</Badge>
            <span>{hub.recommendations.length} recommendations</span>
            <span className="ml-auto text-[11px]">Updated {hub.lastUpdated}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {hub.challenges.length > 0 && (
                <section className="mb-10 p-5 rounded-xl border border-error/20 bg-error-subtle/10">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-error" />
                    <h2 className="text-lg font-bold">Key Challenges</h2>
                  </div>
                  <ul className="space-y-2">
                    {hub.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-error mt-0.5 shrink-0">•</span>
                        <span>{challenge}</span>
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

              <section className="mb-10 overflow-x-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Comparison Matrix</h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {hub.comparisonMatrix.columns.map((col, i) => (
                        <th key={i} className="text-left py-3 px-3 font-semibold text-foreground">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hub.comparisonMatrix.rows.map((row, i) => (
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
                  {hub.faqs.map((faq, i) => (
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
                      {hub.recommendations.sort((a, b) => b.rating - a.rating).slice(0, 4).map((rec) => (
                        <Link key={rec.toolSlug} href={`/reviews/${rec.toolSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{rec.toolName}</span>
                          <span className="text-xs font-medium">{rec.rating}/5</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </aside>
          </div>

          <RelatedContent
            items={[
              ...(hub.relatedComparisons || []).map(s => ({ slug: s, type: "comparison" as const, title: getContentTitle("comparison", s) ?? undefined })),
              ...(hub.relatedGuides || []).map(s => ({ slug: s, type: "guide" as const, title: getContentTitle("guide", s) ?? undefined })),
              ...(hub.relatedPosts || []).map(s => ({ slug: s, type: "blog" as const, title: getContentTitle("blog", s) ?? undefined })),
            ]}
            title="Related Resources"
          />
        </Container>
      </article>
    </>
  )
}
