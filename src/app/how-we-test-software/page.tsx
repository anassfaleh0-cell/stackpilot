import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "How We Evaluate Software | PilotStack Process",
  description: "How every PilotStack page is produced: which sources we draw from, the nine recorded category scores behind each rating, what we omit when a fact has no source, and how we stay independent.",
  path: "/how-we-test-software",
})

export default function HowWeTestSoftwarePage() {
  const steps = [
    {
      phase: "Selection & Scope",
      steps: [
        "Cover categories where readers are actively evaluating options",
        "Record the same fixed set of fields for every tool: pricing model, deployment, API availability, migration complexity, security entries, integrations, and category scores",
        "Document selection criteria so no vendor relationship influences inclusion or exclusion",
        "Never accept payment to include or exclude a tool",
      ],
    },
    {
      phase: "Evidence & Sourcing",
      steps: [
        "Every figure on a page comes from a source we hold: our recorded dataset, vendor documentation, or a published pricing page",
        "Review counts, ratings and pricing are recorded as of the review date shown on the page",
        "Where two sources we hold disagree, neither value is published",
        "Certification and compliance statuses with no source are shown as unverified rather than asserted",
      ],
    },
    {
      phase: "Scoring",
      steps: [
        "Nine equally weighted category scores on a 1-5 scale: Features, Usability, Pricing, Support, Security, Integrations, Performance, Documentation, Scalability",
        "The overall rating is the mean of those nine scores, rounded to one decimal",
        "The calculation is published and checkable on any review page",
        "Ratings are not adjusted for placement, sponsorship, or commercial relationship",
      ],
    },
    {
      phase: "Consistency",
      steps: [
        "A tool's rating, review count and category scores are held once and reused everywhere that tool appears",
        "Category, comparison and related-content pages read from the same recorded values",
        "Facts we cannot source are omitted instead of being restated in a new form",
      ],
    },
    {
      phase: "Publication & Upkeep",
      steps: [
        "Every page carries a last-reviewed date",
        "Pages are revisited when pricing, features or positioning change materially",
        "Corrections are made in place and the last-reviewed date is updated",
        "Pages whose recorded figures we can no longer support are corrected or removed",
      ],
    },
  ]

  return (
    <>
      <ArticleSchema title="How We Evaluate Software | PilotStack Process" description="How every PilotStack page is produced — the sources behind each figure, the nine recorded category scores behind each rating, and what we leave out when a fact has no source." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/how-we-test-software`} keywords={["software review process", "scoring methodology", "editorial standards", "review process"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "How We Evaluate Software", href: "/how-we-test-software" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "How We Evaluate Software" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Our Process</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">How We Evaluate Software</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                Every PilotStack page runs through five stages: selection, sourcing, scoring, consistency, and upkeep. Each tool carries nine recorded category scores on a 1-5 scale, and the overall rating on a page is their mean rounded to one decimal. Figures come from sources we hold; facts without a source are omitted or marked unverified. We never accept payment for coverage.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Five stages: Selection, Evidence &amp; Sourcing, Scoring, Consistency, Publication &amp; Upkeep</li>
                <li>Nine equally weighted category scores on a 1-5 scale; overall is their mean</li>
                <li>One recorded source per figure, reused everywhere a tool appears</li>
                <li>Unsourced facts are omitted or shown as unverified — never asserted</li>
                <li>No vendor payments, previews, or influence on ratings</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Coverage is chosen on reader need, not vendor payment</li>
                <li>Ratings are arithmetic you can check on any review page</li>
                <li>Conflicting internal sources result in no published value, not a guess</li>
                <li>Certification statuses without a source read as &quot;not verified&quot;</li>
                <li>Last-reviewed date visible on every page</li>
                <li>Corrections are made in place and dated</li>
              </ul>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                This page describes how PilotStack pages are produced and scored. It is the short version of our{" "}
                <a href="/methodology">Review Methodology</a>.
              </p>

              {steps.map((phase, i) => (
                <div key={phase.phase} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="text-primary mr-2">Stage {i + 1}:</span>
                    {phase.phase}
                  </h2>
                  <ul className="space-y-2">
                    {phase.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <h2>What We Do Not Do</h2>
              <ul>
                <li>We do not accept payment for reviews, ratings or placement</li>
                <li>We do not allow vendors to preview or approve pages before publication</li>
                <li>We do not accept review copies or premium access in exchange for coverage</li>
                <li>We do not publish a figure we cannot tie to a source we hold</li>
                <li>We do not present an unverified certification or company fact as confirmed</li>
              </ul>

              <p className="text-sm text-muted-foreground-foreground mt-8">For the full scoring rubric and sourcing rules, see our <a href="/methodology">Review Methodology</a> page.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
