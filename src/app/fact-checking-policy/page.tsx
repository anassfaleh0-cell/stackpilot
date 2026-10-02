import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Fact-Checking Policy",
  description: "PilotStack's fact-checking process ensures every review, comparison, and guide meets rigorous accuracy standards before publication.",
  path: "/fact-checking-policy",
})

export default function FactCheckingPolicyPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Fact-Checking Policy", href: "/fact-checking-policy" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Fact-Checking Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Accuracy Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Fact-Checking Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Accuracy is the foundation of trust. PilotStack maintains a rigorous multi-stage fact-checking process for every piece of content we publish.
              </p>

              <h2>Pre-Publication Fact-Checking</h2>
              <p>Every page is checked against its sources before publication. Our fact-checking process covers:</p>
              <ul>
                <li><strong>Pricing verification:</strong> Pricing data is recorded from the vendor&apos;s official pricing page, together with the date it was read.</li>
                <li><strong>Feature claims:</strong> Feature availability is recorded from vendor documentation. Where we cannot confirm availability, the claim is left off the page.</li>
                <li><strong>Statistical claims:</strong> All statistics, market data, and numerical claims are traced to their original source. We link to primary sources whenever possible.</li>
                <li><strong>Quotes and attributions:</strong> Quotes from individuals, publications, or studies are verified against the original source.</li>
                <li><strong>Links and references:</strong> All hyperlinks are tested at the time of publication to ensure they resolve to the intended destination.</li>
              </ul>

              <h2>Source Discipline</h2>
              <p>Each figure on a page has one recorded source:</p>
              <ol>
                <li><strong>Recording:</strong> The figure and its source are recorded together — our dataset, vendor documentation, or a published pricing page.</li>
                <li><strong>Conflict handling:</strong> If two sources we hold disagree, neither value is published.</li>
                <li><strong>Unsourced facts:</strong> A fact with no source is omitted or marked unverified rather than stated as confirmed.</li>
                <li><strong>Editorial review:</strong> An editor reviews the complete page for accuracy, clarity, and completeness before publication.</li>
              </ol>
              <p>Where a reader or a later source shows a recorded figure to be wrong, the page is corrected and its last-reviewed date updated.</p>

              <h2>Post-Publication Fact-Checking</h2>
              <p>Our commitment to accuracy continues after publication:</p>
              <ul>
                <li>We monitor vendor announcements, pricing changes, and major updates for all tools in our review library</li>
                <li>Reader-reported errors are investigated within five business days</li>
                <li>Reviews are flagged for re-verification if they have not been updated in over 12 months</li>
                <li>Significant corrections are documented with the date and nature of the change</li>
              </ul>

              <h2>Transparency and Accountability</h2>
              <p>When errors are found, we correct them promptly and transparently. Our <a href="/corrections-policy">Corrections Policy</a> details our approach. We believe that transparent error correction is a core component of editorial integrity.</p>
              <p>Readers can report potential errors through our <a href="/contact">contact form</a>. We investigate every submission and respond within five business days.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about our fact-checking process, contact <strong>facts@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
