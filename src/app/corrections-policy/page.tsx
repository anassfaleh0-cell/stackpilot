import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Corrections Policy",
  description: "PilotStack's policy for correcting errors in published content. We are committed to transparency and accuracy in all our software research.",
  path: "/corrections-policy",
})

export default function CorrectionsPolicyPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Corrections Policy", href: "/corrections-policy" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Corrections Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Transparency</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Corrections Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 22, 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Errors can occur in software information because product features, prices, and terms change. This policy explains how readers can report a possible error and how PilotStack may handle it. We do not promise a fixed response time.
              </p>

              <h2>Error Classification</h2>
              <p>We classify errors into three categories:</p>
              <ul>
                <li><strong>Minor errors:</strong> Typographical errors, formatting issues, broken links, or minor factual inaccuracies that do not materially affect the content's conclusions or recommendations. These may be corrected directly where the change does not affect a material claim or recommendation.</li>
                <li><strong>Significant errors:</strong> Factual inaccuracies that could affect a reader's understanding or decision-making — including incorrect pricing data, feature claims, or performance metrics. These should be corrected and, where the change materially affects a reader's decision, accompanied by a visible note describing the correction.</li>
                <li><strong>Critical errors:</strong> Errors that invalidate a review's core conclusions, recommendations, or ratings. These warrant priority review of the affected content and a visible notice when needed to explain a material change. We do not currently promise newsletter notifications.</li>
              </ul>

              <h2>Correction Process</h2>
              <ol>
                <li><strong>Receipt:</strong> Readers can report a possible error by emailing <a href="mailto:contact@pilotstack.online">contact@pilotstack.online</a> or using our <a href="/contact">contact page</a>. Include the affected URL, the claim in question, and a reliable source where possible.</li>
                <li><strong>Investigation:</strong> We review reports as capacity allows. Response and investigation times may vary with the issue and the evidence supplied.</li>
                <li><strong>Resolution:</strong> Once the error is confirmed, we make the correction and, for significant or critical errors, add a visible correction notice documenting what was changed, why, and when.</li>
                <li><strong>Communication:</strong> If a correction materially changes a page's conclusion, we aim to explain the change on that page. We do not currently offer a dedicated correction-notification subscription.</li>
              </ol>

              <h2>Correction Notices</h2>
              <p>Correction notices for significant and critical errors include:</p>
              <ul>
                <li>The date of the correction</li>
                <li>A description of the error</li>
                <li>A description of the correction made</li>
                <li>An acknowledgment of the reader or team member who identified the error (with their permission)</li>
              </ul>

              <h2>Correction History</h2>
              <p>We do not currently publish a comprehensive public correction log. Readers may ask about a specific correction by emailing <a href="mailto:contact@pilotstack.online">contact@pilotstack.online</a> or using our <a href="/contact">contact page</a>.</p>

              <h2>Follow-up Requests</h2>
              <p>If you believe a correction was made in error or insufficiently addressed, submit a follow-up by emailing <a href="mailto:contact@pilotstack.online">contact@pilotstack.online</a> or using our <a href="/contact">contact page</a> with the page URL and supporting evidence. We do not claim a separate editorial appeals board or independent editorial director.</p>

              <h2>Preventing Future Errors</h2>
              <p>When repeated errors are identified, we aim to improve the relevant source records, content checks, or editorial guidance to reduce recurrence.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">Report an error by emailing <a href="mailto:contact@pilotstack.online">contact@pilotstack.online</a> or using our <a href="/contact">contact page</a>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
