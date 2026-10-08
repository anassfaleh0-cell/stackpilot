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
  description: "How every PilotStack page is built: the nine recorded category scores behind each rating, where our figures come from, what we leave out when we cannot source it, and how we stay independent.",
  path: "/methodology",
  ogType: "article",
})

const stages = [
  {
    title: "Selection & Scoping",
    body: "We do not review every tool. We cover categories where readers are actively evaluating options, and each tool page records the same fixed set of fields: pricing model, deployment, API availability, migration complexity, security entries, integrations, and nine category scores. We never accept payment to include or exclude a tool from our coverage.",
  },
  {
    title: "Evidence & Sourcing",
    body: "Every figure on a page comes from a source we hold: our recorded review dataset, vendor documentation, or a published pricing page. Review counts, ratings, and pricing are recorded as of the review date shown on the page. Where two sources we hold disagree — for example on a founding date or headcount — we publish neither value rather than pick one.",
  },
  {
    title: "Scoring & Ratings",
    body: "Each tool carries nine recorded category scores: Features, Usability, Pricing, Support, Security, Integrations, Performance, Documentation, and Scalability. Every category is scored on a 1-5 scale with equal weight. The overall rating shown on a page is the mean of those nine scores, rounded to one decimal place — you can check it yourself on any review page.",
  },
  {
    title: "Consistency & Limits",
    body: "A tool's rating, review count, and category scores are held once and reused everywhere that tool appears, so the same figure shows up on its review, category, and comparison pages. Certification statuses and other facts we cannot source are shown as unverified or omitted entirely instead of being stated as confirmed.",
  },
  {
    title: "Updates & Revisions",
    body: "Software changes constantly, and so do our pages. Every page carries a last-reviewed date, and we revisit pages when pricing, features, or product positioning change materially. Pages whose recorded figures we can no longer support are corrected or removed rather than left to stand.",
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
  const currentYear = new Date().getFullYear()
  return (
    <>
      <ArticleSchema title="Review Methodology | How We Score Software" description="How every PilotStack page is built — the nine recorded category scores behind each rating, where our figures come from, and what we leave out when we cannot source it." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/methodology`} keywords={["software review methodology", "scoring rubric", "editorial standards", "review transparency"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
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
                Every tool carries nine recorded category scores on a 1-5 scale. The overall rating on a review page is the mean of those nine scores, rounded to one decimal. Figures come from our recorded dataset, vendor documentation, and published pricing pages. Where we cannot source a fact, we leave it off or mark it unverified. We do not sell editorial placement in our coverage.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Nine equally weighted category scores on a 1-5 scale; overall = their mean, rounded to one decimal</li>
                <li>The same rating and review count is reused everywhere a tool appears</li>
                <li>Every page shows when it was last reviewed</li>
                <li>Facts we cannot source are omitted or marked unverified, never asserted</li>
                <li>No vendor payments, previews, or influence on ratings or rankings</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>We cover tools readers actively evaluate — no paid placements</li>
                <li>Every page draws from the same recorded fields, so figures agree across the site</li>
                <li>Ratings are arithmetic you can check on any review page</li>
                <li>Certification and company facts with no source are shown as unverified or left out</li>
                <li>Last-reviewed date visible on every page</li>
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
                Figures on a page come from a source we hold: our recorded dataset, vendor documentation, or a
                published pricing page. When two sources we hold disagree, we publish neither value rather than
                choose one, and certification statuses with no source are shown as unverified instead of asserted.
                When a correction is made the page&apos;s last-reviewed date is updated. Readers can report errors
                via our <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Review Team & Expertise</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack is run by a small, independent team. Editorial roles are listed on our{" "}
                <Link href="/authors" className="text-primary hover:underline">authors</Link> pages. Every page follows the
                same published rules: nine equally weighted category scores on a 1-5 scale, one recorded source per
                figure, and the overall rating as the mean of those nine scores. Because a single set of recorded
                figures is reused everywhere a tool appears, ratings do not drift between pages.
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