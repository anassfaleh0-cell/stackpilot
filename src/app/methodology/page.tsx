import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Review Methodology | Evidence, Scoring & Editorial Standards",
  description: "How PilotStack evaluates software, handles sources and corrections, and audits older ratings and review-count figures for verifiable provenance.",
  path: "/methodology",
  ogType: "article",
})

const stages = [
  {
    title: "Selection & Scoping",
    body: "We select software topics based on practical buyer needs. Review pages discuss product fit, pricing considerations, feature availability, integrations, administration, and limitations. Some older records contain numeric scores or review counts whose source trail is still being audited; those figures should not be treated as independently verified until their provenance is documented. We do not accept payment to include or exclude a tool from our coverage.",
  },
  {
    title: "Evidence & Sourcing",
    body: "We prefer primary vendor documentation for product capabilities and pricing, and independent sources for third-party ratings or review counts. A stored value is not proof of sourcing by itself: the source URL, date checked, and relevant context must be recorded before a numeric claim is described as verified. Where sources disagree, we explain the uncertainty or omit the claim.",
  },
  {
    title: "Scoring & Ratings",
    body: "Numeric ratings are being audited for source provenance, consistent dimensions, and reproducible calculations. A score should be displayed as verified only when the evidence and calculation can be checked. Until that audit is complete, use the written criteria and vendor-confirmed facts rather than assuming that a stored number represents independent user sentiment or observed product outcomes.",
  },
  {
    title: "Consistency & Limits",
    body: "Content may be reused across reviews, comparisons, and recommendation pages, so corrections must be checked across every place a claim appears. A figure is not verified merely because it is consistent across pages. Certification statuses, ratings, review counts, and other unsupported facts should be omitted or explicitly labelled unverified until evidence is available.",
  },
  {
    title: "Updates & Revisions",
    body: "Software changes constantly. We update pages when pricing, features, or product positioning materially change, and correct claims when readers or our own audits identify problems. A displayed date alone does not prove that every claim on a page was rechecked on that date.",
  },
]

const scoringRubric = [
  { dimension: "Features", what: "Confirm the capability in current vendor documentation and the plan being evaluated", weight: "Evidence first" },
  { dimension: "Usability", what: "Assess workflow fit with a representative task and clear acceptance criteria", weight: "Evidence first" },
  { dimension: "Pricing", what: "Check current regional pricing, billing terms, limits, and add-on costs", weight: "Evidence first" },
  { dimension: "Support", what: "Verify support channels, response commitments, and plan eligibility", weight: "Evidence first" },
  { dimension: "Security", what: "Check published controls, certifications, and scope directly with the vendor", weight: "Evidence first" },
  { dimension: "Integrations", what: "Verify required integrations and their plan or configuration limits", weight: "Evidence first" },
  { dimension: "Performance", what: "Use dated, reproducible evidence; do not infer performance from marketing copy", weight: "Evidence first" },
  { dimension: "Documentation", what: "Check current documentation coverage for the workflows you need", weight: "Evidence first" },
  { dimension: "Scalability", what: "Validate limits, administration, and cost at expected usage levels", weight: "Evidence first" },
]

