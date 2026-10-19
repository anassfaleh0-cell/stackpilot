import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, FAQSchema, softwareApp, WebPageSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getComparison, getContentTitle, getReview, getAllComparisons } from "@/lib/content/registry"
import { stripDeadContentLinks } from "@/lib/content/link-guard"
import { formatDate } from "@/lib/utils"
import { isNoindexed } from "@/lib/noindex"
import { InternalLinks } from "@/components/content/internal-links"
import { RelatedReading } from "@/components/content/related-reading"
import { RichText } from "@/components/content/rich-text"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Target } from "lucide-react"
import { EditorialHero, EditorialCallout, GlassCard, InfoCard } from "@/components/dynamic"
import { EditorialComparison } from "@/components/editorial/editorial-comparison"
import { RelatedContent } from "@/components/dynamic-client"
import { EEATProcess } from "@/components/seo/editorial-process"
import { ScoreBar } from "@/components/brand/patterns"
import { NativeAd } from "@/components/ads"
import { getComparisonDecision } from "@/lib/content/comparison-decision"

export const dynamicParams = true
export const revalidate = 86400

export function generateStaticParams() {
  // Keep the full corpus indexable without forcing 2,000+ pages through every production build.
  // Pages are rendered on first request and cached for 24h.
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) return {}
  const readingTime = Math.max(3, Math.ceil(cmp.description.split(/\s+/).length / 200))
  const noindexed = isNoindexed("comparisons", slug)

  return {
    ...createMetadata({ title: `${cmp.tool1} vs ${cmp.tool2} (2026): Which One Wins?`, description: cmp.description, path: `/comparisons/${slug}`, ogType: "article", publishedAt: cmp.lastUpdated, updatedAt: cmp.lastUpdated, articleSection: cmp.category, readingTime }),
    robots: noindexed
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) notFound()

  // Only boolean availability fields are scoreable. Text values such as "Paid" or "Custom"
  // are descriptions, not truthy feature wins.
  const scoredFeatures = cmp.features.filter((f) => typeof f.tool1 === "boolean" && typeof f.tool2 === "boolean")
  const t1Score = scoredFeatures.filter((f) => f.tool1 === true).length
  const t2Score = scoredFeatures.filter((f) => f.tool2 === true).length
  const t1Pct = scoredFeatures.length ? Math.round((t1Score / scoredFeatures.length) * 100) : null
  const t2Pct = scoredFeatures.length ? Math.round((t2Score / scoredFeatures.length) * 100) : null

  const review1 = getReview(cmp.tool1Slug)
  const review2 = getReview(cmp.tool2Slug)
  const { categoriesDiffer, winnerLabel, hasComparableWinner } = getComparisonDecision({
    winner: cmp.winner,
    tool1: cmp.tool1,
    tool1Slug: cmp.tool1Slug,
    tool1Category: review1?.category,
    tool2: cmp.tool2,
    tool2Slug: cmp.tool2Slug,
    tool2Category: review2?.category,
  })

  const visibleFaqs = cmp.faqs.slice(0, 8)

  // Use the comparison's own recorded feature details for decision guidance.
  // These are descriptions of the source data, not independent verification or proof of superiority.
  const tool1Evidence = cmp.features.find((feature) => typeof feature.tool1Detail === "string" && feature.tool1Detail.trim())
  const tool2Evidence = cmp.features.find((feature) => typeof feature.tool2Detail === "string" && feature.tool2Detail.trim())
  const conciseEvidence = (value: unknown) => {
    const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : ""
    return text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text
  }

  const safeFeatures = cmp.features.map((f) => ({
    ...f,
    tool1Detail: f.tool1Detail ? stripDeadContentLinks(f.tool1Detail) : f.tool1Detail,
    tool2Detail: f.tool2Detail ? stripDeadContentLinks(f.tool2Detail) : f.tool2Detail,
  }))

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Comparisons", href: "/comparisons" }, { name: cmp.title, href: `/comparisons/${slug}` }]} />
      <WebPageSchema name={cmp.title} description={cmp.description} url={`${site.url}/comparisons/${slug}`} dateModified={cmp.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: [{ "@type": "ListItem", position: 1, item: softwareApp({ name: cmp.tool1, url: `${site.url}/reviews/${cmp.tool1Slug}`, category: review1?.category || cmp.category, description: review1?.tagline }) }, { "@type": "ListItem", position: 2, item: softwareApp({ name: cmp.tool2, url: `${site.url}/reviews/${cmp.tool2Slug}`, category: review2?.category || cmp.category, description: review2?.tagline }) }] }} />
      <ArticleSchema title={cmp.title} description={cmp.description} publishedAt={cmp.lastUpdated} updatedAt={cmp.lastUpdated} author="PilotStack Team" url={`${site.url}/comparisons/${slug}`} wordCount={cmp.description.split(/\s+/).length + String(cmp.verdict || "").split(/\s+/).filter(Boolean).length + cmp.features.reduce((n, f) => n + f.name.split(/\s+/).length + String(f.tool1Detail || "").split(/\s+/).filter(Boolean).length + String(f.tool2Detail || "").split(/\s+/).filter(Boolean).length, 0) + cmp.faqs.reduce((n, q) => n + q.question.split(/\s+/).length + q.answer.split(/\s+/).filter(Boolean).length, 0)} category={cmp.category} keywords={[`${cmp.tool1} vs ${cmp.tool2}`, `${cmp.tool1} comparison`, `${cmp.tool2} comparison`, cmp.category, "software comparison 2026"]} mentions={[{ name: cmp.tool1, url: `${site.url}/reviews/${cmp.tool1Slug}` }, { name: cmp.tool2, url: `${site.url}/reviews/${cmp.tool2Slug}` }]} />
      <FAQSchema questions={visibleFaqs} path={`/comparisons/${slug}`} />
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

          <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
            <p className="text-sm text-muted-foreground">{cmp.description}</p>
          </div>

          <div className="tl-dr mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">TL;DR</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
              <li>{hasComparableWinner ? `${winnerLabel} is the recorded pick in the source dataset, not a universal winner` : categoriesDiffer ? `${cmp.tool1} and ${cmp.tool2} belong to different product categories; use their linked reviews to decide whether you need one or both.` : `${cmp.tool1} vs ${cmp.tool2}: compare the evidence against your priorities`}</li>
              <li>Recorded information for {cmp.tool1}: {cmp.features.filter(f => f.tool1Detail && f.tool1 !== "Not recorded").map(f => f.name.toLowerCase()).slice(0, 2).join(", ") || "see the linked review"}</li>
              <li>Recorded information for {cmp.tool2}: {cmp.features.filter(f => f.tool2Detail && f.tool2 !== "Not recorded").map(f => f.name.toLowerCase()).slice(0, 2).join(", ") || "see the linked review"}</li>
              <li>{cmp.features.filter(f => f.tool1Detail && f.tool2Detail).length} criteria have details recorded for both tools; this does not mean their capabilities are identical</li>
              <li>Consider your specific workflow needs when choosing between them</li>
            </ul>
          </div>

          <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
              <li>Category: {cmp.category}</li>
              <li>Total features compared: {cmp.features.length}</li>
              <li>{cmp.tool1} criteria with recorded information: {cmp.features.filter(f => f.tool1 && f.tool1 !== "Not recorded").length}</li>
              <li>{cmp.tool2} criteria with recorded information: {cmp.features.filter(f => f.tool2 && f.tool2 !== "Not recorded").length}</li>
              <li>Criteria with details for both: {cmp.features.filter(f => f.tool1Detail && f.tool2Detail).length}</li>
              <li>{hasComparableWinner ? `Recorded dataset pick: ${winnerLabel}` : categoriesDiffer ? "Different product categories" : "No comparable winner recorded"}</li>
              <li>FAQs answered: {cmp.faqs.length}</li>
              <li>Last updated: {formatDate(cmp.lastUpdated)}</li>
            </ul>
          </div>

          {/* E-E-A-T metadata bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
            <span className="flex items-center gap-1">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Compiled by PilotStack Team
            </span>
            <span className="flex items-center gap-1">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
              Updated {formatDate(cmp.lastUpdated)}
            </span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we score</a>
            <span className="ml-auto text-[11px]">Editorial comparison · Based on recorded page data</span>
          </div>

          {/* Tool Compare Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              { name: cmp.tool1, slug: cmp.tool1Slug, isWinner: hasComparableWinner && winnerLabel === cmp.tool1, score: t1Pct },
              { name: cmp.tool2, slug: cmp.tool2Slug, isWinner: hasComparableWinner && winnerLabel === cmp.tool2, score: t2Pct },
            ].map((tool) => (
              <GlassCard key={tool.name} glow={tool.isWinner}>
                <div className="p-5 text-center relative">
                  {tool.isWinner && (
                    <Badge variant="warning" className="absolute -top-2.5 right-3">
                      Recorded pick
                    </Badge>
                  )}
                  <div className="text-xl font-bold mb-2">{tool.name}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{tool.score === null ? "—" : `${tool.score}%`}</div>
                  <div className="text-xs text-muted-foreground mb-3">{tool.score === null ? "No comparable availability data" : `Availability across ${scoredFeatures.length} boolean checks`}</div>
                  {tool.score !== null && <ScoreBar score={tool.score} max={100} className="mb-3" />}
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
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18M7 16l4-8 4 4 4-6" />
              </svg>
            } value={cmp.features.length.toString()} title="Features Compared" />
            <InfoCard icon={
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            } value={hasComparableWinner ? winnerLabel! : categoriesDiffer ? "Different categories" : "No single winner"} title="Comparison outcome" />
            <InfoCard icon={
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            } value={cmp.faqs.length.toString()} title="FAQs Answered" />
          </div>

          {/* Feature Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Feature Comparison</h2>
            <EditorialComparison tool1={cmp.tool1} tool2={cmp.tool2} features={safeFeatures} winner={hasComparableWinner ? winnerLabel : null} category={cmp.category} slug={cmp.slug} />
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
                      <span className="text-muted-foreground">{tool1Evidence ? <>Start by checking <strong>{cmp.tool1}</strong> on <strong>{tool1Evidence.name}</strong>: {conciseEvidence(tool1Evidence.tool1Detail)} This is recorded page data; confirm it against the vendor documentation and your plan.</> : <>Review the <strong>{cmp.tool1}</strong> details in the feature table and linked review, then verify any must-have capability with the vendor before choosing.</>}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">2</span>
                      <span className="text-muted-foreground">{tool2Evidence ? <>Start by checking <strong>{cmp.tool2}</strong> on <strong>{tool2Evidence.name}</strong>: {conciseEvidence(tool2Evidence.tool2Detail)} This is recorded page data; confirm it against the vendor documentation and your plan.</> : <>Review the <strong>{cmp.tool2}</strong> details in the feature table and linked review, then verify any must-have capability with the vendor before choosing.</>}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">3</span>
                      <span className="text-muted-foreground">{hasComparableWinner ? `${winnerLabel} is the source dataset pick; verify the underlying evidence before relying on it` : categoriesDiffer ? "These products serve different primary categories; compare their separate use cases rather than treating the dataset pick as a head-to-head winner." : "The source data does not name a comparable winner — evaluate against priority requirements"}</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>

              {/* Bottom line callout */}
              <EditorialCallout type="key" title="Bottom Line" category={cmp.category}>
                <div className="space-y-2">
                  <p>{hasComparableWinner
                    ? `${winnerLabel} is the recorded winner in the PilotStack comparison dataset. Use the feature rows and linked reviews to confirm whether that result matches your workflow.`
                    : categoriesDiffer
                      ? `${cmp.tool1} and ${cmp.tool2} are listed under different product categories in their linked reviews. They may solve different jobs, so compare the requirements you have instead of treating the recorded pick as proof that one replaces the other.`
                      : `The source data does not support a single verified overall winner. Compare the feature rows and linked reviews against your priorities.`
                  }</p>
                  <div className="pt-2 border-t border-current/10">
                    <span className="text-xs font-medium">Best for: </span>
                    <span className="text-xs opacity-80">
                      {hasComparableWinner ? `The recorded pick is ${winnerLabel}; the other option may still be a better fit where its exclusive criteria matter more.` : categoriesDiffer ? `Choose based on whether you need ${review1?.category || cmp.tool1} capabilities, ${review2?.category || cmp.tool2} capabilities, or both.` : `Both options have trade-offs; prioritize the criteria most important to your workflow.`}
                    </span>
                  </div>
                </div>
              </EditorialCallout>
            </div>
          </section>

          {/* Product context from the linked review records */}
          {(review1 || review2) && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Product context from linked reviews</h2>
              <p className="text-sm text-muted-foreground mb-6">
                These summaries come from PilotStack&apos;s linked review records, not a claim that the products were tested side by side. Confirm current features, limits, and pricing with each vendor.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { review: review1, name: cmp.tool1, href: `/reviews/${cmp.tool1Slug}` },
                  { review: review2, name: cmp.tool2, href: `/reviews/${cmp.tool2Slug}` },
                ].map(({ review, name, href }) => review ? (
                  <GlassCard key={href}>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2">{name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{review.description || review.tagline || `Read the PilotStack review of ${name} for product-specific context.`}</p>
                      <dl className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <dt className="text-xs text-muted-foreground">Category</dt>
                          <dd className="font-medium">{review.category || "Not specified"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground">Pricing record</dt>
                          <dd className="font-medium">{review.priceRange || review.pricing || "Verify with vendor"}</dd>
                        </div>
                      </dl>
                      {Array.isArray(review.pros) && review.pros.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold mb-2">Recorded strengths</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {review.pros.slice(0, 2).map((item: string) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(review.cons) && review.cons.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Recorded limitations</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {review.cons.slice(0, 2).map((item: string) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        Read full review <ArrowRight size={14} />
                      </Link>
                    </div>
                  </GlassCard>
                ) : null)}
              </div>
            </section>
          )}

          {/* Verdict */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Verdict</h2>
            <GlassCard glow>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} className="text-primary" />
                  <p className="text-lg font-semibold">
                    {hasComparableWinner ? `Recorded pick: ${winnerLabel}` : categoriesDiffer ? "Different product categories" : "How they compare"}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed"><RichText text={stripDeadContentLinks(cmp.verdict)} /></p>
                {hasComparableWinner && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Migration complexity:</span>
                    <span className="font-medium text-foreground">
                      Check the available export/import options, integration dependencies, and data fields before switching; test with a small representative dataset first.
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </section>

          {/* Ad: After verdict card */}
          <section className="mb-12">
            <Container>
              <NativeAd className="mx-auto max-w-[300px]" />
            </Container>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
              {visibleFaqs.map((faq) => (
                <GlassCard key={faq.question}>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground"><RichText text={stripDeadContentLinks(faq.answer)} /></p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <section className="mt-16 mb-8 max-w-2xl">
            <EEATProcess category={cmp.category} />
          </section>

          <InternalLinks category={cmp.category} excludeSlug={cmp.slug} />

          <RelatedReading
            title="Related Comparisons & Guides"
            excludeSlug={cmp.slug}
            comparisons={cmp.relatedComparisons}
            guides={cmp.relatedGuides}
            posts={cmp.relatedPosts}
          />

          {(() => {
            const cat = categories.find(c => c.name === cmp.category)
            if (!cat) return null
            return (
              <section className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Related Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.name !== cmp.category).slice(0, 6).map(c => (
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
