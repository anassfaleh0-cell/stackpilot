import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "How We Evaluate Software | PilotStack Process",
  description: "PilotStack explains its software evaluation criteria, evidence standards, reproducible scoring, and how source verification is handled.",
  path: "/how-we-test-software",
})

export default function HowWeTestSoftwarePage() {
  const steps = [
    {
      phase: "Selection & Scope",
      steps: [
        "Cover categories where readers are actively evaluating options",
        "Record the same fixed set of fields for every tool: pricing model, deployment, API availability, migration complexity, security entries, integrations, and category scores",
        "Document the editorial criteria used for inclusion and exclusion",
        "Do not sell inclusion or exclusion as an editorial outcome",
      ],
    },
    {
      phase: "Evidence & Sourcing",
      steps: [
        "Factual and numeric claims are treated as verified only when they are tied to a checkable source and relevant context; a stored value alone is not proof of verification",
        "Source dates and regional or plan context should be recorded when verified; a page date alone does not establish that every figure was rechecked",
        "When sources conflict, we explain the uncertainty or withhold the disputed claim until it can be resolved",
        "Certification and compliance statuses with no source are shown as unverified rather than asserted",
      ],
    },
    {
      phase: "Scoring",
      steps: [
        "The published rubric defines nine 1-5 evaluation dimensions; a stored category score is described as verified only when its inputs and calculation can be checked",
        "Where a rating is verified, its calculation should be reproducible from the documented category values and rounding rule",
        "The methodology describes the intended calculation; not every legacy rating currently has a complete, auditable source trail",
        "Ratings are based on the published scoring criteria rather than commercial placement",
      ],
    },
    {
      phase: "Consistency",
      steps: [
        "Shared records help keep reused claims consistent, but repeated values are not proof of accuracy; source provenance must be checked separately",
        "Category, comparison and related-content pages read from the same recorded values",
        "Unverified facts are omitted or clearly labeled unverified; they are not repeated as confirmed claims",
      ],
    },
    {
      phase: "Publication & Upkeep",
      steps: [
        "Some pages display publication or update dates, but a date alone does not prove that every claim was rechecked",
        "Pages are updated when material changes are identified",
        "Corrections are made in place, with relevant date fields updated where those fields are maintained",
        "Unsupported claims are corrected, qualified, or omitted while useful page URLs are retained where possible",
      ],
    },
  ]

  return (
    <>
      <ArticleSchema title="How We Evaluate Software | PilotStack Process" description="PilotStack’s software evaluation criteria, evidence standards, reproducible scoring, and approach to source verification." publishedAt="2026-01-15" updatedAt="2026-10-23" author="PilotStack Team" url={`${site.url}/how-we-test-software`} keywords={["software review process", "scoring methodology", "editorial standards", "review process"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "How We Evaluate Software", href: "/how-we-test-software" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "How We Evaluate Software" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Our Process</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">How We Evaluate Software</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 23, 2026</p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                Our published process covers selection, sourcing, scoring, consistency, and upkeep. The rubric defines nine evaluation dimensions. A stored value or page date is not proof of verification: numeric claims require a checkable source and calculation, and unsupported claims are qualified or omitted. Commercial relationships are disclosed where applicable.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Five stages: Selection, Evidence &amp; Sourcing, Scoring, Consistency, Publication &amp; Upkeep</li>
                <li>The rubric defines nine 1-5 evaluation dimensions; older ratings are verified only when their inputs and calculation are auditable</li>
                <li>Shared values are checked against source records; consistency alone does not establish accuracy</li>
                <li>Unsourced facts are omitted or labeled unverified rather than presented as confirmed</li>
                <li>Commercial relationships do not determine ratings</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Coverage is guided by reader usefulness and editorial priorities</li>
                <li>Verified ratings should have a reproducible calculation and documented inputs</li>
                <li>Conflicting sources are explained or withheld until the claim can be resolved</li>
                <li>Certification statuses without a source read as &quot;not verified&quot;</li>
                <li>A displayed date does not prove every claim was rechecked on that date</li>
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
                <li>We do not sell editorial ratings or placement</li>
                <li>We do not allow vendors to preview or approve pages before publication</li>
                <li>We do not describe access arrangements as evidence of editorial quality</li>
                <li>We do not describe a figure as verified unless its source and context can be checked</li>
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
