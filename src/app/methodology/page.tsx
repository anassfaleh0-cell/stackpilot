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
  description: "How PilotStack builds software profiles, distinguishes editorial judgments from sourced facts, handles uncertainty, and corrects unsupported claims.",
  path: "/methodology",
  ogType: "article",
})

const stages = [
  { title: "Selection & Scoping", body: "We select products based on the workflows and buying questions readers are likely to evaluate. Profiles may record pricing, deployment, integrations, capabilities, and security information, but the presence of a field does not mean it has been independently verified. We do not sell inclusion or exclusion in editorial coverage." },
  { title: "Evidence & Sourcing", body: "Some legacy records do not yet have sufficient source-level provenance for every numerical or product-specific claim. We are auditing those records and removing unsupported user-review counts, exact performance claims, and unverified certification statements. Vendor documentation and published pricing pages are preferred for current product facts; when evidence is missing or conflicting, the claim should be omitted or clearly marked unverified." },
  { title: "Editorial Scores & Ratings", body: "Some profiles include an editorial score calculated as the mean of the category scores currently recorded for that product. Available dimensions are not identical across every legacy profile, so the score is not a standardized laboratory benchmark and should not be treated as directly comparable across all products. It is not an aggregate of third-party user reviews. We do not claim hands-on testing unless a page explicitly documents the test and its scope." },
  { title: "Consistency & Limits", body: "Consistency matters, but reusing a field does not make it verified. Product facts, pricing, security claims, and scores must be interpreted with their evidence and limitations. Unsupported third-party review counts should not be presented as real, and unverified certifications or performance claims should be removed rather than repeated across pages." },
  { title: "Updates & Revisions", body: "Software changes constantly. We prioritize corrections when pricing, features, security disclosures, or product positioning change. Dates describe the latest editorial revision, not a guarantee that every vendor fact is current. If a claim cannot be supported, it should be corrected, marked as unverified, or removed." },
]

const scoringRubric = [
  { dimension: "Feature coverage", what: "Capabilities and constraints recorded for the product; verify against current vendor documentation", weight: "Contextual" },
  { dimension: "Usability and workflow fit", what: "Editorial judgment about likely fit for the stated use case; not a hands-on usability study", weight: "Contextual" },
  { dimension: "Value and pricing", what: "Plan structure and cost considerations; pricing may change and should be verified before purchase", weight: "Contextual" },
  { dimension: "Integrations and extensibility", what: "Documented integrations, APIs, and automation options where evidence is available", weight: "Contextual" },
  { dimension: "Security and administration", what: "Published controls and disclosures; unknown or unsupported claims should remain unverified", weight: "Contextual" },
]

export default function MethodologyPage() {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <ArticleSchema title="Review Methodology | How We Score Software" description="How PilotStack builds software profiles, distinguishes editorial judgments from sourced facts, and handles uncertainty." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/methodology`} keywords={["software review methodology", "scoring rubric", "editorial standards", "review transparency"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
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
              Transparency matters. This page explains our editorial approach, the limits of legacy data, and how we handle claims that still need verification.
            </p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                Some product pages include a provisional editorial score based on the dimensions recorded for that profile. It is not a third-party user-review average or a standardized hands-on benchmark, and scores may not be directly comparable when dimensions differ. We are auditing older content for unsupported claims and removing facts that cannot be substantiated. Paid placement does not determine editorial inclusion or score.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Where present, the profile score is the mean of recorded editorial dimensions; dimensions may vary by product</li>
                <li>Scores are editorial profile summaries, not external user-review counts</li>
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
                A profile may include an editorial score calculated as the mean of the dimensions currently recorded for that product. Dimensions can differ, so treat scores as a navigation aid—not a standardized cross-vendor benchmark:
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
                Our legacy corpus is being audited because not every older claim has a traceable source. Current pricing and product facts should be checked against vendor documentation; unsupported review counts, exact performance claims, and unverified certification claims are removed or marked clearly. When a correction is made, the editorial revision date is updated. Readers can report errors
                via our <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Review Team & Expertise</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack is run by a small, independent team. Editorial roles are listed on our{" "}
                <Link href="/authors" className="text-primary hover:underline">authors</Link> pages. Our editorial team is improving source provenance and correcting legacy records. Profile scores, where present, are editorial summaries—not third-party user ratings or proof of hands-on testing. Product facts should carry evidence and dates where available; repeating a field across pages is not a substitute for verification.
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
                Methodology last updated: October {currentYear}. We review and update this methodology annually or
                when industry standards for software reviews evolve.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}