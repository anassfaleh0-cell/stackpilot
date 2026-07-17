import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, SoftwareSchema, ReviewSchema, FAQSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getReview } from "@/lib/content/registry"
import { getAllReviews } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ExternalLink, ChevronRight, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { EditorialHero, EditorialProsCons, EditorialFeatureMatrix, EditorialRatingVisual, EditorialPricing, EditorialWorkflow, EditorialSectionIllustration, GlassCard, InfoCard } from "@/components/editorial"
import { RelatedContent } from "@/components/content/related-content"
import { ScoreBar, TrustBadge } from "@/components/brand/patterns"

export function generateStaticParams() {
  return getAllReviews().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) return {}
  return createMetadata({
    title: `${tool.name} Review 2026`,
    description: `Read our in-depth ${tool.name} review. Expert analysis, features, pricing, pros & cons, and alternatives. ${tool.tagline}`,
    path: `/reviews/${tool.slug}`,
    ogType: "article",
    publishedAt: tool.lastReviewed,
  })
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) notFound()

  const allReviews = getAllReviews()

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Reviews", href: "/reviews" },
        { name: tool.name, href: `/reviews/${tool.slug}` },
      ]} />
      <ReviewSchema name={tool.name} description={tool.description} rating={tool.rating} reviewCount={tool.reviewCount} url={`${site.url}/reviews/${tool.slug}`} />
      <SoftwareSchema name={tool.name} description={tool.tagline} applicationCategory="BusinessApplication" />
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
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="default">{tool.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="fill-accent text-accent" />
                  <span className="font-semibold">{tool.rating}</span>
                  <span className="text-muted-foreground">/ 5.0</span>
                  <span className="text-xs text-muted-foreground">({tool.reviewCount} reviews)</span>
                </div>
                <span className="text-xs text-muted-foreground">Updated {tool.lastReviewed}</span>
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
                <span className="trust-badge text-xs">Independent review</span>
              </div>

              {/* Pros & Cons */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Pros &amp; Cons</h2>
                <EditorialProsCons pros={tool.pros} cons={tool.cons} slug={tool.slug} />
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

              {/* Content Sections */}
              {tool.content.map((section, i) => (
                <section key={i} className="mb-12 scroll-mt-24" id={`section-${i}`}>
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

          <RelatedContent
            items={[
              ...(tool.relatedGuides || []).map(s => ({ slug: s, type: "guide" as const })),
              ...(tool.relatedComparisons || []).map(s => ({ slug: s, type: "comparison" as const })),
              ...(tool.relatedPosts || []).map(s => ({ slug: s, type: "blog" as const })),
            ]}
            title="Related Resources"
          />
        </Container>
      </article>
    </>
  )
}
