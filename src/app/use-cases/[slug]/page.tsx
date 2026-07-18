import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, FAQSchema, AboutPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getUseCase, getAllUseCases, getContentTitle } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react"
import { EditorialHero, GlassCard, InfoCard } from "@/components/dynamic"
import { RelatedContent } from "@/components/dynamic-client"

export function generateStaticParams() {
  return getAllUseCases().map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const uc = getUseCase(slug)
  if (!uc) return {}
  return createMetadata({ title: uc.title, description: uc.description, path: `/use-cases/${uc.slug}` })
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const uc = getUseCase(slug)
  if (!uc) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Use Cases", href: "/use-cases" }, { name: uc.title, href: `/use-cases/${slug}` }]} />
      <CollectionPageSchema name={uc.title} description={uc.description} url={`${site.url}/use-cases/${slug}`} />
      <AboutPageSchema name={uc.title} description={uc.description} url={`${site.url}/use-cases/${slug}`} about={uc.recommendations.map((rec) => ({ "@type": "SoftwareApplication", name: rec.toolName, url: `${site.url}/reviews/${rec.toolSlug}` }))} />
      <FAQSchema questions={uc.faqs} />
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
            <span className="ml-auto text-[11px]">Last updated {uc.lastUpdated}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{uc.useCaseDescription}</p>

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
              </div>
            </aside>
          </div>

          <RelatedContent
            items={[
              ...(uc.relatedComparisons || []).map(s => ({ slug: s, type: "comparison" as const, title: getContentTitle("comparison", s) ?? undefined })),
              ...(uc.relatedGuides || []).map(s => ({ slug: s, type: "guide" as const, title: getContentTitle("guide", s) ?? undefined })),
            ]}
            title="Related Resources"
          />
        </Container>
      </article>
    </>
  )
}
