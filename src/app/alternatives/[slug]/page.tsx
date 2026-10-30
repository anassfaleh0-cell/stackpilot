import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema, FAQSchema, WebPageSchema, ArticleSchema, softwareApp } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAlternative, getAllAlternatives, getContentTitle, getReview, isContentAvailable } from "@/lib/content/registry"
import { formatDate } from "@/lib/utils"
import { getRelatedByCategory } from "@/lib/content/internal-links"
import { InternalLinks, LEGACY_RELATED_TYPES, extendedRelatedItems } from "@/components/content/internal-links"
import { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { EEATProcess } from "@/components/seo/editorial-process"
import { isNoindexed } from "@/lib/noindex"
import { REDIRECTED_ALTERNATIVE_SLUGS } from "@/lib/sitemap/redirected-content"

import type { FAQItem } from "@/types/content"

function selectionCriteriaText(criteria: unknown): string {
  if (typeof criteria === "string") return criteria
  if (criteria && typeof criteria === "object") {
    const item = criteria as { factor?: unknown; importance?: unknown; description?: unknown }
    const factor = typeof item.factor === "string" ? item.factor : ""
    const importance = typeof item.importance === "string" ? item.importance : ""
    const description = typeof item.description === "string" ? item.description : ""
    const label = [factor, importance ? `Importance: ${importance}` : ""].filter(Boolean).join(" — ")
    return [label, description].filter(Boolean).join(": ")
  }
  return String(criteria ?? "")
}

function isBoilerplateAlternativeCopy(value: string): boolean {
  return /leading .* platform offering competitive features|strong market presence\. here are the top alternatives worth considering|when evaluating alternatives, consider these key factors|each offers different strengths depending on your needs|common reasons include pricing, feature gaps|several alternatives offer competitive pricing|yes, some alternatives offer free tiers|check our detailed comparison for a complete pricing breakdown|most alternatives offer import tools and migration support|implementation difficulty varies|user reviews on g2 and capterra provide valuable insights|the analysis uses recorded data from real user experiences/i.test(value)
}

function alternativeDescription(item: { slug: string; description: string }): string {
  const review = getReview(item.slug)
  if (review && isBoilerplateAlternativeCopy(item.description)) {
    return review.description
  }
  return item.description
}

function buildDecisionFaqs(toolName: string, category: string, toolDescription: string): FAQItem[] {
  return [
    {
      question: `When should I consider an alternative to ${toolName}?`,
      answer: `Start with the workflow gap you need to solve. ${toolDescription} Compare shortlisted products against that specific need instead of assuming a higher rating or a longer feature list means a better fit.`,
    },
    {
      question: `How should I compare ${toolName} alternatives?`,
      answer: `Write down the tasks the team needs to complete, the integrations it depends on, the number and type of users, administration needs, accessibility requirements, and the total cost at expected usage. For ${category.toLowerCase()} tools, test the same representative workflow in each shortlisted product.`,
    },
    {
      question: `What should I verify before switching from ${toolName}?`,
      answer: `Check current vendor pricing and plan limits, data export and migration options, permissions, integrations, support terms, security documentation, and any contract or renewal conditions. Confirm these details directly with each vendor before moving production work.`,
    },
    {
      question: `Are ratings on this alternatives page verified?`,
      answer: "A rating is displayed as verified only when its source and calculation can be checked. Where that evidence is unavailable, compare the published criteria and confirm current product details directly with the vendor.",
    },
  ]
}

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  // Pre-render the complete published route inventory; Cloudflare Workers must
  // never fall back to filesystem-backed on-demand route rendering.

  // Content is read from committed JSON files. Prerender the corpus so Workers never need
  // repository filesystem access for on-demand route rendering.
  return getAllAlternatives()
    .filter((item) => (item as typeof item & { publicationStatus?: string }).publicationStatus !== "draft" && !REDIRECTED_ALTERNATIVE_SLUGS.has(item.slug))
    .map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const alt = getAlternative(slug)
  if (!alt) return {}
  const noindexed = isNoindexed("alternatives", slug)
  // Count only actual publicly available review targets, not stale imported references.
  const availableCount = (alt.alternatives || []).filter((item) => isContentAvailable("review", item.slug)).length
  // The shared helper owns title truncation so long titles are not cut mid-word.
  return createMetadata({ title: alt.title, description: `Compare ${availableCount} alternatives to ${alt.toolName} by workflow fit, integrations, migration needs, and current vendor terms. Verify capabilities and pricing directly with vendors.`, path: `/alternatives/${alt.slug}`, ogType: "article", publishedAt: alt.lastUpdated, updatedAt: alt.lastUpdated, articleSection: alt.category, noIndex: noindexed })
}

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const alt = getAlternative(slug)
  if (!alt) notFound()

  const originalToolReview = getReview(alt.toolSlug)
  const visibleAlternatives = (alt.alternatives || [])
    .filter((item) => isContentAvailable("review", item.slug))
    .map((item) => ({ ...item, description: alternativeDescription(item) }))
  const pageDescription = `Compare ${visibleAlternatives.length} alternatives to ${alt.toolName} by workflow fit, feature requirements, integrations, migration needs, and current vendor terms. Ratings and prices are shown as verified only when supporting evidence can be checked.`
  const authoredFaqs = (alt.faqs || []).filter((faq) => !isBoilerplateAlternativeCopy(faq.answer) && !isBoilerplateAlternativeCopy(faq.question))
  const visibleFaqs = authoredFaqs.length >= 3
    ? authoredFaqs
    : buildDecisionFaqs(alt.toolName, alt.category, originalToolReview?.description || `${alt.toolName} is listed in the ${alt.category.toLowerCase()} category. Check the vendor's current product documentation for its exact capabilities.`)
  const visibleSections = (alt.sections || []).map((section) => {
    if (!section.body.trim()) {
      return {
        ...section,
        body: `For ${alt.toolName}, evaluate this area against your actual tasks and constraints. Record the vendor source and date for material claims, test a representative workflow, and mark any detail that cannot be confirmed as unverified.`,
      }
    }
    if (isBoilerplateAlternativeCopy(section.body) && /overview/i.test(section.title)) {
      return {
        ...section,
        body: originalToolReview
          ? `${originalToolReview.description} This shortlist is a starting point: compare each candidate against the workflow you need to replace, required integrations, migration effort, and current plan limits.`
          : `Use this shortlist to compare ${alt.toolName} alternatives against the workflow you need to support, required integrations, migration effort, and current plan limits. Confirm product-specific details with the vendors.`,
      }
    }
    if (isBoilerplateAlternativeCopy(section.body)) {
      return {
        ...section,
        body: `For ${alt.toolName}, apply these criteria to the actual tasks and constraints your team has. Record the vendor source and date for material claims, and mark any detail that cannot be confirmed as unverified.`,
      }
    }
    return section
  })
  const relatedLinks = getRelatedByCategory(alt.category, alt.slug, 4)
  const relatedAlternativePages = (() => {
    const sameCategory = getAllAlternatives()
      .filter((item) => item.category === alt.category && isContentAvailable("alternative", item.slug) && !REDIRECTED_ALTERNATIVE_SLUGS.has(item.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug))
    const currentIndex = sameCategory.findIndex((item) => item.slug === alt.slug)
    if (currentIndex < 0 || sameCategory.length < 2) return []
    return Array.from({ length: Math.min(4, sameCategory.length - 1) }, (_, offset) =>
      sameCategory[(currentIndex + offset + 1) % sameCategory.length],
    ).filter((item) => item.slug !== alt.slug)
  })()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Alternatives", href: "/alternatives" }, { name: alt.title, href: `/alternatives/${slug}` }]} />
      <CollectionPageSchema name={alt.title} description={pageDescription} url={`${site.url}/alternatives/${slug}`} />
      <ItemListSchema items={visibleAlternatives.map(a => ({ name: a.name, url: `${site.url}/reviews/${a.slug}` }))} url={`${site.url}/alternatives/${slug}`} />
      <WebPageSchema name={alt.title} description={pageDescription} url={`${site.url}/alternatives/${slug}`} dateModified={alt.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: visibleAlternatives.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: softwareApp({ name: a.name, url: `${site.url}/reviews/${a.slug}`, category: getReview(a.slug)?.category || alt.category, description: a.description }) })) }} />
      <ArticleSchema
        title={alt.title}
        description={pageDescription}
        publishedAt={alt.lastUpdated}
        updatedAt={alt.lastUpdated}
        author="PilotStack Team"
        url={`${site.url}/alternatives/${slug}`}
        wordCount={
          pageDescription.split(/\s+/).length +
          visibleAlternatives.reduce((n, x) => n + x.description.split(/\s+/).length, 0) +
          (alt.selectionCriteria || []).join(" ").split(/\s+/).filter(Boolean).length +
          visibleSections.reduce((n, x) => n + String(x.body || "").split(/\s+/).length + (x.items || []).join(" ").split(/\s+/).filter(Boolean).length, 0) +
          visibleFaqs.reduce((n, x) => n + x.question.split(/\s+/).length + x.answer.split(/\s+/).length, 0)
        }
        category={alt.category}
      />
      <FAQSchema questions={visibleFaqs} path={`/alternatives/${slug}`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Alternatives", href: "/alternatives" }, { name: alt.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={alt.slug} title={alt.title} subtitle={pageDescription} category={alt.category} variant="guide" className="w-full min-h-[180px] sm:min-h-[220px]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8 pb-4 border-b border-border">
            <Badge variant="default">{alt.category}</Badge>
            <span>Based on {visibleAlternatives.length} alternatives</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>Compiled by PilotStack Team</span>
            <span className="flex items-center gap-1"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>Updated {formatDate(alt.lastUpdated)}</span>
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we compare</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <section id="top-alternatives" className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Top Alternatives to {alt.toolName}</h2>
                <div className="space-y-4">
                  {visibleAlternatives.map((item) => (
                    <GlassCard key={item.slug}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <Link href={`/reviews/${item.slug}`} className="text-lg font-bold hover:text-primary transition-colors">{item.name}</Link>
                          {getReview(item.slug)?.ratingVerified === true && typeof getReview(item.slug)?.rating === "number" ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Star size={14} className="fill-accent text-accent" />
                              <span className="font-semibold">{getReview(item.slug)?.rating}</span>
                              <span className="text-muted-foreground">/5</span>
                            </div>
                          ) : <span className="text-xs text-muted-foreground">Rating not verified</span>}
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

              {(alt.selectionCriteria || []).length > 0 && (
                <section id="how-to-choose" className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">How to Choose</h2>
                  <div className="space-y-3">
                    {(alt.selectionCriteria || []).map((criteria, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{selectionCriteriaText(criteria)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {visibleSections.map((section, i) => (
                <section key={i} className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                  {section.type === "list" && section.items?.length ? (
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

              <section id="faq">
                <h2 className="text-2xl font-bold tracking-tight mb-6">FAQs</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {visibleFaqs.map((faq) => (
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
                      {visibleAlternatives.slice(0, 5).map((item) => (
                        <Link key={item.slug} href={`/reviews/${item.slug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                          <span>{item.name}</span>
                          <span className="text-xs font-medium">{getReview(item.slug)?.ratingVerified === true && typeof getReview(item.slug)?.rating === "number" ? `${getReview(item.slug)?.rating}/5` : "Rating not verified"}</span>
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
                      {(alt.selectionCriteria || []).length > 0 && <a href="#how-to-choose" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1">How to Choose</a>}
                      <a href="#faq" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1">FAQ</a>
                    </nav>
                  </div>
                </GlassCard>

                {alt.toolSlug && isContentAvailable("review", alt.toolSlug) && (
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

          <InternalLinks category={alt.category} excludeSlug={alt.slug} families={LEGACY_RELATED_TYPES} />
          
          <EnhancedRelatedContent
            title="More Resources"
            maxItems={6}
            items={extendedRelatedItems(relatedLinks)}
          />

          {relatedAlternativePages.length > 0 && (
            <section className="mt-12" aria-labelledby="related-alternative-pages">
              <h2 id="related-alternative-pages" className="text-2xl font-bold tracking-tight mb-5">More {alt.category} Alternatives</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedAlternativePages.map((related) => (
                  <Link key={related.slug} href={`/alternatives/${related.slug}`} className="rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-muted-bg transition-colors">
                    <span className="font-medium text-sm">{related.title}</span>
                    <p className="text-xs text-muted-foreground mt-1">{related.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </Container>
      </article>
    </>
  )
}
