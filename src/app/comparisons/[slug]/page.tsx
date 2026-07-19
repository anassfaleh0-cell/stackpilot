import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, FAQSchema, ReviewSchema, SoftwareSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getComparison, getContentTitle } from "@/lib/content/registry"
import { getAllComparisons } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Target } from "lucide-react"
import { EditorialHero, EditorialCallout, GlassCard, InfoCard } from "@/components/dynamic"
import { EditorialComparison, RelatedContent } from "@/components/dynamic-client"
import { getReview } from "@/lib/content/registry"
import { ScoreBar } from "@/components/brand/patterns"

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) return {}
  return createMetadata({ title: cmp.title, description: cmp.description, path: `/comparisons/${slug}`, ogType: "article", publishedAt: cmp.lastUpdated, updatedAt: cmp.lastUpdated })
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) notFound()

  const t1Score = cmp.features.filter((f) => f.tool1 && !f.tool2).length
  const t2Score = cmp.features.filter((f) => f.tool2 && !f.tool1).length
  const tieScore = cmp.features.filter((f) => f.tool1 && f.tool2).length
  const total = cmp.features.length
  const t1Pct = Math.round((t1Score / total) * 100)
  const t2Pct = Math.round((t2Score / total) * 100)

  const review1 = getReview(cmp.tool1Slug)
  const review2 = getReview(cmp.tool2Slug)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Comparisons", href: "/comparisons" }, { name: cmp.title, href: `/comparisons/${slug}` }]} />
      {review1 && <ReviewSchema name={review1.name} description={review1.description} rating={review1.rating} reviewCount={review1.reviewCount} url={`${site.url}/reviews/${review1.slug}`} />}
      {review2 && <ReviewSchema name={review2.name} description={review2.description} rating={review2.rating} reviewCount={review2.reviewCount} url={`${site.url}/reviews/${review2.slug}`} />}
      {review1 && <SoftwareSchema name={review1.name} description={review1.tagline} applicationCategory="BusinessApplication" />}
      {review2 && <SoftwareSchema name={review2.name} description={review2.tagline} applicationCategory="BusinessApplication" />}
      <WebPageSchema name={cmp.title} description={cmp.description} url={`${site.url}/comparisons/${slug}`} mainEntity={{ "@type": "ItemList", itemListElement: [{ "@type": "ListItem", position: 1, item: { "@type": "SoftwareApplication", name: cmp.tool1, url: `${site.url}/reviews/${cmp.tool1Slug}` } }, { "@type": "ListItem", position: 2, item: { "@type": "SoftwareApplication", name: cmp.tool2, url: `${site.url}/reviews/${cmp.tool2Slug}` } }] }} />
      <FAQSchema questions={cmp.faqs} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Comparisons", href: "/comparisons" }, { name: cmp.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          {/* Hero */}
          <div className="mb-8">
            <EditorialHero
              slug={cmp.slug}
              title={cmp.title}
              subtitle={cmp.description}
              category={cmp.category}
              variant="comparison"
              className="w-full min-h-[200px] sm:min-h-[240px]"
            />
          </div>

          {/* E-E-A-T metadata bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Reviewed by PilotStack Team
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
              Updated {cmp.lastUpdated}
            </span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we test</a>
            <span className="ml-auto text-[11px]">Independent comparison · No paid placement</span>
          </div>

          {/* Tool Compare Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              { name: cmp.tool1, slug: cmp.tool1Slug, isWinner: cmp.winner === cmp.tool1, score: t1Pct },
              { name: cmp.tool2, slug: cmp.tool2Slug, isWinner: cmp.winner === cmp.tool2, score: t2Pct },
            ].map((tool) => (
              <GlassCard key={tool.name} glow={tool.isWinner}>
                <div className="p-5 text-center relative">
                  {tool.isWinner && (
                    <Badge variant="warning" className="absolute -top-2.5 right-3">
                      Winner
                    </Badge>
                  )}
                  <div className="text-xl font-bold mb-2">{tool.name}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{tool.score}%</div>
                  <div className="text-xs text-muted-foreground mb-3">Feature score</div>
                  <ScoreBar score={tool.score} max={100} className="mb-3" />
                  <Link
                    href={`/reviews/${tool.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent hover:bg-muted-bg h-9 px-4 text-xs font-medium transition-all duration-200 mt-1"
                  >
                    Read full review <ArrowRight size={12} />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            <InfoCard icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18M7 16l4-8 4 4 4-6" />
              </svg>
            } value={cmp.features.length.toString()} title="Features Compared" />
            <InfoCard icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            } value={cmp.winner || "Tie"} title="Overall Winner" />
            <InfoCard icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            } value={cmp.faqs.length.toString()} title="FAQs Answered" />
          </div>

          {/* Feature Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Feature Comparison</h2>
            <EditorialComparison tool1={cmp.tool1} tool2={cmp.tool2} features={cmp.features} winner={cmp.winner} category={cmp.category} slug={cmp.slug} />
          </section>

          {/* Decision Framework */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Decision Framework</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* How to choose */}
              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={16} className="text-primary" />
                    <span className="font-semibold text-sm">How to choose</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">1</span>
                      <span className="text-muted-foreground">Choose <strong>{cmp.tool1}</strong> if you need better {cmp.features.filter(f => f.tool1 && !f.tool2).map(f => f.name.toLowerCase()).slice(0, 2).join(" and ")}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">2</span>
                      <span className="text-muted-foreground">Choose <strong>{cmp.tool2}</strong> if {cmp.features.filter(f => f.tool2 && !f.tool1).slice(0, 1).map(f => f.name.toLowerCase() + " is critical for your workflow")}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">3</span>
                      <span className="text-muted-foreground">{cmp.winner ? `${cmp.winner} wins on overall feature coverage` : "Both tools serve different needs — evaluate based on priority features"}</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>

              {/* Bottom line callout */}
              <EditorialCallout type="key" title="Bottom Line" category={cmp.category}>
                <div className="space-y-2">
                  <p>{cmp.winner
                    ? `For most teams, ${cmp.winner} is the better choice due to superior feature coverage and value.`
                    : `Both tools excel in different areas — consider your specific requirements before choosing.`
                  }</p>
                  <div className="pt-2 border-t border-current/10">
                    <span className="text-xs font-medium">Best for: </span>
                    <span className="text-xs opacity-80">
                      {cmp.winner === cmp.tool1 ? cmp.tool1 : cmp.tool2} excels for feature-complete teams, while {cmp.winner === cmp.tool1 ? cmp.tool2 : cmp.tool1} works best for specialized needs.
                    </span>
                  </div>
                </div>
              </EditorialCallout>
            </div>
          </section>

          {/* Verdict */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Verdict</h2>
            <GlassCard glow>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} className="text-primary" />
                  <p className="text-lg font-semibold">
                    {cmp.winner ? `Best for most teams: ${cmp.winner}` : "How they compare"}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{cmp.verdict}</p>
                {cmp.winner && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Migration complexity:</span>
                    <span className="font-medium text-foreground">
                      {t1Score > t2Score ? `${cmp.tool2} → ${cmp.tool1}` : `${cmp.tool1} → ${cmp.tool2}`}
                    </span>
                    <span className="text-xs text-muted-foreground">— moderate effort</span>
                  </div>
                )}
              </div>
            </GlassCard>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
              {cmp.faqs.map((faq) => (
                <GlassCard key={faq.question}>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <RelatedContent
            items={[
              ...(cmp.relatedComparisons || []).map(s => ({ slug: s, type: "comparison" as const, title: getContentTitle("comparison", s) ?? undefined })),
              ...(cmp.relatedGuides || []).map(s => ({ slug: s, type: "guide" as const, title: getContentTitle("guide", s) ?? undefined })),
              ...(cmp.relatedPosts || []).map(s => ({ slug: s, type: "blog" as const, title: getContentTitle("blog", s) ?? undefined })),
            ]}
            title="Related Resources"
          />
        </Container>
      </article>
    </>
  )
}
