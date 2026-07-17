import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Fact-Checking Policy",
  description: "StackPilot's fact-checking process ensures every review, comparison, and guide meets rigorous accuracy standards before publication.",
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
            <p className="text-muted mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted mb-6">
                Accuracy is the foundation of trust. StackPilot maintains a rigorous multi-stage fact-checking process for every piece of content we publish.
              </p>

              <h2>Pre-Publication Fact-Checking</h2>
              <p>Every article undergoes verification before publication. Our fact-checking process covers:</p>
              <ul>
                <li><strong>Pricing verification:</strong> Pricing data is verified against the vendor's official website and, where possible, confirmed through direct inquiry with sales teams. We document the date and source of all pricing data.</li>
                <li><strong>Feature claims:</strong> Feature availability and descriptions are verified through hands-on testing. We do not rely on vendor-provided feature lists without independent verification.</li>
                <li><strong>Statistical claims:</strong> All statistics, market data, and numerical claims are traced to their original source. We link to primary sources whenever possible.</li>
                <li><strong>Quotes and attributions:</strong> Quotes from individuals, publications, or studies are verified against the original source.</li>
                <li><strong>Links and references:</strong> All hyperlinks are tested at the time of publication to ensure they resolve to the intended destination.</li>
              </ul>

              <h2>Two-Person Verification</h2>
              <p>Every review undergoes a two-person verification process before publication:</p>
              <ol>
                <li><strong>Initial research and writing:</strong> The primary reviewer conducts hands-on testing and writes the initial review.</li>
                <li><strong>Independent verification:</strong> A second team member independently replicates key aspects of the testing workflow to verify findings.</li>
                <li><strong>Review and approval:</strong> An editor reviews the complete content for accuracy, clarity, and completeness before publication.</li>
              </ol>
              <p>Discrepancies between the primary reviewer and the verifying reviewer are resolved through discussion and, if necessary, additional testing before publication.</p>

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

              <p className="text-sm text-muted-foreground mt-8">For questions about our fact-checking process, contact <strong>facts@stackpilot.ai</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
