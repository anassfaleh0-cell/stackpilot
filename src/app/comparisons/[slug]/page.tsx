import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, FAQSchema, softwareApp, WebPageSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getComparison, getComparisonSeoTitle, getContentTitle, getReview, getAllComparisons } from "@/lib/content/registry"
import { stripDeadContentLinks } from "@/lib/content/link-guard"
import { formatDate } from "@/lib/utils"
import { isNoindexed } from "@/lib/noindex"
import { InternalLinks } from "@/components/content/internal-links"
import { RelatedReading } from "@/components/content/related-reading"
import { RichText } from "@/components/content/rich-text"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Target } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { EditorialComparison } from "@/components/editorial/editorial-comparison"
import { RelatedContent } from "@/components/dynamic-client"
import { EEATProcess } from "@/components/seo/editorial-process"
import { ScoreBar } from "@/components/brand/patterns"
import { NativeAd } from "@/components/ads"
import { getComparisonDecision, getComparisonDisplayCopy } from "@/lib/content/comparison-decision"
import { getReviewPricingSummary, stripUnverifiedPriceClaims } from "@/lib/content/review-quality"
import { getSpecificComparisonFaqs } from "@/lib/content/comparison-presentation"

export const dynamic = "force-static"
// Vercel retains on-demand generation; Cloudflare must only serve build-time routes.
export const dynamicParams = false