export default function MethodologyPage() {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <ArticleSchema title="Review Methodology | Evidence, Scoring & Editorial Standards" description="How PilotStack evaluates software, handles sources and corrections, and audits older ratings and review-count figures for verifiable provenance." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/methodology`} keywords={["software review methodology", "scoring rubric", "editorial standards", "review transparency"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Review Methodology", href: "/methodology" },
      ]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Review Methodology" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Our Process</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">How We Review Software</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Transparency matters. Here is exactly how every page on PilotStack is built, scored, and sourced.
            </p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack evaluates software using practical buyer criteria and vendor documentation. Some older numeric scores and review-count figures are still undergoing a source audit; they should not be treated as verified unless the page provides a checkable source and calculation. We omit unsupported claims as they are identified and do not sell editorial placement in our coverage.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Buyer-relevant criteria guide reviews and comparisons</li>
                <li>Numeric scores and review counts require a documented source and reproducible calculation</li>
                <li>A displayed update date does not mean every claim was rechecked</li>
                <li>Unsupported claims are corrected, qualified, or omitted</li>
                <li>No vendor payments, previews, or influence on ratings or rankings</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>We cover tools readers actively evaluate — no paid placements</li>
                <li>Consistent data is useful, but consistency alone does not prove a claim is sourced</li>
                <li>Scores are not presented as independent user ratings unless their provenance is documented</li>
                <li>Certification and company facts with no source should be omitted or labelled unverified</li>
                <li>Readers can report errors through the contact page</li>
                <li>Published independence policy: no vendor can pay for placement</li>
              </ul>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-muted-foreground mb-6">
                Readers reasonably want to know how tools are selected, how ratings are calculated, and how commercial relationships are handled. This page documents the process so readers can understand the context behind each score.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6">Our Five-Stage Methodology</h2>

              {stages.map((stage, i) => (
                <Card key={stage.title} className="mb-6 p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    <span className="text-primary mr-2">{i + 1}.</span>
                    {stage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{stage.body}</p>
                </Card>
              ))}

              <h2 className="text-2xl font-bold mt-12 mb-6">Scoring Rubric</h2>
              <p className="text-muted-foreground mb-4">
                The following dimensions are useful prompts for evaluating software. They are not a claim that every product has a verified numeric score; scores remain unpublished as verified until source evidence and calculation can be checked:
              </p>
              <div className="overflow-x-auto">
              <div className="border border-border rounded-xl overflow-hidden mb-8 min-w-[300px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted-bg border-b border-border">
                      <th className="text-left p-3 font-semibold">Dimension</th>
                      <th className="text-left p-3 font-semibold">What We Measure</th>
                      <th className="text-center p-3 font-semibold">Evidence Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoringRubric.map((row, i) => (
                      <tr key={row.dimension} className={i < scoringRubric.length - 1 ? "border-b border-border" : ""}>
                        <td className="p-3 font-medium">{row.dimension}</td>
                        <td className="p-3 text-muted-foreground">{row.what}</td>
                        <td className="p-3 text-center">{row.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-4">Fact-Checking & Corrections</h2>
              <p className="text-muted-foreground mb-4">
                We prioritize vendor documentation for capabilities and pricing, and independent source pages for external ratings and review counts. A source must be recorded with enough context to check the claim. If the source is missing, stale, or contradictory, we qualify or omit the claim rather than imply it is confirmed.
                When a correction is made the page&apos;s last-reviewed date is updated. Readers can report errors
                via our <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Review Team & Expertise</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack is run by a small, independent team. Editorial roles are listed on our{" "}
                <Link href="/authors" className="text-primary hover:underline">authors</Link> pages. Every page follows the
                same published rules: prioritize buyer-relevant criteria, record source details for factual claims,
                and correct unsupported statements when found. Older score and review-count data is under audit; a
                value repeated across pages is not independently verified merely because it is consistent.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Editorial Independence</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack keeps editorial decisions separate from commercial relationships. Affiliate relationships and other commercial arrangements are disclosed where applicable. Paid promotional material, if present, is kept distinct from editorial reviews and comparisons. Our methodology describes the recorded sources and criteria used for editorial pages.
              </p>
              <p className="text-muted-foreground mb-4">
                PilotStack may earn referral fees when readers click affiliate links and make purchases. These
                fees do not influence our reviews, rankings, or editorial content. Our affiliate relationships
                are disclosed in individual reviews and on our <a href="/about" className="text-primary hover:underline">about page</a>.
              </p>
              <p className="text-muted-foreground mb-4">
                If you have questions about our methodology or believe an error has been made in a review, please
                <a href="/contact" className="text-primary hover:underline"> contact us</a>. We review all
                correction requests and publish clarifications when warranted.
              </p>

              <p className="text-xs text-muted-foreground-foreground mt-8">
                Methodology last updated: July {currentYear}. We review and update this methodology annually or
                when industry standards for software reviews evolve.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}