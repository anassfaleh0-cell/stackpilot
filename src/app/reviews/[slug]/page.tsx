import type { ContentSection } from "@/types/content"
import { getReviewPricingSummary, getVisibleReviewContent, getVisibleReviewFaqs, isPricingPlaceholder } from "@/lib/content/review-quality"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, SoftwareSchema, ReviewSchema, FAQSchema, WebPageSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getReview, getContentTitle, getAllReviews, getAllComparisons, getAllBest } from "@/lib/content/registry"
import { getEntity } from "@/lib/entities/data"
import { formatDate } from "@/lib/utils"
import { formatScore, scoreWidth, editorialPros, reviewMetaTitle, reviewMetaDescription } from "@/lib/format"
import { resolveCompanyFacts, hasCompanyFacts } from "@/lib/company-facts"
import { EntityOverview, CapabilitiesGrid, UseCasePanel, IntegrationDisplay, PricingTable, AutoComparison, SemanticLinks, EditorialHero, EditorialProsCons, EditorialFeatureMatrix, EditorialRatingVisual, EditorialSectionIllustration, EditorialExpert, GlassCard, InfoCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"
import { EditorialPricingLadder, EditorialFeatureRadar, EditorialImplementationFlow, SecurityTable, RelatedContent } from "@/components/dynamic-client"
import { InternalLinks } from "@/components/content/internal-links"
import { notFound } from "next/navigation"
import Link from "next/link"
import { isPublicAuthor } from "@/lib/authors"
import { Star, ExternalLink, ChevronRight, ArrowRight } from "lucide-react"
import { ScoreBar, TrustBadge } from "@/components/brand/patterns"
import { isNoindexed } from "@/lib/noindex"
import { BannerAd, NativeAd, InFeedAd } from "@/components/ads"

const TOTAL_REVIEWS = getAllReviews().length

// Every published slug is rendered at build time; avoid runtime filesystem fallbacks on Workers.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getAllReviews().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) return {}
  const visibleContent = getVisibleReviewContent(tool.content, tool.priceRangeVerified === true, tool.ratingsVerified === true, tool.name)
  const wordCount = visibleContent.reduce((a, s) => a + s.body.split(/\s+/).length, 0)
  const noindexed = isNoindexed("reviews", slug)
  return createMetadata({
    title: tool.seoTitle || reviewMetaTitle(tool.name),
    description:
      tool.seoDescription ||
      reviewMetaDescription(tool.name, tool.tagline, tool.category),
    path: `/reviews/${tool.slug}`,
    ogType: "article",
    publishedAt: tool.contentPublished,
    updatedAt: tool.contentModified,
    articleSection: tool.category,
    readingTime: Math.max(3, Math.ceil(wordCount / 200)),
    noIndex: noindexed,
  })
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) notFound()

  // Entity records contain useful leads but many legacy entries lack page-level verification.
  // Render entity facts only when the review explicitly marks the underlying profile as verified.
  const entity = tool.companyFactsVerified === true && tool.featuresVerified === true && tool.priceRangeVerified === true
    ? getEntity(slug)
    : null
  const companyFacts = resolveCompanyFacts(tool, entity)
  const pros = editorialPros(tool.pros)
  const filteredReviewFaqs = getVisibleReviewFaqs(tool.faqs, tool.priceRangeVerified === true, tool.featuresVerified === true).slice(0, 8)
  // Never render an empty FAQ section after unsupported source questions are filtered out.
  const visibleFaqs = filteredReviewFaqs.length > 0 ? filteredReviewFaqs : [
    {
      question: `How should a team evaluate ${tool.name}?`,
      answer: `Start with one representative task from your actual workflow. Check the required capabilities, permissions, integrations, export options, and the effort needed to maintain the workflow. Record what you can confirm in a trial and what still needs vendor confirmation.`,
    },
    {
      question: `Is ${tool.name} pricing verified on this page?`,
      answer: tool.priceRangeVerified === true
        ? `This profile marks its pricing record as verified, but plan terms can change. Confirm current prices, limits, billing terms, and regional availability with ${tool.name}'s official documentation before purchasing.`
        : `Current pricing and plan entitlements are not independently verified here. Check ${tool.name}'s official pricing page for current plans, usage limits, billing terms, and regional availability.`,
    },
    {
      question: `What limitations should buyers check for ${tool.name}?`,
      answer: tool.cons.length > 0
        ? `Review the recorded limitations above, then test whether they affect your use case. Also check support boundaries, data portability, permissions, and what happens when an integration or workflow fails.`
        : `No limitation list is recorded for this profile. That does not mean there are no limitations; test your required workflow and verify support boundaries, plan restrictions, permissions, and data portability before adopting it.`,
    },
    {
      question: `Does PilotStack provide a verified score for ${tool.name}?`,
      answer: tool.ratingVerified === true && typeof tool.rating === "number"
        ? `The stored editorial score is marked verified in the current record. Review the published methodology and evidence notes before treating it as decisive for your own requirements.`
        : `A verified evidence-backed score is not currently recorded for this profile. Any legacy stored value is provisional; compare the rubric and your own workflow results rather than treating it as a third-party user rating.`,
    },
  ]
  const visibleContent = getVisibleReviewContent(tool.content, tool.priceRangeVerified === true, tool.ratingsVerified === true, tool.name)
  const pricingSummary = getReviewPricingSummary(tool.priceRange, tool.pricing, tool.priceRangeVerified === true)
  const pricingModelLabel = isPricingPlaceholder(tool.pricing) ? "Not verified" : tool.pricing || "Not recorded"

  const authorSlug = tool.author ? tool.author.trim().toLowerCase().replace(/\s+/g, "-") : ""
  const authorHref = authorSlug && isPublicAuthor(authorSlug) ? `/authors/${authorSlug}` : null

  const allReviews = getAllReviews()

  // Preserve stored editorial scores visibly with an explicit pending-verification label; only verified scores feed structured data and category rankings.
  const hasStoredEditorialRating = typeof tool.rating === "number" && Number.isFinite(tool.rating) && tool.rating > 0
  const hasEditorialRating = tool.ratingVerified === true && hasStoredEditorialRating
  const categoryRatings = Array.isArray(tool.ratings) ? tool.ratings.filter((item) => typeof item.score === "number" && Number.isFinite(item.score) && item.score > 0) : []
  const bestInCategory = allReviews
    .filter((r) => r.category === tool.category && r.ratingVerified === true && typeof r.rating === "number" && Number.isFinite(r.rating))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]
  const isBestInCategory = hasEditorialRating && bestInCategory?.slug === tool.slug

  const primaryPro = tool.pros.find((item) => typeof item === "string" && item.trim())
  const primaryCon = tool.cons.find((item) => typeof item === "string" && item.trim())
  const defaultScoreDimensions = [
    { label: "Core capabilities", weight: "20%" },
    { label: "Ease of use", weight: "15%" },
    { label: "Value for money", weight: "15%" },
    { label: "Support", weight: "10%" },
    { label: "Security and privacy", weight: "10%" },
    { label: "Integrations", weight: "10%" },
    { label: "Reliability and performance", weight: "10%" },
    { label: "Documentation", weight: "5%" },
    { label: "Scalability", weight: "5%" },
  ]
  const reviewVerdict = [
    primaryPro ? `Consider ${tool.name} when this strength matters to your workflow: ${primaryPro.replace(/\s+/g, " ").trim()}` : `Evaluate ${tool.name} against your required workflows and must-have capabilities before shortlisting it.`,
    primaryCon ? `Main trade-off to validate: ${primaryCon.replace(/\s+/g, " ").trim()}` : `Confirm the limitations, support terms, and plan restrictions that matter to your team before adopting it.`,
    `Final decision: test one representative task, check current official documentation and pricing, and compare total cost with at least one realistic alternative. ${hasEditorialRating ? "The editorial score is verified against the recorded methodology." : hasStoredEditorialRating ? "Any legacy numeric score is provisional until its evidence and calculation are audited." : "No numeric product score is asserted until an evidence-backed assessment is recorded."}`,
  ].join(" ")
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Reviews", href: "/reviews" },
        { name: tool.name, href: `/reviews/${tool.slug}` },
      ]} />
      <ReviewSchema name={tool.name} description={tool.description} rating={hasEditorialRating ? tool.rating : undefined} url={`${site.url}/reviews/${tool.slug}`} datePublished={tool.contentPublished} body={tool.description} image={tool.logo ? `${site.url}${tool.logo}` : undefined} companyInfo={tool.companyFactsVerified === true ? companyFacts : undefined} />
      <SoftwareSchema name={tool.name} description={tool.tagline} category={tool.category} brand={tool.name} platforms={entity?.company?.platforms || tool.company?.deployment} url={`${site.url}/reviews/${tool.slug}`} image={tool.logo ? `${site.url}${tool.logo}` : undefined} offers={tool.priceRangeVerified === true && entity?.pricing?.[0]?.price !== undefined && entity.pricing[0].price !== null ? { price: entity.pricing[0].price, priceCurrency: entity.pricing[0].currency || "USD", url: tool.website || undefined } : undefined} />
      <WebPageSchema name={`${tool.name} Review 2026`} description={tool.description} url={`${site.url}/reviews/${tool.slug}`} dateModified={tool.contentModified} />
      <ArticleSchema title={`${tool.name} Review 2026`} description={tool.description} publishedAt={tool.contentPublished} updatedAt={tool.contentModified} author={tool.author} url={`${site.url}/reviews/${tool.slug}`} wordCount={visibleContent.reduce((a, s) => a + s.body.split(/\s+/).length, 0)} category={tool.category} keywords={[`${tool.name} review`, `${tool.name} pricing`, `${tool.name} pros and cons`, `${tool.category} software`, `${tool.name} alternatives`]} mentions={[{ name: tool.name, url: tool.website || `${site.url}/reviews/${tool.slug}` }]} />
      <FAQSchema questions={visibleFaqs} path={`/reviews/${tool.slug}`} />

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
              rating={hasEditorialRating ? tool.rating : undefined}
              className="w-full min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Identity & Trust */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="default">{tool.category}</Badge>
                {isBestInCategory && (
                  <Badge variant="success">Highest Editorial Score in Category</Badge>
                )}
                {hasStoredEditorialRating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="fill-accent text-accent" />
                    <span className="font-semibold">{formatScore(tool.rating)}</span>
                    <span className="text-muted-foreground">/ 5.0</span>
                    <span className="text-xs text-muted-foreground">{hasEditorialRating ? "(PilotStack editorial score)" : "(stored score; verification pending)"}</span>
                  </div>
                )}
              </div>
              {hasStoredEditorialRating && (
                <p className="text-xs text-muted-foreground mb-3">This is a PilotStack editorial score; this is PilotStack's assessment, not a third-party review aggregate. {hasEditorialRating ? "The score has been verified against the site's current editorial record." : "The stored score is shown for transparency but has not been independently revalidated; use the criteria and methodology below before relying on it."}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Profile maintained by {authorHref ? <Link href={authorHref} className="text-primary hover:underline">{tool.author}</Link> : tool.author}
                </span>
                <span className="flex items-center gap-1">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
                  Published {formatDate(tool.contentPublished)}
                </span>
                <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we score</a>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">{tool.description}</p>

              <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
                <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
                <p className="text-sm text-muted-foreground">{tool.tagline}</p>
              </div>

              <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
                <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                  {hasStoredEditorialRating && <li>Editorial rating: {formatScore(tool.rating)}/5 (PilotStack editorial score; {hasEditorialRating ? "verified editorial record" : "stored value, verification pending"}; not a third-party review aggregate).</li>}
                  <li>Pricing: {pricingSummary}</li>
                  <li>Best for: {pros[0]?.toLowerCase().startsWith("best") ? pros[0] : tool.featuresVerified === true && tool.features.some((feature) => feature.available) ? `Recorded strengths include ${tool.features.filter((feature) => feature.available).slice(0, 2).map((feature) => feature.name.toLowerCase()).join(" and ")}; confirm current availability with the vendor.` : `Evaluate ${tool.name} against your workflow requirements and verify current capabilities with the vendor.`}</li>
                  <li>{tool.cons.length > 0 ? `Consider alternatives if: ${tool.cons[0]}` : `No limitations are recorded in this profile; verify your requirements and the vendor's current documentation before deciding.`}</li>
                  <li>{entity?.useCases?.primary?.slice(0, 2).join(", ") ? `Common use cases: ${entity.useCases.primary.slice(0, 2).join(", ")}` : `Category: ${tool.category}`}</li>
                  {tool.alternatives.length > 0 ? (
                    <li>Alternatives: {tool.alternatives.slice(0, 3).map((altSlug) => allReviews.find((r) => r.slug === altSlug)?.name).filter(Boolean).join(", ")}</li>
                  ) : (
                    <li>Comparison section below: how {tool.name} sits against other tools</li>
                  )}
                  {categoryRatings.length > 0 && <li>Editorial rating dimensions: {categoryRatings.map((item) => item.label).join(", ")}</li>}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href={tool.website || `/reviews/${tool.slug}`}
                  target={tool.website ? "_blank" : undefined}
                  rel={tool.website ? "noopener noreferrer nofollow" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-button hover:shadow-button-hover h-10 px-6 text-sm font-medium transition-all duration-200"
                >
                  {tool.website ? "Visit Official Website" : "Review Details"} <ExternalLink size={14} />
                </a>
                <Link
                  href={`/comparisons`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200"
                >
                  Compare alternatives <ChevronRight size={14} />
                </Link>
                <span className="trust-badge text-xs">Editorial review · Recorded data</span>
              </div>

              {/* Pros & Cons */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Pros &amp; Cons</h2>
                <EditorialProsCons pros={pros} cons={tool.cons} slug={tool.slug} />
              </section>

              {/* External reviews / social proof */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Third-Party Reviews</h2>
                <p className="text-sm text-muted-foreground mb-4">Check current, independent user feedback on G2, Capterra, and TrustRadius before deciding. Third-party review totals and scores change over time and should be verified on the source platforms.</p>
                <div className="flex flex-wrap gap-3">
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(`site:g2.com/products ${tool.name} reviews`)}`} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg h-8 px-3 text-xs font-medium transition-colors">
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Find G2 reviews
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(`site:capterra.com ${tool.name} reviews`)}`} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg h-8 px-3 text-xs font-medium transition-colors">
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Find Capterra reviews
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(`site:trustradius.com ${tool.name} reviews`)}`} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted-bg h-8 px-3 text-xs font-medium transition-colors">
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                    Find TrustRadius reviews
                  </a>
                </div>
              </section>

              {/* Rating Overview */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Rating Overview</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  <InfoCard icon={<Star size={16} fill="var(--primary)" stroke="var(--primary)" />} value={hasStoredEditorialRating ? `${formatScore(tool.rating)}/5` : "Pending"} title="Editorial Score" description={hasEditorialRating ? "Verified PilotStack editorial assessment" : hasStoredEditorialRating ? "Provisional stored score; evidence audit pending" : "Assessment not yet recorded; no number is invented"} />
                  <InfoCard icon={
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  } value={tool.featuresVerified === true ? `${tool.features.filter((feature) => feature.available).length}` : "Not verified"} title="Feature Profile" description={tool.featuresVerified === true ? `Out of ${tool.features.length} recorded items` : "Feature availability has not been independently verified"} />
                  <InfoCard icon={
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  } value={pricingModelLabel} title="Pricing Model" description={tool.priceRangeVerified === true ? "Pricing model and displayed terms are marked verified" : "Current plan terms and price are not independently verified"} />
                </div>
                <div className="flex justify-center">
                  {categoryRatings.length > 0 ? <div className="w-full"><p className="text-xs text-muted-foreground mb-2">{tool.ratingsVerified === true ? "PilotStack editorial dimensions; verification status recorded." : "Provisional stored editorial dimensions; evidence audit pending. These are not third-party user ratings."}</p><EditorialRatingVisual ratings={categoryRatings} slug={tool.slug} category={tool.category} className="w-full max-w-md" /></div> : <p className="text-sm text-muted-foreground">No category rating dimensions recorded yet. Add evidence-backed category scores using the published rubric; do not fill gaps with guessed numbers.</p>}
                </div>
              </section>

              {entity && (
                <>
                  {entity.company && hasCompanyFacts(companyFacts) && (
                    <section className="mb-12 scroll-mt-24" id="company">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Company Overview</h2>
                      <p className="text-muted-foreground text-sm mb-4">These are recorded profile facts, not independently verified claims. Confirm founding, ownership, location, and customer information with current primary sources before relying on them.</p>
                      <EntityOverview entity={entity} facts={companyFacts} />
                    </section>
                  )}

                  {entity.security && (
                    <section className="mb-12 scroll-mt-24" id="security">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Security &amp; Compliance</h2>
                      <p className="text-muted-foreground text-sm mb-4">Recorded security and compliance information for {entity.name}. Verify the exact product, plan, region, certification scope, and contract terms with current vendor documentation before relying on a claim.</p>
                      <SecurityTable entity={entity} />
                    </section>
                  )}

                  {entity.capabilities && (
                    <section className="mb-12 scroll-mt-24" id="capabilities">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Capabilities</h2>
                      <p className="text-muted-foreground text-sm mb-4">Recorded feature information for {entity.name}. Verify current availability, plan limits, and integrations with vendor documentation.</p>
                      <CapabilitiesGrid entity={entity} />
                    </section>
                  )}

                  {entity.useCases && (
                    <section className="mb-12 scroll-mt-24" id="use-cases">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Use Cases &amp; Fit</h2>
                      <p className="text-muted-foreground text-sm mb-4">Recorded use cases and workflow examples for {entity.name}. Validate fit against your own requirements and current vendor documentation.</p>
                      <UseCasePanel entity={entity} />
                    </section>
                  )}

                  {entity.integrations && entity.integrations.length > 0 && (
                    <section className="mb-12 scroll-mt-24" id="integrations">
                      <h2 className="text-2xl font-bold tracking-tight mb-6">Integrations</h2>
                      <p className="text-muted-foreground text-sm mb-4">The recorded profile lists {entity.integrations.length} integrations for {entity.name}. Confirm that the specific connection, sync direction, and required plan are supported before relying on it.</p>
                      <IntegrationDisplay entity={entity} />
                    </section>
                  )}

                  {tool.priceRangeVerified === true && entity.pricing && entity.pricing.length > 0 && (
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
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707"/></svg>
                  <h2 className="text-lg font-bold">Before You Buy</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">{tool.category === "Developer Tools" ? "Start with a trial project" : tool.category === "CRM & Sales" ? "Map your pipeline first" : "Use a trial with real data"}</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.category === "Developer Tools" ? "Create a sample project with real code to test the platform end-to-end before committing to a team rollout." : tool.category === "CRM & Sales" ? "Import a subset of your actual contacts and deals into the trial — testing with sample data hides the migration pain points." : "Import real data from your current tool rather than starting from scratch in the trial. This reveals migration friction points early."}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">{tool.category === "Developer Tools" ? "Involve your team" : "Include the people who will use it"}</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.category === "Developer Tools" ? "Have at least three engineers from different skill levels use the trial independently. A tool that only your senior dev can configure creates bus-factor risk." : "Ask people in the roles that will use or administer the tool to test the same workflows independently. The admin experience can differ from the daily user experience."}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">Check the exit</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Review the data export capabilities before committing. Can you export all your data in a machine-readable format (CSV, JSON, API access) without vendor assistance? Lock-in is a real cost.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card">
                    <div className="font-semibold text-xs mb-1">Budget for setup</div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Estimate implementation effort before projecting ROI. Include internal setup labor, data migration, team training, workflow configuration, and ongoing administration.</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">This profile is a starting point for evaluation. Check the supporting details on this page and confirm current capabilities, limits, and pricing with the vendor before making a decision.</p>
              </section>

              {/* Content Sections */}
              {visibleContent.map((section, i) => {
                const diagramBody = section.type === "diagram" ? section.body : null
                const diagramKey = diagramBody === "pricing-ladder" || diagramBody === "feature-radar" || diagramBody === "implementation-flow" ? diagramBody : null
                const hasDiagramContent = diagramKey !== null

                // In-feed ad between 2nd and 3rd section (index 1 and 2) if 4+ sections
                const showInFeedAd = i === 2 && visibleContent.length >= 4

                return (
                  <>
                    {showInFeedAd && (
                      <section className="mb-12 scroll-mt-24" id="ad-in-feed">
                        <InFeedAd className="mx-auto max-w-[728px]" />
                      </section>
                    )}
                    <section key={i} className="mb-12 scroll-mt-24" id={`section-${i}`}>
                  {section.type === "diagram" ? (
                    hasDiagramContent ? (
                    <>
                      <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                      {diagramKey === "pricing-ladder" && <EditorialPricingLadder tool={tool} />}
                      {diagramKey === "feature-radar" && <EditorialFeatureRadar tool={tool} />}
                      {diagramKey === "implementation-flow" && <EditorialImplementationFlow tool={tool} />}
                    </>
                    ) : null
                  ) : (
                    <>
                      <EditorialSectionIllustration slug={tool.slug} category={tool.category} index={i} />
                      <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                      {section.type === "list" && section.items?.length ? (
                        <>
                          <p className="text-muted-foreground leading-relaxed mb-4">{section.body}</p>
                          <ul className="space-y-2">
                            {section.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
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
                  </>
                )})}

              {/* Feature Breakdown */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Feature Breakdown</h2>
                <p className="text-sm text-muted-foreground mb-3">{tool.featuresVerified === true ? "Feature profile marked verified in the editorial record." : "Recorded feature information is shown below for transparency; it has not been independently verified. Confirm availability, plan restrictions, integrations, and regional limitations with the vendor."}</p><EditorialFeatureMatrix features={tool.features} slug={tool.slug} category={tool.category} verified={tool.featuresVerified === true} />
              </section>

              {entity && (
                <section className="mb-12 scroll-mt-24" id="alternatives">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">How {tool.name} Compares</h2>
                  <p className="text-muted-foreground text-sm mb-4">Comparison cards use recorded tool profiles. Numeric ratings, pricing, feature availability, and security claims are shown only when their source status is documented; otherwise verify details directly with the vendor.</p>
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
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <h3 className="font-semibold text-sm">Editorial Verdict</h3>
                    </div>
                    {hasStoredEditorialRating ? (
                      <>
                        <div className="text-lg font-bold text-primary mb-1">{formatScore(tool.rating)}/5</div>
                        <ScoreBar score={tool.rating} className="mb-3" />
                        <p className="text-xs text-muted-foreground mb-3">{hasEditorialRating ? "Verified PilotStack editorial score." : "Legacy PilotStack editorial score; evidence and calculation are pending audit. It is not a third-party user rating."}</p>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground mb-3">Numeric editorial score: not yet evidence-scored. We do not invent a number when the underlying assessment is missing.</p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">{reviewVerdict}</p>
                    <Link href="/methodology" className="inline-flex mt-3 text-xs font-medium text-primary hover:underline">How scores are assessed <ArrowRight size={12} className="ml-1" /></Link>
                  </div>
                </GlassCard>

                                {/* Complete scorecard: existing marks stay visible with provenance; missing marks remain explicit rather than guessed. */}
                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">Editorial Scorecard</h3>
                    <p className="text-xs text-muted-foreground mb-4">Rubric weights total 100%. Any recorded dimension is labelled according to its verification status; missing dimensions are not assigned invented numbers.</p>
                    <div className="space-y-3">
                      {defaultScoreDimensions.map((dimension) => {
                        const aliases: Record<string, string[]> = {
                          "Core capabilities": ["features", "core capabilities"],
                          "Ease of use": ["ease of use", "usability"],
                          "Value for money": ["value", "value for money", "pricing"],
                          "Support": ["support", "customer support"],
                          "Security and privacy": ["security", "security and privacy", "privacy"],
                          "Integrations": ["integrations", "integration"],
                          "Reliability and performance": ["performance", "reliability", "reliability and performance"],
                          "Documentation": ["documentation", "learning resources"],
                          "Scalability": ["scalability", "enterprise readiness"],
                        }
                        const recorded = categoryRatings.find((item) => (aliases[dimension.label] || [dimension.label.toLowerCase()]).includes(item.label.toLowerCase()))
                        return (
                          <div key={dimension.label}>
                            <div className="flex items-center justify-between gap-3 text-xs mb-1">
                              <span className="text-foreground">{dimension.label}</span>
                              <span className="text-muted-foreground">{recorded ? `${formatScore(recorded.score)}/5 · ${dimension.weight} weight · ${tool.ratingsVerified === true ? "verified" : "provisional"}` : `${dimension.weight} · Not assessed`}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted-bg overflow-hidden">
                              <div className={recorded ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-muted-foreground/25"} style={{ width: recorded ? scoreWidth(recorded.score) : "0%" }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <Link href="/methodology" className="inline-flex mt-4 text-xs font-medium text-primary hover:underline">Read the scoring methodology <ArrowRight size={12} className="ml-1" /></Link>
                  </div>
                </GlassCard>

                {/* Editorial Reviewer */}
                <EditorialExpert author={tool.author} />

                {/* EEAT Process */}
                <EEATProcess category={tool.category} />

                {/* Company Info */}
                {tool.companyFactsVerified === true && (companyFacts.founded || companyFacts.headquarters || companyFacts.customers || companyFacts.employeeCount || companyFacts.pricingModel || (companyFacts.deployment && companyFacts.deployment.length > 0) || companyFacts.apiAvailable !== undefined || companyFacts.migrationComplexity) && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 text-sm">Recorded Company Details</h3>
                      <p className="text-[11px] text-muted-foreground mb-3">Company details are included only when the profile's verification status is recorded as complete. Confirm current details with the vendor before relying on them.</p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {companyFacts.founded && <p>Founded: <span className="text-foreground">{companyFacts.founded}</span></p>}
                        {companyFacts.headquarters && <p>HQ: <span className="text-foreground">{companyFacts.headquarters}</span></p>}
                        {companyFacts.customers && <p>Customers: <span className="text-foreground">{companyFacts.customers}</span></p>}
                        {companyFacts.employeeCount && <p>Employees: <span className="text-foreground">{companyFacts.employeeCount}</span></p>}
                        {companyFacts.pricingModel && <p>Pricing: <span className="text-foreground">{companyFacts.pricingModel}</span></p>}
                        {companyFacts.deployment && companyFacts.deployment.length > 0 && (
                          <p>Deployment: <span className="text-foreground">{companyFacts.deployment.join(", ")}</span></p>
                        )}
                        {companyFacts.apiAvailable !== undefined && (
                          <p>API: <span className={companyFacts.apiAvailable ? "text-success" : "text-muted-foreground"}>{companyFacts.apiAvailable ? "Available" : "Not available"}</span></p>
                        )}
                        {companyFacts.migrationComplexity && <p>Migration: <span className="text-foreground">{companyFacts.migrationComplexity}</span></p>}
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Section Navigation */}
                {visibleContent.length > 0 && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 text-sm">On this page</h3>
                      <nav className="space-y-1.5">
                        {visibleContent.map((section, i) => (
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
                              {alt.ratingVerified === true && typeof alt.rating === "number" && Number.isFinite(alt.rating) ? <span className="text-xs font-medium">{formatScore(alt.rating)}/5</span> : null}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Ad: Sidebar below verdict */}
                <div className="ad-sidebar">
                  <NativeAd className="w-full" />
                </div>
              </div>
            </aside>
          </div>

          {/* Sources & Methodology */}
          <section className="mt-16 mb-8">
            <h2 className="text-lg font-bold tracking-tight mb-3">Sources &amp; Methodology</h2>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
              <p>Review pages focus on product fit, features, pricing considerations, and limitations. A numeric score or review count is shown only when its provenance is documented; otherwise it is omitted pending verification. Pricing and feature availability can change, so confirm important details with the vendor. See our <a href="/methodology" className="text-primary hover:underline">full methodology</a> for sourcing and editorial independence.</p>
              <p>Content updated: {formatDate(tool.contentModified)} · No vendor payment or sponsorship influenced this review · We may earn affiliate commission on purchases made through links on this site.</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16 mb-16 scroll-mt-24" id="faq">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
              {visibleFaqs.map((faq) => (
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
                Pricing, plan limits, and feature availability can change; verify current details with the vendor.
              </p>
            </div>
          </section>

          {/* Ad: After FAQ section */}
          <section className="mt-16 mb-16">
            <Container>
              <BannerAd className="mx-auto max-w-[728px]" />
            </Container>
          </section>

          {entity && (
            <section className="mt-16 mb-8">
              <SemanticLinks slug={slug} />
            </section>
          )}

          <InternalLinks category={tool.category} excludeSlug={tool.slug} />
          {(() => {
            const cat = categories.find(c => c.name === tool.category)
            if (!cat) return null
            return (
              <section className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Related Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.name !== tool.category).slice(0, 6).map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </section>
            )
          })()}

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
