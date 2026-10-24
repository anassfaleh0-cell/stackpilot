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
  description: "How PilotStack evaluates software using buyer-focused criteria, source checks, reproducible scoring, and transparent corrections.",
  path: "/methodology",
  ogType: "article",
})

const stages = [
  {
    title: "Selection & Scoping",
    body: "We select software topics based on practical buyer needs. Review pages discuss product fit, pricing considerations, feature availability, integrations, administration, and limitations. Numeric scores and review counts are treated as verified only when their source trail and calculation are documented; a stored value alone does not establish independent user sentiment. PilotStack does not currently sell paid editorial placement. Affiliate links and advertising may support the publication, but they do not determine editorial ratings or rankings.",
  },
  {
    title: "Evidence & Sourcing",
    body: "We prefer primary vendor documentation for product capabilities and pricing, and independent sources for third-party ratings or review counts. A stored value is not proof of sourcing by itself: the source URL, date checked, and relevant context must be recorded before a numeric claim is described as verified. Where sources disagree, we explain the uncertainty or omit the claim.",
  },
  {
    title: "Scoring & Ratings",
    body: "PilotStack editorial scores are our own structured assessments, not third-party user ratings. They must use the published weighted rubric, cite current evidence for the dimensions scored, state the review date, and disclose whether hands-on testing was performed. Third-party ratings and review counts are separate fields and require a direct source, date checked, and actual count. We do not turn marketing claims into test results or imply that a product was hands-on tested when it was not. If evidence coverage is insufficient, we publish the review analysis and explicitly mark the editorial score as pending rather than invent a number.",
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
  { dimension: "Features", what: "Breadth and depth of documented capabilities relevant to the target use case", weight: "20%" },
  { dimension: "Usability", what: "Workflow clarity and task fit; hands-on testing must be explicitly identified when performed", weight: "15%" },
  { dimension: "Pricing", what: "Value at the stated plan, regional price, limits, billing terms, and add-on costs", weight: "15%" },
  { dimension: "Support", what: "Documented support channels, response commitments, and plan eligibility", weight: "10%" },
  { dimension: "Security", what: "Published controls, certifications, and scope; no inference from generic claims", weight: "10%" },
  { dimension: "Integrations", what: "Verified integrations and their plan, direction, and configuration limits", weight: "10%" },
  { dimension: "Performance", what: "Dated reproducible evidence; marketing claims alone do not qualify", weight: "10%" },
  { dimension: "Documentation", what: "Coverage and clarity of current technical and help documentation", weight: "5%" },
  { dimension: "Scalability", what: "Documented limits, administration, governance, and expected total cost", weight: "5%" },
]

export default function MethodologyPage() {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <ArticleSchema title="Review Methodology | Evidence, Scoring & Editorial Standards" description="How PilotStack evaluates software, documents sources, applies scoring criteria, and handles corrections and evidence limitations." publishedAt="2026-01-15" updatedAt="2026-10-23" author="PilotStack Team" url={`${site.url}/methodology`} keywords={["software review methodology", "scoring rubric", "editorial standards", "review transparency"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
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
              Transparency matters. This page explains our evidence standard, current limitations, and how we handle corrections while older records undergo source review.
            </p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack evaluates software using practical buyer criteria and vendor documentation. Numeric scores and review-count figures are treated as verified only when the page provides a checkable source and calculation. Unsupported or unverified claims should be qualified or omitted. PilotStack does not currently sell paid editorial placements. Affiliate commissions and advertising do not determine editorial scores or rankings.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Buyer-relevant criteria guide reviews and comparisons</li>
                <li>Numeric scores and review counts require a documented source and reproducible calculation</li>
                <li>A displayed update date does not mean every claim was rechecked</li>
                <li>Unsupported claims are corrected, qualified, or omitted</li>
                <li>Affiliate commissions and advertising do not determine editorial ratings or rankings</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Affiliate and advertising relationships are disclosed separately from editorial recommendations</li>
                <li>Consistent data is useful, but consistency alone does not prove a claim is sourced</li>
                <li>Editorial scores are separate from external user ratings; both require clear provenance</li>
                <li>Certification and company facts with no source should be omitted or labelled unverified</li>
                <li>Readers can report errors through the contact page</li>
                <li>Vendors cannot pay to change editorial scores or rankings</li>
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
                Editorial scoring uses the weighted dimensions below (weights total 100%). Each dimension is scored from 1 to 5 against recorded evidence; the weighted sum is converted to a score out of 5. A numeric editorial score is published only after the assessment is complete and its date, evidence, and testing status are recorded. This is separate from third-party user ratings and review counts.
              </p>
              <div className="overflow-x-auto">
              <div className="border border-border rounded-xl overflow-hidden mb-8 min-w-[300px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted-bg border-b border-border">
                      <th className="text-left p-3 font-semibold">Dimension</th>
                      <th className="text-left p-3 font-semibold">What We Measure</th>
                      <th className="text-center p-3 font-semibold">Weight</th>
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
                When a correction is made, we update the page&apos;s review date where relevant. Readers can report errors
                via our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Editorial Standards & Byline</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack publishes editorial standards for buyer-relevant criteria, source details, and corrections. Author pages identify the bylines used on the site; a byline alone does not establish that a product was tested directly or that the author has specialist credentials. Editorial roles are listed on our{" "}
                <Link href="/authors" className="text-primary hover:underline">authors</Link> pages. Our published rules set expectations for buyer-relevant criteria, source details, and corrections. Scores and review counts are not independently verified merely because a value is repeated across pages; the source and calculation must be checkable.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Editorial Independence</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack keeps editorial decisions separate from commercial relationships. Affiliate relationships and other commercial arrangements are disclosed where applicable. PilotStack does not currently sell paid editorial placement. If sponsorship or promotional content is introduced in future, it will be clearly labelled and kept separate from editorial reviews and comparisons. Our methodology describes the recorded sources and criteria used for editorial pages.
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

              <p className="text-xs text-muted-foreground mt-8">
                Methodology last updated: October 24, 2026. This date records this page revision and does not mean every product claim across the site was rechecked on that date.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}