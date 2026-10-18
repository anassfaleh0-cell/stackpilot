import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Review Methodology | How We Score Software",
  description: "How PilotStack's recorded software scores are calculated, what sources inform our records, how commercial relationships are handled, and what readers should independently verify.",
  path: "/methodology",
  ogType: "article",
})

const stages = [
  {
    title: "Selection & Scoping",
    body: "We do not cover every tool. Pages are organized around software categories and common buying decisions. Our structured dataset records fields such as pricing model, deployment, API availability, migration complexity, security disclosures, integrations, and category scores where those fields are available. Commercial payments do not buy inclusion or exclusion from editorial coverage.",
  },
  {
    title: "Evidence & Sourcing",
    body: "Our pages draw on structured product records, vendor documentation, and published pricing pages. A value in a record does not prove it was independently confirmed recently. We avoid presenting third-party review counts as verified when consistent source provenance is unavailable. Where available sources conflict, we publish neither value as confirmed until a defensible source resolves the disagreement. Readers should verify current prices, plan limits, and feature availability with the vendor.",
  },
  {
    title: "Scoring & Ratings",
    body: "PilotStack's editorial rubric uses nine recorded category scores: Features, Usability, Pricing, Support, Security, Integrations, Performance, Documentation, and Scalability. Each is scored on a 1-5 scale with equal weight, and the overall editorial score is their arithmetic mean rounded to one decimal place. This calculation describes our recorded assessment; it is not a third-party user-review average and does not by itself mean our publisher independently used the product in a live environment.",
  },
  {
    title: "Consistency & Limits",
    body: "Structured product values may be reused across review, category, and comparison pages to reduce inconsistencies. Their source and freshness can still vary. Third-party review counts are not shown as verified averages unless the source can be established; certification and other unsupported claims should be qualified or omitted.",
  },
  {
    title: "Updates & Revisions",
    body: "Software changes constantly. Where maintained, publication and content-update dates describe the record's dates; they do not guarantee that every product claim was rechecked on that date. When a claim becomes unsupported or outdated, we aim to correct, qualify, or omit the claim while preserving useful page content.",
  },
]

const scoringRubric = [
  { dimension: "Features", what: "What the product can do — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Usability", what: "Onboarding and day-to-day clarity — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Pricing", what: "Price relative to what is included — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Support", what: "Support channels and responsiveness — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Security", what: "Security controls and disclosures — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Integrations", what: "Integration coverage — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Performance", what: "Speed and reliability — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Documentation", what: "Help material and guides — recorded as a 1-5 score", weight: "1/9" },
  { dimension: "Scalability", what: "Behaviour as usage grows — recorded as a 1-5 score", weight: "1/9" },
]

export default function MethodologyPage() {
  return (
    <>
      <ArticleSchema title="Review Methodology | How We Score Software" description="How PilotStack's recorded software scores are calculated, what sources inform our records, and what readers should independently verify." publishedAt="2026-01-15" updatedAt="2026-10-18" author="PilotStack Team" url={`${site.url}/methodology`} keywords={["software review methodology", "scoring rubric", "editorial standards", "review transparency"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
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
              Transparency matters. This page explains our documented scoring and sourcing approach, along with its limitations.
            </p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                Our editorial score is calculated from nine recorded category scores on a 1-5 scale, averaged and rounded to one decimal. The dataset may include vendor documentation and published pricing information, but a recorded value is not proof of recent independent verification or direct product use in a live environment. Unsupported claims should be qualified or omitted. We do not sell editorial placement.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Nine equally weighted category scores on a 1-5 scale; overall = their mean, rounded to one decimal</li>
                <li>Editorial scores may be reused across relevant pages; third-party review counts are not represented as verified averages</li>
                <li>Publication and content-update dates are shown where maintained; they do not guarantee a full product re-test</li>
                <li>Unsupported facts should be qualified or omitted rather than stated as confirmed</li>
                <li>Commercial relationships are disclosed where applicable and do not buy positive scores or placement</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>We cover tools readers actively evaluate — no paid placements</li>
                <li>Structured records help keep reused values consistent, but source freshness can vary</li>
                <li>The overall score is the mean of those nine scores, rounded to one decimal; the calculation is reproducible, while the evidence behind scores still has limitations</li>
                <li>Certification and company facts with no source are shown as unverified or left out</li>
                <li>Dates are shown where maintained and describe content records, not necessarily live-product testing</li>
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
                Each review page carries nine equally weighted category scores on a 1-5 scale. The overall rating is their mean, rounded to one decimal:
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
                Our pages draw on structured records and public vendor sources. A populated field does not guarantee recent independent verification, and conflicting claims should be qualified or omitted. Certification statuses without supporting evidence should be identified as unverified. Content-update dates describe the record and do not promise a full re-test. Readers can report errors via our <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Authorship & Evidence Limits</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack uses author bylines on the site; a byline is not proof of a hands-on test unless the page explicitly describes that test. See our{" "}
                <Link href="/authors" className="text-primary hover:underline">authors</Link> pages. The published rubric explains how the overall editorial score is calculated. Product records can differ in source coverage and freshness, and the score should be considered alongside the limitations described on the page.
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
                Methodology last updated: October 18, 2026. This date reflects the revision of this methodology page, not a claim that every product record was rechecked on that date.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}