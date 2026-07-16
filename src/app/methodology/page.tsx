import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Review Methodology",
  description: "How we test, score, and rank every tool on StackPilot. Our transparent, hands-on review process explained.",
  path: "/methodology",
})

const stages = [
  {
    title: "Selection & Scoping",
    body: "We do not review every tool. We focus on categories where our readers are actively evaluating options based on search trends, reader surveys, and questions we receive via email and social media. Within each category, we identify the top 10 to 15 tools based on market share, community traction, and analyst reports. We narrow that list to 5 to 8 tools we actually test end-to-end, prioritizing a mix of market leaders, promising challengers, and notable open-source alternatives. We never accept payment to include or exclude a tool from our reviews.",
  },
  {
    title: "Hands-On Testing",
    body: "Every tool we review is tested by at least two team members who use it in realistic workflows for a minimum of two weeks. For project management tools, we run a real project from kickoff to retrospective. For AI coding assistants, we build a small but complete feature across multiple files. For analytics platforms, we connect real data sources and build dashboards. We document setup friction, learning curve, performance under realistic data volumes, and output quality throughout the process.",
  },
  {
    title: "Scoring & Ratings",
    body: "Each tool is scored across five dimensions: Features, Ease of Use, Support, Value, and Performance. Every dimension is scored on a 1-5 scale based on a standardized rubric. Features evaluates breadth, depth, and innovation. Ease of Use considers onboarding time, interface clarity, and discoverability. Support weighs response times, documentation quality, and community resources. Value compares pricing against feature set. Performance measures speed, reliability, and uptime. The overall rating is the average of these five scores.",
  },
  {
    title: "Verification & Peer Review",
    body: "After initial testing, a second team member replicates the workflow independently to verify findings. Discrepancies are discussed and resolved through consensus. We also aggregate user reviews from verified sources, including G2, Capterra, and TrustRadius, to ensure our assessments align with broader market sentiment. If our hands-on experience significantly differs from user consensus, we investigate further and note the discrepancy in our review.",
  },
  {
    title: "Updates & Revisions",
    body: "Software changes constantly, and so do our reviews. Every review includes a last-reviewed date, and we monitor major releases, pricing changes, and feature additions for all tools in our library. When a significant update occurs, we retest the affected aspects and update the review within two weeks. Reviews of tools that have not been updated in over 12 months are flagged as needing verification and may be removed if we cannot confirm accuracy.",
  },
]

const scoringRubric = [
  { dimension: "Features", what: "Breadth, depth, and innovation of the tool's capabilities", weight: "20%" },
  { dimension: "Ease of Use", what: "Onboarding time, interface clarity, and feature discoverability", weight: "20%" },
  { dimension: "Support", what: "Response times, documentation quality, and community resources", weight: "20%" },
  { dimension: "Value", what: "Pricing relative to feature set and market alternatives", weight: "20%" },
  { dimension: "Performance", what: "Speed, reliability, uptime, and scalability under load", weight: "20%" },
]

export default function MethodologyPage() {
  return (
    <>
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
            <p className="text-lg text-muted mb-8">
              Transparency matters. Here is exactly how we test, score, and rank every tool on StackPilot.
            </p>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-muted mb-6">
                Every week we receive emails asking how we choose which tools to review and whether our ratings are
                influenced by vendor relationships. Those are fair questions, and they deserve a transparent answer.
                This page documents exactly how we evaluate software so you can trust our recommendations and
                understand the context behind every score.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6">Our Five-Stage Methodology</h2>

              {stages.map((stage, i) => (
                <Card key={stage.title} className="mb-6 p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    <span className="text-primary mr-2">{i + 1}.</span>
                    {stage.title}
                  </h3>
                  <p className="text-sm text-muted">{stage.body}</p>
                </Card>
              ))}

              <h2 className="text-2xl font-bold mt-12 mb-6">Scoring Rubric</h2>
              <p className="text-muted mb-4">
                Each tool is scored across five equally weighted dimensions on a 1-5 scale:
              </p>
              <div className="border border-border rounded-xl overflow-hidden mb-8">
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
                        <td className="p-3 text-muted">{row.what}</td>
                        <td className="p-3 text-center">{row.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-4">Editorial Independence</h2>
              <p className="text-muted mb-4">
                StackPilot operates independently. We never accept payment for reviews or rankings, and no vendor
                can influence our scores, ratings, or editorial decisions. We clearly disclose any affiliate
                relationships, sponsored content, or partnerships. Sponsored content is never included in our
                comparison reviews or treated as editorial content.
              </p>
              <p className="text-muted mb-4">
                If you have questions about our methodology or believe an error has been made in a review, please
                <a href="/contact" className="text-primary hover:underline"> contact us</a>. We review all
                correction requests and publish clarifications when warranted.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}