export function generateStaticParams() {
  // Generate every non-draft comparison at build time so dynamicParams=false is safe
  // on both Cloudflare Workers (no request-time repository filesystem) and Vercel.
  // Keep sitemap and route generation aligned by using the same registry source.
  return getAllComparisons()
    .filter((comparison) => (comparison as typeof comparison & { publicationStatus?: string }).publicationStatus !== "draft")
    .map((comparison) => ({ slug: comparison.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) return {}
  const review1 = getReview(cmp.tool1Slug)
  const review2 = getReview(cmp.tool2Slug)
  const displayCopy = getComparisonDisplayCopy({
    tool1: cmp.tool1,
    tool2: cmp.tool2,
    tool1Category: review1?.category,
    tool2Category: review2?.category,
    winnerVerified: cmp.winnerVerified === true,
    decisionGuide: cmp.decisionGuide === true,
    description: cmp.description,
    verdict: cmp.verdict,
  })
  const sameCategory = Boolean(review1?.category && review2?.category && review1.category === review2.category)
  const readingTime = Math.max(3, Math.ceil(displayCopy.description.trim().split(" ").filter(Boolean).length / 200))
  const noindexed = isNoindexed("comparisons", slug)

  return {
    ...createMetadata({ title: getComparisonSeoTitle(slug, cmp.tool1, cmp.tool2, cmp.winnerVerified === true && sameCategory), description: displayCopy.description, path: `/comparisons/${slug}`, ogType: "article", publishedAt: cmp.lastUpdated, updatedAt: cmp.lastUpdated, articleSection: cmp.category, readingTime }),
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
  const displayCopy = getComparisonDisplayCopy({
    tool1: cmp.tool1,
    tool2: cmp.tool2,
    tool1Category: review1?.category,
    tool2Category: review2?.category,
    winnerVerified: cmp.winnerVerified === true,
    decisionGuide: cmp.decisionGuide === true,
    description: cmp.description,
    verdict: cmp.verdict,
  })
  const { categoriesDiffer, winnerLabel, provisionalWinnerLabel, hasComparableWinner } = getComparisonDecision({
    winner: cmp.winner,
    winnerVerified: cmp.winnerVerified === true,
    tool1: cmp.tool1,
    tool1Slug: cmp.tool1Slug,
    tool1Category: review1?.category,
    tool2: cmp.tool2,
    tool2Slug: cmp.tool2Slug,
    tool2Category: review2?.category,
  })
  // A verified feature-coverage leader is narrower than an overall product-quality winner.
  const featureCoverageLeader = cmp.featuresVerified === true && !categoriesDiffer && t1Pct !== null && t2Pct !== null && t1Pct !== t2Pct
    ? (t1Pct > t2Pct ? cmp.tool1 : cmp.tool2)
    : null

  // Reuse the review FAQ integrity filter so comparison FAQs do not repeat unverified pricing or templated compliance claims in HTML or FAQ schema.
  const filteredComparisonFaqs = getSpecificComparisonFaqs(cmp.faqs).slice(0, 8)
  // Filtering can remove every legacy FAQ; keep the section useful without inventing product facts.
  const visibleFaqs = filteredComparisonFaqs.length > 0 ? filteredComparisonFaqs : [
    {
      question: `How should you choose between ${cmp.tool1} and ${cmp.tool2}?`,
      answer: `Define the job you need done, list mandatory requirements, and test both options against the same representative workflow. Confirm any must-have feature in current vendor documentation and record trade-offs rather than assuming either product is universally better.`,
    },
    {
      question: `Is there a verified winner between ${cmp.tool1} and ${cmp.tool2}?`,
      answer: cmp.winnerVerified === true
        ? `The source record marks a winner, but review the stated criteria and confirm that they match your requirements before relying on that conclusion.`
        : `This page does not have an independently verified overall winner. Choose based on the workflow, requirements, evidence, and constraints that matter to your team.`,
    },
    {
      question: `How should you compare the total cost of ${cmp.tool1} and ${cmp.tool2}?`,
      answer: `Check each vendor's current official pricing, required plan tier, seat minimums, usage limits, add-ons, implementation, migration, and renewal terms. Compare the same usage scenario and keep unverified prices out of the calculation.`,
    },
    {
      question: `Can ${cmp.tool1} and ${cmp.tool2} be used together?`,
      answer: `That depends on your workflow and the integrations currently supported by each vendor. Verify native integrations, API or export options, permissions, sync direction, and failure handling before designing a combined process.`,
    },
    {
      question: `What should you test before selecting either product?`,
      answer: `Run a small pilot with representative data, everyday users, and one likely exception or failure case. Record setup effort, workarounds, output quality, admin overhead, and any unresolved vendor questions.`,
    },
  ]

  // Use the comparison's own recorded feature details for decision guidance.
  // These are descriptions of the source data, not independent verification or proof of superiority.
  const tool1Evidence = cmp.features.find((feature) => typeof feature.tool1Detail === "string" && feature.tool1Detail.trim())
  const tool2Evidence = cmp.features.find((feature) => typeof feature.tool2Detail === "string" && feature.tool2Detail.trim())
  const conciseEvidence = (value: unknown) => {
    const text = typeof value === "string" ? stripUnverifiedPriceClaims(value.replace(/\s+/g, " ").trim()) : ""
    return text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text
  }

  // Apply the same unverified-price guard to the visible comparison cells, not just
  // their explanatory detail text. Otherwise an imported raw value such as "$23-75/mo"
  // can leak into a page even when the surrounding copy correctly says pricing is unverified.
  const hasRecordedValue = (value: unknown): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value !== "string") return true
    const normalized = value.trim()
    return normalized.length > 0 && !/^(?:not recorded|not confirmed|unknown|n\/a|na|null|undefined|—|-|tbd)$/i.test(normalized)
  }

  const safeFeatures = cmp.features.map((f) => ({
    ...f,
    tool1: typeof f.tool1 === "string" ? stripUnverifiedPriceClaims(f.tool1) : f.tool1,
    tool2: typeof f.tool2 === "string" ? stripUnverifiedPriceClaims(f.tool2) : f.tool2,
    tool1Detail: f.tool1Detail ? stripUnverifiedPriceClaims(stripDeadContentLinks(f.tool1Detail)) : f.tool1Detail,
    tool2Detail: f.tool2Detail ? stripUnverifiedPriceClaims(stripDeadContentLinks(f.tool2Detail)) : f.tool2Detail,
  }))

  // Strengthen discovery for long-tail comparisons: explicit editorial links remain valid,
  // while related pages sharing either tool are linked even when legacy JSON lacks relatedComparisons.
  // Fall back to same-category comparisons only after same-tool matches; never include drafts,
  // noindexed pages, or the current page. Existing winner/score/rating fields are untouched.
  const dynamicRelatedComparisons = getAllComparisons()
    .filter((candidate) => {
      if (candidate.slug === cmp.slug) return false
      if ((candidate as typeof candidate & { publicationStatus?: string }).publicationStatus === "draft") return false
      if (isNoindexed("comparisons", candidate.slug)) return false
      const sharesTool = [candidate.tool1Slug, candidate.tool2Slug].some((tool) =>
        tool === cmp.tool1Slug || tool === cmp.tool2Slug
      )
      return sharesTool || Boolean(cmp.category && candidate.category === cmp.category)
    })
    .map((candidate) => {
      const sharesTool = [candidate.tool1Slug, candidate.tool2Slug].some((tool) =>
        tool === cmp.tool1Slug || tool === cmp.tool2Slug
      )
      return { slug: candidate.slug, score: (sharesTool ? 100 : 0) + (Boolean(cmp.category && candidate.category === cmp.category) ? 10 : 0) }
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .map((candidate) => candidate.slug)
  const relatedComparisonSlugs = [...new Set([
    ...dynamicRelatedComparisons,
    ...(Array.isArray(cmp.relatedComparisons) ? cmp.relatedComparisons : []),
  ])].filter((relatedSlug) => relatedSlug !== cmp.slug)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Comparisons", href: "/comparisons" }, { name: cmp.title, href: `/comparisons/${slug}` }]} />
      <WebPageSchema name={cmp.title} description={displayCopy.description} url={`${site.url}/comparisons/${slug}`} dateModified={cmp.lastUpdated} mainEntity={{ "@type": "ItemList", itemListElement: [{ "@type": "ListItem", position: 1, item: softwareApp({ name: cmp.tool1, url: `${site.url}/reviews/${cmp.tool1Slug}`, category: review1?.category || cmp.category, description: review1?.tagline }) }, { "@type": "ListItem", position: 2, item: softwareApp({ name: cmp.tool2, url: `${site.url}/reviews/${cmp.tool2Slug}`, category: review2?.category || cmp.category, description: review2?.tagline }) }] }} />
      {cmp.lastUpdated ? <ArticleSchema title={cmp.title} description={displayCopy.description} publishedAt={cmp.lastUpdated} updatedAt={cmp.lastUpdated} author="PilotStack Team" url={`${site.url}/comparisons/${slug}`} wordCount={displayCopy.description.split(/\s+/).length + String(displayCopy.verdict || "").split(/\s+/).filter(Boolean).length + cmp.features.reduce((n, f) => n + f.name.split(/\s+/).length + String(f.tool1Detail || "").split(/\s+/).filter(Boolean).length + String(f.tool2Detail || "").split(/\s+/).filter(Boolean).length, 0) + cmp.faqs.reduce((n, q) => n + q.question.split(/\s+/).length + q.answer.split(/\s+/).filter(Boolean).length, 0)} category={cmp.category} keywords={[`${cmp.tool1} vs ${cmp.tool2}`, `${cmp.tool1} comparison`, `${cmp.tool2} comparison`, cmp.category, "software comparison 2026"]} mentions={[{ name: cmp.tool1, url: `${site.url}/reviews/${cmp.tool1Slug}` }, { name: cmp.tool2, url: `${site.url}/reviews/${cmp.tool2Slug}` }]} /> : null}
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
              subtitle={displayCopy.description}
              category={cmp.category}
              variant="comparison"
              className="w-full min-h-[200px] sm:min-h-[240px]"
            />
          </div>

          <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
            <p className="text-sm text-muted-foreground">{displayCopy.description}</p>
          </div>

          <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
            <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
              <li>Category: {cmp.category}</li>
              <li>Total features compared: {cmp.features.length}</li>
              <li>{cmp.tool1} criteria with recorded information: {cmp.features.filter(f => hasRecordedValue(f.tool1)).length}</li>
              <li>{cmp.tool2} criteria with recorded information: {cmp.features.filter(f => hasRecordedValue(f.tool2)).length}</li>
              <li>Criteria with recorded values for both: {safeFeatures.filter(f => hasRecordedValue(f.tool1) && hasRecordedValue(f.tool2)).length}</li>
              <li>{hasComparableWinner ? `Verified recorded pick: ${winnerLabel}` : provisionalWinnerLabel ? `Provisional recorded pick (evidence pending): ${provisionalWinnerLabel}` : categoriesDiffer ? "Different product categories; no cross-category overall winner" : cmp.decisionGuide ? "Verdict: depends on use case; see Decision Framework" : "No comparable winner recorded"}</li>
              <li>FAQs answered: {visibleFaqs.length}</li>
              {cmp.lastUpdated ? <li>Last updated: {formatDate(cmp.lastUpdated)}</li> : null}
            </ul>
          </div>

          {/* E-E-A-T metadata bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
            <span className="flex items-center gap-1">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Compiled by PilotStack Team
            </span>
            {cmp.lastUpdated ? <span className="flex items-center gap-1">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
              Updated {formatDate(cmp.lastUpdated)}
            </span> : null}
            <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">How we score</a>
            <span className="ml-auto text-[11px]">Editorial comparison · Based on recorded page data</span>
          </div>

          <section aria-label="How to interpret comparison scores" className="mb-6 rounded-xl border border-border bg-muted-bg p-4">
            <h2 className="text-sm font-semibold mb-2">How to interpret these scores</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
              <li>Editorial ratings are PilotStack assessments, not third-party review aggregates. A stored rating remains provisional until its source evidence and calculation are audited.</li>
              <li>Feature-coverage percentages count only rows with recorded boolean values for both products. They describe those checks, not overall product quality.</li>
              <li>A winner is verified only when this comparison's record explicitly marks it verified. Otherwise, treat the recorded pick as provisional or choose based on your own use case.</li>
            </ul>
          </section>

          <section aria-labelledby="comparison-verdict" className="mb-8 rounded-xl border border-border bg-card p-5">
            <h2 id="comparison-verdict" className="text-lg font-bold tracking-tight mb-3">Ratings, Scores, Winner &amp; Verdict</h2>
            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              <div className="rounded-lg bg-muted-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{cmp.tool1} editorial rating</p>
                <p className="text-xl font-bold">{typeof review1?.rating === "number" && Number.isFinite(review1.rating) && review1.rating > 0 && review1.rating <= 5 ? `${review1.rating.toFixed(1)}/5` : "Not recorded"}</p>
                <p className="text-xs text-muted-foreground mt-1">{typeof review1?.rating === "number" && Number.isFinite(review1.rating) && review1.rating > 0 && review1.rating <= 5 ? review1.ratingVerified === true ? "Linked review rating is marked verified." : "Stored rating is provisional until its evidence and calculation are audited." : "No numeric rating is recorded in the linked review; no rating is inferred."}</p>
              </div>
              <div className="rounded-lg bg-muted-bg p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{cmp.tool2} editorial rating</p>
                <p className="text-xl font-bold">{typeof review2?.rating === "number" && Number.isFinite(review2.rating) && review2.rating > 0 && review2.rating <= 5 ? `${review2.rating.toFixed(1)}/5` : "Not recorded"}</p>
                <p className="text-xs text-muted-foreground mt-1">{typeof review2?.rating === "number" && Number.isFinite(review2.rating) && review2.rating > 0 && review2.rating <= 5 ? review2.ratingVerified === true ? "Linked review rating is marked verified." : "Stored rating is provisional until its evidence and calculation are audited." : "No numeric rating is recorded in the linked review; no rating is inferred."}</p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Winner status</p>
            <p className="text-sm mb-3">{hasComparableWinner ? `Verified recorded winner: ${winnerLabel}. Review the criteria below to confirm they match your requirements.` : provisionalWinnerLabel ? `Provisional recorded pick: ${provisionalWinnerLabel}. This is not independently verified and should not be treated as a proven overall winner.` : featureCoverageLeader ? `Feature-coverage leader: ${featureCoverageLeader}. This describes only the verified boolean feature checks, not overall product quality.` : "Use-case dependent — the available evidence does not establish an evidence-backed universal winner."}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Verdict</p>
            <p className="text-sm leading-relaxed">{displayCopy.verdict || "Use-case dependent: compare must-have workflows, integrations, permissions, and total cost before choosing."}</p>
          </section>

          {/* Tool Compare Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              { name: cmp.tool1, slug: cmp.tool1Slug, isWinner: (hasComparableWinner && winnerLabel === cmp.tool1) || provisionalWinnerLabel === cmp.tool1 || featureCoverageLeader === cmp.tool1, score: t1Pct },
              { name: cmp.tool2, slug: cmp.tool2Slug, isWinner: (hasComparableWinner && winnerLabel === cmp.tool2) || provisionalWinnerLabel === cmp.tool2 || featureCoverageLeader === cmp.tool2, score: t2Pct },
            ].map((tool) => (
              <GlassCard key={tool.name} glow={tool.isWinner}>
                <div className="p-5 text-center relative">
                  {tool.isWinner && (
                    <Badge variant="warning" className="absolute -top-2.5 right-3">
                      {hasComparableWinner ? "Verified pick" : provisionalWinnerLabel === tool.name ? "Provisional pick · verify evidence" : featureCoverageLeader === tool.name ? "Feature coverage leader" : "Pick"}
                    </Badge>
                  )}
                  <div className="text-xl font-bold mb-2">{tool.name}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{tool.score === null ? "—" : `${tool.score}%`}</div>
                  <div className="text-xs text-muted-foreground mb-3">{tool.score === null ? "Feature-coverage score: not verified / not available" : cmp.featuresVerified === true ? `Feature-coverage score from ${scoredFeatures.length} verified boolean checks` : `Recorded feature-coverage score from ${scoredFeatures.length} checks; verification pending`}</div>
                  {tool.score !== null && <><ScoreBar score={tool.score} max={100} className="mb-3" /><p className="text-xs text-muted-foreground">This is a calculation from recorded comparison fields, not a product-quality rating. {cmp.featuresVerified === true ? "Source status is marked verified." : "Underlying values are not independently verified."}</p></>}
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

          {/* Feature Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Feature Comparison</h2>
            <EditorialComparison tool1={cmp.tool1} tool2={cmp.tool2} features={safeFeatures} featuresVerified={cmp.featuresVerified === true} decisionGuide={cmp.decisionGuide === true} winner={hasComparableWinner ? winnerLabel : null} category={cmp.category} slug={cmp.slug} />
          </section>

          {/* Decision Framework */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Decision Framework</h2>
            <div className="grid gap-6">
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
                      <span className="text-muted-foreground">{hasComparableWinner ? `${winnerLabel} is the recorded pick. Review the supporting criteria and verify current evidence before relying on it.` : provisionalWinnerLabel ? `${provisionalWinnerLabel} is a provisional dataset pick, not an independently verified winner. Check the underlying criteria and your workflow before deciding.` : featureCoverageLeader ? `${featureCoverageLeader} has the higher count of available items across ${scoredFeatures.length} verified boolean feature checks. This is a feature-coverage result, not an overall product-quality rating.` : categoriesDiffer ? "These products serve different primary categories; compare their separate use cases rather than treating the dataset pick as a head-to-head winner." : cmp.decisionGuide ? (displayCopy.verdict || "Depends on use case: compare must-have workflows, integrations, permissions, and total cost before choosing.") : "The source data does not name a comparable winner — evaluate against priority requirements"}</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>

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
                          <dd className="font-medium">{getReviewPricingSummary(review.priceRange, review.pricing, review.priceRangeVerified === true)}</dd>
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
                    {hasComparableWinner ? `Verified recorded pick: ${winnerLabel}` : provisionalWinnerLabel ? `Provisional pick (verification pending): ${provisionalWinnerLabel}` : featureCoverageLeader ? `Feature coverage leader: ${featureCoverageLeader}` : categoriesDiffer ? "Different product categories" : "How they compare"}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed"><RichText text={stripDeadContentLinks(displayCopy.verdict)} /></p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold mb-2">Choose {cmp.tool1} if…</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool1Evidence ? conciseEvidence(tool1Evidence.tool1Detail || tool1Evidence.tool1) : `Your must-have workflow and requirements are better served by ${cmp.tool1}. Validate the relevant capabilities in current official documentation and a short pilot.`}
                    </p>
                    <Link href={`/reviews/${cmp.tool1Slug}`} className="inline-flex mt-3 text-xs font-medium text-primary hover:underline">Read {cmp.tool1} review <ArrowRight size={12} className="ml-1" /></Link>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold mb-2">Choose {cmp.tool2} if…</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool2Evidence ? conciseEvidence(tool2Evidence.tool2Detail || tool2Evidence.tool2) : `Your must-have workflow and requirements are better served by ${cmp.tool2}. Validate the relevant capabilities in current official documentation and a short pilot.`}
                    </p>
                    <Link href={`/reviews/${cmp.tool2Slug}`} className="inline-flex mt-3 text-xs font-medium text-primary hover:underline">Read {cmp.tool2} review <ArrowRight size={12} className="ml-1" /></Link>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">These are conditional fit recommendations, not a fabricated universal winner. The winner label above is verified only when the comparison evidence record is marked verified.</p>
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
            comparisons={relatedComparisonSlugs}
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
