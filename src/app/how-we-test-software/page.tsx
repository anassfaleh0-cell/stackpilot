import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "How We Test Software | Hands-On Testing Process",
  description: "Our hands-on software testing process. Every tool is tested by real people in realistic workflows before we recommend it to our readers.",
  path: "/how-we-test-software",
})

export default function HowWeTestSoftwarePage() {
  const steps = [
    {
      phase: "Selection",
      steps: [
        "Identify categories where readers are actively evaluating tools based on search trends, reader surveys, and incoming questions",
        "Compile a shortlist of 10-15 tools based on market share, community traction, and analyst reports",
        "Narrow to 5-8 tools prioritized for end-to-end testing based on reader interest and market significance",
        "Document selection criteria and ensure no vendor relationships influence inclusion or exclusion",
      ],
    },
    {
      phase: "Hands-On Testing (2 weeks minimum)",
      steps: [
        "Each tool is tested by at least two team members independently",
        "Testers use the tool in realistic workflows specific to its category",
        "For PM tools: run a real project from kickoff to retrospective",
        "For AI tools: build a complete feature across multiple files",
        "For analytics platforms: connect real data sources and build dashboards",
        "Setup friction, learning curve, performance, and output quality are documented throughout",
      ],
    },
    {
      phase: "Evaluation & Scoring",
      steps: [
        "Each tool is scored across five equally weighted dimensions on a 1-5 scale",
        "Features: breadth, depth, and innovation of capabilities",
        "Ease of Use: onboarding time, interface clarity, feature discoverability",
        "Support: response times, documentation quality, community resources",
        "Value: pricing relative to feature set and market alternatives",
        "Performance: speed, reliability, uptime, and scalability under load",
      ],
    },
    {
      phase: "Verification",
      steps: [
        "Second team member independently replicates the testing workflow",
        "Discrepancies are resolved through consensus discussion",
        "User reviews from G2, Capterra, and TrustRadius are aggregated to validate findings",
        "Significant deviations from market consensus trigger additional investigation",
      ],
    },
    {
      phase: "Publication & Maintenance",
      steps: [
        "Every review includes a last-reviewed date and sources",
        "Major releases trigger retesting of affected aspects within two weeks",
        "Reviews not updated in 12+ months are flagged for reverification",
        "Corrections are published transparently through our corrections process",
      ],
    },
  ]

  return (
    <>
      <ArticleSchema title="How We Test Software | Hands-On Testing Process" description="How PilotStack tests every software tool — hands-on testing by real people in realistic workflows across 5 phases from selection to publication." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/how-we-test-software`} keywords={["software testing", "hands-on review", "product evaluation", "testing methodology", "review process"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "How We Test Software", href: "/how-we-test-software" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "How We Test Software" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Testing Process</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">How We Test Software</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack tests every software tool through a rigorous 5-phase process: Selection, Hands-On Testing (minimum 2 weeks), Evaluation & Scoring, Verification, and Publication & Maintenance. Each tool is tested by at least two team members using realistic workflows on standard hardware. We never accept payment for reviews.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>5-phase testing process: Selection, Hands-On Testing, Evaluation, Verification, Maintenance</li>
                <li>Minimum 2 weeks of hands-on testing per tool by 2+ independent team members</li>
                <li>Tested on standard consumer hardware (Mac + Windows, iOS + Android)</li>
                <li>Five equally weighted scoring dimensions on 1-5 scale</li>
                <li>Quarterly calibration sessions maintain scoring consistency across reviewers</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Tools selected based on reader interest, search trends, and market significance — not vendor payments</li>
                <li>Realistic workflows: real projects for PM tools, real data for analytics, complete features for AI tools</li>
                <li>Setup friction, learning curve, performance, and output quality documented throughout testing</li>
                <li>Secondary verification by independent team member; discrepancies resolved through consensus</li>
                <li>User reviews from G2, Capterra, and TrustRadius aggregated to validate findings</li>
                <li>Major releases trigger retesting of affected aspects within 2 weeks</li>
                <li>Reviews not updated in 12+ months flagged for reverification</li>
                <li>No vendor previews, no payment for coverage, no AI-generated content without human oversight</li>
              </ul>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Every tool on PilotStack is tested by real people in realistic workflows. We do not rely on vendor demos, specification sheets, or marketing materials. Here is exactly how we test.
              </p>

              {steps.map((phase, i) => (
                <div key={phase.phase} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="text-primary mr-2">Phase {i + 1}:</span>
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

              <h2>Testing Equipment and Environment</h2>
              <p>All testing is conducted on standard consumer-grade hardware and internet connections to simulate real-world conditions. We test on both Mac and Windows environments, and test mobile apps on iOS and Android devices where applicable.</p>

              <h2>Scoring Calibration</h2>
              <p>To ensure consistency across reviewers and categories, we conduct quarterly calibration sessions where team members independently score the same tool using our rubric. Results are compared and scoring guidelines are refined to maintain alignment.</p>

              <h2>What We Do Not Do</h2>
              <ul>
                <li>We do not accept payment for reviews or ratings</li>
                <li>We do not allow vendors to preview or approve reviews before publication</li>
                <li>We do not accept review copies or premium access in exchange for coverage</li>
                <li>We do not use AI-generated content without human editorial oversight and original testing</li>
                <li>We do not publish reviews based solely on vendor demos or specification sheets</li>
              </ul>

              <p className="text-sm text-muted-foreground-foreground mt-8">For detailed methodology including our scoring rubric, see our <a href="/methodology">Review Methodology</a> page.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
