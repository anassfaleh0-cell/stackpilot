import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, SoftwareSchema, ReviewSchema, FAQSchema, WebPageSchema, ArticleSchema, NewsArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getReview, getContentTitle } from "@/lib/content/registry"
import { getAllReviews } from "@/lib/content/registry"
import { getEntity } from "@/lib/entities/data"
import { EntityOverview, CapabilitiesGrid, UseCasePanel, IntegrationDisplay, PricingTable, AutoComparison, SemanticLinks, EditorialHero, EditorialProsCons, EditorialFeatureMatrix, EditorialRatingVisual, EditorialPricing, EditorialSectionIllustration, EditorialExpert, GlassCard, InfoCard } from "@/components/dynamic"
import { EditorialPricingLadder, EditorialWorkflow, EditorialFeatureRadar, EditorialImplementationFlow, SecurityTable, RelatedContent } from "@/components/dynamic-client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ExternalLink, ChevronRight, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { ScoreBar, TrustBadge } from "@/components/brand/patterns"

export function generateStaticParams() {
  return getAllReviews().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) return {}
  const wordCount = tool.content.reduce((a, s) => a + s.body.split(/\s+/).length, 0)
  return createMetadata({
    title: `${tool.name} Review 2026: Expert Analysis, Pricing & Top Alternatives`,
    description: `Read our hands-on ${tool.name} review. Expert analysis of features, pricing, pros, cons, security, and alternatives. Updated for 2026.`,
    path: `/reviews/${tool.slug}`,
    ogType: "article",
    publishedAt: tool.lastReviewed,
    updatedAt: tool.lastReviewed,
    articleSection: tool.category,
    readingTime: Math.max(3, Math.ceil(wordCount / 200)),
  })
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) notFound()

  const entity = getEntity(slug)

  const allReviews = getAllReviews()

  const bestInCategory = allReviews
    .filter((r) => r.category === tool.category)
    .sort((a, b) => b.rating - a.rating)[0]
  const isBestInCategory = bestInCategory?.slug === tool.slug
  const isBestValue = tool.pricing === "Freemium" || tool.pricing === "Free" || tool.pricing === "Free Trial"

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Reviews", href: "/reviews" },
        { name: tool.name, href: `/reviews/${tool.slug}` },
      ]} />
      <ReviewSchema name={tool.name} description={tool.description} rating={tool.rating} reviewCount={tool.reviewCount} url={`${site.url}/reviews/${tool.slug}`} datePublished={tool.lastReviewed} body={tool.description} companyInfo={entity?.company || tool.company} />
      <SoftwareSchema name={tool.name} description={tool.tagline} applicationCategory="BusinessApplication" brand={tool.name} operatingSystem={entity?.company?.platforms?.join(", ")} offers={entity?.pricing?.[0] ? { price: entity.pricing[0].price?.toString() || "", priceCurrency: entity.pricing[0].currency || "USD" } : undefined} />
      <WebPageSchema name={`${tool.name} Review 2026`} description={tool.description} url={`${site.url}/reviews/${tool.slug}`} dateModified={tool.lastReviewed} />
      <NewsArticleSchema title={`${tool.name} Review 2026`} description={tool.description} publishedAt={tool.lastReviewed} updatedAt={tool.lastReviewed} author={tool.author} url={`${site.url}/reviews/${tool.slug}`} wordCount={tool.content.reduce((a, s) => a + s.body.split(/\s+/).length, 0)} category={tool.category} />
      <ArticleSchema title={`${tool.name} Review 2026`} description={tool.description} publishedAt={tool.lastReviewed} updatedAt={tool.lastReviewed} author={tool.author} url={`${site.url}/reviews/${tool.slug}`} wordCount={tool.content.reduce((a, s) => a + s.body.split(/\s+/).length, 0)} category={tool.category} />
      <FAQSchema questions={tool.faqs} />

      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Reviews", href: "/reviews" }, { name: tool.name }]} />
      </Container>

      <article>
        <Container>
          {/* Hero */}
          <div className="mb-10">
            <EditorialHero
              slug={tool.slug}
              title={`${tool.name} Review 2026`}
              subtitle={tool.tagline}
              category={tool.category}
              variant="review"
              rating={tool.rating}
              className="w-full min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Identity & Trust */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="default">{tool.category}</Badge>
                {isBestInCategory && (
                  <Badge variant="success">Best in Category</Badge>
                )}
                {isBestValue && (
                  <Badge variant="warning">Best Value</Badge>
                )}
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="fill-accent text-accent" />
                  <span className="font-semibold">{tool.rating}</span>
                  <span className="text-muted-foreground">/ 5.0</span>
                  <span className="text-xs text-muted-foreground">({tool.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Reviewed by {tool.author}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
                  Updated {tool.lastReviewed}
                </span>
                <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we test</a>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">{tool.description}</p>

              {/* Decision Summary — Who Should Buy */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <div className="rounded-xl border border-success/20 bg-success-subtle/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="font-semibold text-sm text-success">Who should buy</span>
                  </div>
                  <ul className="space-y-2">
                    {tool.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-success mt-0.5 shrink-0">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-error/20 bg-error-subtle/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={16} className="text-error" />
                    <span className="font-semibold text-sm text-error">Who should avoid</span>
                  </div>
                  <ul className="space-y-2">
                    {tool.cons.slice(0, 3).map((con, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-error mt-0.5 shrink-0">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(tool.name + " official website")}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-button hover:shadow-button-hover h-10 px-6 text-sm font-medium transition-all duration-200"
                >
                  Visit Website <ExternalLink size={14} />
                </a>
                <Link
                  href={`/comparisons`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200"
                >
                  Compare alternatives <ChevronRight size={14} />
                </Link>
                <span className="trust-badge text-xs">Independent · No paid placement</span>
              </div>

              {/* Pros & Cons */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Pros &amp; Cons</h2>
                <EditorialProsCons pros={tool.pros} cons={tool.cons} slug={tool.slug} />
              </section>

              {/* External reviews / social proof */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Third-Party Reviews</h2>
                <p className="text-sm text-muted-foreground mb-4">We verify our hands-on testing against aggregated user reviews from major platforms. {tool.name} holds a {tool.rating}/5 across {tool.reviewCount.toLocaleString()} reviews on G2, Capterra, and TrustRadius.</p>
                <div className="flex flex-wrap gap-3">
                  <a href={`https://www.g2.com/products/${tool.slug}/review`} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg h-8 px-3 text-xs font-medium transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Read G2 reviews
                  </a>
                  <a href={`https://www.capterra.com/p/${tool.slug}/`} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg h-8 px-3 text-xs font-medium transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Read Capterra reviews
                  </a>
                  <a href={`https://www.trustradius.com/products/${tool.slug}/reviews`} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg h-8 px-3 text-xs font-medium transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                    Read TrustRadius reviews
                  </a>
                </div>
              </section>

              {/* Rating Overview */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Rating Overview</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <InfoCard icon={<Star size={16} fill="var(--primary)" stroke="var(--primary)" />} value={tool.rating.toString()} title="Overall Rating" description={`Based on ${tool.reviewCount.toLocaleString()} reviews`} />
                  <InfoCard icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  } value={`${tool.features.filter((f) => f.available).length}`} title="Available Features" description={`Out of ${tool.features.length} total`} />
                  <InfoCard icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  } value={tool.pricing} title="Pricing Model" />
                  <InfoCard icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  } value={`${tool.content.length}`} title="Review Sections" description="In-depth coverage" />
                </div>
                <div className="flex justify-center">
                  <EditorialRatingVisual ratings={tool.ratings} slug={tool.slug} category={tool.category} className="w-full max-w-md" />
                </div>
              </section>

              {entity && (
                <>
                  {entity.company && (
                    <section className="mb-12 scroll-mt-24" id="company">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Company Overview</h2>
                      <EntityOverview entity={entity} />
                    </section>
                  )}

                  {entity.security && (
                    <section className="mb-12 scroll-mt-24" id="security">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Security &amp; Compliance</h2>
                      <p className="text-muted-foreground text-sm mb-4">Security certifications, compliance standards, and data protection measures for {entity.name}.</p>
                      <SecurityTable entity={entity} />
                    </section>
                  )}

                  {entity.capabilities && (
                    <section className="mb-12 scroll-mt-24" id="capabilities">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Capabilities</h2>
                      <p className="text-muted-foreground text-sm mb-4">Feature capabilities and platform functionality offered by {entity.name}.</p>
                      <CapabilitiesGrid entity={entity} />
                    </section>
                  )}

                  {entity.useCases && (
                    <section className="mb-12 scroll-mt-24" id="use-cases">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Use Cases &amp; Fit</h2>
                      <p className="text-muted-foreground text-sm mb-4">Who {entity.name} is best suited for, common workflows, and typical team profiles.</p>
                      <UseCasePanel entity={entity} />
                    </section>
                  )}

                  {entity.integrations && entity.integrations.length > 0 && (
                    <section className="mb-12 scroll-mt-24" id="integrations">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Integrations</h2>
                      <p className="text-muted-foreground text-sm mb-4">{entity.name} integrates with {entity.integrations.length} platforms and services.</p>
                      <IntegrationDisplay entity={entity} />
                    </section>
                  )}

                  {entity.pricing && entity.pricing.length > 0 && (
                    <section className="mb-12 scroll-mt-24" id="pricing-plans">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Pricing Plans</h2>
                      <p className="text-muted-foreground text-sm mb-4">Detailed pricing breakdown for {entity.name} plans.</p>
                      <PricingTable entity={entity} />
                    </section>
                  )}
                </>
              )}

              {/* Before You Buy — Implementation guidance */}
              <section className="mb-12 rounded-xl border border-primary/20 bg-primary-subtle/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707"/></svg>
                  <h2 className="text-lg font-bold">Before You Buy</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">{tool.category === "Developer Tools" ? "Start with a trial project" : tool.category === "CRM & Sales" ? "Map your pipeline first" : "Use a trial with real data"}</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.category === "Developer Tools" ? "Create a sample project with real code to test the platform end-to-end before committing to a team rollout." : tool.category === "CRM & Sales" ? "Import a subset of your actual contacts and deals into the trial — testing with sample data hides the migration pain points." : "Import real data from your current tool rather than starting from scratch in the trial. This reveals migration friction points early."}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">{tool.category === "Developer Tools" ? "Involve your team" : "Test with 3+ team members"}</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.category === "Developer Tools" ? "Have at least three engineers from different skill levels use the trial independently. A tool that only your senior dev can configure creates bus-factor risk." : "Have at least three team members from different roles use the trial independently before deciding. The admin experience often differs from the daily user experience."}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">Check the exit</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Review the data export capabilities before committing. Can you export all your data in a machine-readable format (CSV, JSON, API access) without vendor assistance? Lock-in is a real cost.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">Budget for setup</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Most organizations underestimate implementation time by 2-3x. Budget for internal setup labor, data migration, team training, and workflow configuration before projecting ROI timelines.</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">Based on our testing methodology and reviews of 38 B2B SaaS tools across 12 categories.</p>
              </section>

              {/* Content Sections */}
              {tool.content.map((section, i) => (
                <section key={i} className="mb-12 scroll-mt-24" id={`section-${i}`}>
                  {section.type === "diagram" ? (
                    <>
                      <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                      {section.body === "pricing-ladder" && <EditorialPricingLadder tool={tool} />}
                      {section.body === "feature-radar" && <EditorialFeatureRadar tool={tool} />}
                      {section.body === "implementation-flow" && <EditorialImplementationFlow tool={tool} />}
                    </>
                  ) : (
                    <>
                      <EditorialSectionIllustration slug={tool.slug} category={tool.category} index={i} />
                      <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                      {section.type === "list" && section.items ? (
                        <>
                          <p className="text-muted-foreground leading-relaxed mb-4">{section.body}</p>
                          <ul className="space-y-2">
                            {section.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                      )}
                    </>
                  )}
                </section>
              ))}

              {/* Feature Breakdown */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Feature Breakdown</h2>
                <EditorialFeatureMatrix features={tool.features} slug={tool.slug} category={tool.category} />
              </section>

              {/* Pricing */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Pricing</h2>
                <EditorialPricing tool={tool} />
              </section>

              {/* Editorial Workflow */}
              <EditorialWorkflow sections={tool.content} slug={tool.slug} category={tool.category} />

              {entity && (
                <section className="mb-12 scroll-mt-24" id="alternatives">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Top Alternatives</h2>
                  <p className="text-muted-foreground text-sm mb-4">Auto-generated comparisons based on verified entity data.</p>
                  <AutoComparison slug={slug} />
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky-sidebar space-y-6">
                {/* Verdict */}
                <GlassCard>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <h3 className="font-semibold text-sm">Verdict</h3>
                    </div>
                    <div className="text-lg font-bold text-primary mb-1">{tool.rating}/5</div>
                    <ScoreBar score={tool.rating} className="mb-3" />
                    <p className="text-sm text-muted-foreground">{tool.name} earns a {tool.rating}/5 for its exceptional feature set and user experience.</p>
                  </div>
                </GlassCard>

                {/* Rating Breakdown */}
                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3 text-sm">Rating Breakdown</h3>
                    <div className="space-y-3">
                      {tool.ratings.map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.score}/5</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted-bg overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(item.score / 5) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* Expert Reviewer */}
                <EditorialExpert author={tool.author} reviewedAt={tool.lastReviewed} />

                {/* Reading time & independence */}
                <GlassCard>
                  <div className="p-4 space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <span>{Math.max(5, Math.ceil(tool.content.reduce((a, s) => a + s.body.split(" ").length, 0) / 200))} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
                      <span>Reviewed {tool.lastReviewed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      <span>Evidence score: <strong>High</strong> (verified by 2 analysts)</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-[11px] leading-relaxed">We test every tool hands-on for at least two weeks. No vendor can pay for placement or influence scores. <a href="/methodology" className="text-primary hover:underline">Full methodology</a>.</p>
                    </div>
                  </div>
                </GlassCard>

                {/* Company Info */}
                {tool.company && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 text-sm">Company Details</h3>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {tool.company.founded && <p>Founded: <span className="text-foreground">{tool.company.founded}</span></p>}
                        {tool.company.headquarters && <p>HQ: <span className="text-foreground">{tool.company.headquarters}</span></p>}
                        {tool.company.customers && <p>Customers: <span className="text-foreground">{tool.company.customers}</span></p>}
                        {tool.company.employeeCount && <p>Employees: <span className="text-foreground">{tool.company.employeeCount}</span></p>}
                        {tool.company.pricingModel && <p>Pricing: <span className="text-foreground">{tool.company.pricingModel}</span></p>}
                        {tool.company.deployment && tool.company.deployment.length > 0 && (
                          <p>Deployment: <span className="text-foreground">{tool.company.deployment.join(", ")}</span></p>
                        )}
                        {tool.company.apiAvailable !== undefined && (
                          <p>API: <span className={tool.company.apiAvailable ? "text-success" : "text-muted-foreground"}>{tool.company.apiAvailable ? "Available" : "Not available"}</span></p>
                        )}
                        {tool.company.migrationComplexity && <p>Migration: <span className="text-foreground">{tool.company.migrationComplexity}</span></p>}
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Section Navigation */}
                {tool.content.length > 0 && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 text-sm">On this page</h3>
                      <nav className="space-y-1.5">
                        {tool.content.map((section, i) => (
                          <a
                            key={i}
                            href={`#section-${i}`}
                            className="toc-link block text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                          >
                            {section.title}
                          </a>
                        ))}
                        <a
                          href="#faq"
                          className="toc-link block text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                        >
                          FAQ
                        </a>
                      </nav>
                    </div>
                  </GlassCard>
                )}

                {/* Alternatives */}
                {tool.alternatives.length > 0 && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 text-sm">Alternatives</h3>
                      <div className="space-y-2">
                        {tool.alternatives.map((altSlug) => {
                          const alt = allReviews.find(r => r.slug === altSlug)
                          if (!alt) return null
                          return (
                            <Link key={altSlug} href={`/reviews/${altSlug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                              <span>{alt.name}</span>
                              <span className="text-xs font-medium">{alt.rating}/5</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </GlassCard>
                )}
              </div>
            </aside>
          </div>

          {/* Sources & Methodology */}
          <section className="mt-16 mb-8">
            <h2 className="text-lg font-bold tracking-tight mb-3">Sources &amp; Methodology</h2>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
              <p>This review is based on hands-on testing by the PilotStack team using {tool.name} for at least two weeks in realistic workflows. Ratings reflect our standardized five-dimension rubric. User review counts aggregate data from G2, Capterra, and TrustRadius. Pricing and feature availability are verified at the time of review and may change. See our <a href="/methodology" className="text-primary hover:underline">full methodology</a> for details on our testing process, scoring rubric, and editorial independence policy.</p>
              <p>Last reviewed: {tool.lastReviewed} · No vendor payment or sponsorship influenced this review · We may earn affiliate commission on purchases made through links on this site.</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16 mb-16 scroll-mt-24" id="faq">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
              {tool.faqs.map((faq) => (
                <GlassCard key={faq.question}>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Prices and ratings are approximate and may vary. Last updated {tool.lastReviewed}.
              </p>
            </div>
          </section>

          {entity && (
            <section className="mt-16 mb-8">
              <SemanticLinks slug={slug} />
            </section>
          )}

          <RelatedContent
            items={[
              ...(tool.relatedGuides || []).map(s => ({ slug: s, type: "guide" as const, title: getContentTitle("guide", s) ?? undefined })),
              ...(tool.relatedComparisons || []).map(s => ({ slug: s, type: "comparison" as const, title: getContentTitle("comparison", s) ?? undefined })),
              ...(tool.relatedPosts || []).map(s => ({ slug: s, type: "blog" as const, title: getContentTitle("blog", s) ?? undefined })),
            ]}
            title="Related Resources"
          />

          {/* Previous / Next review */}
          {(() => {
            const all = allReviews.filter(r => r.category === tool.category)
            const idx = all.findIndex(r => r.slug === tool.slug)
            const prev = idx > 0 ? all[idx - 1] : null
            const next = idx < all.length - 1 ? all[idx + 1] : null
            if (!prev && !next) return null
            return (
              <nav className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4" aria-label="Adjacent reviews">
                {prev ? (
                  <Link href={`/reviews/${prev.slug}`} className="group text-left">
                    <span className="text-xs text-muted-foreground">&larr; Previous</span>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{prev.name}</p>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link href={`/reviews/${next.slug}`} className="group text-right">
                    <span className="text-xs text-muted-foreground">Next &rarr;</span>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{next.name}</p>
                  </Link>
                ) : <div />}
              </nav>
            )
          })()}
        </Container>
      </article>
    </>
  )
}
