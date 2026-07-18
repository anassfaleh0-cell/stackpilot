import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Corrections Policy",
  description: "StackPilot's policy for correcting errors in published content. We are committed to transparency and accuracy in all our software research.",
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
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Despite our rigorous fact-checking process, errors can occur. When they do, we correct them promptly and transparently. This policy governs how we handle corrections.
              </p>

              <h2>Error Classification</h2>
              <p>We classify errors into three categories:</p>
              <ul>
                <li><strong>Minor errors:</strong> Typographical errors, formatting issues, broken links, or minor factual inaccuracies that do not materially affect the content's conclusions or recommendations. These are corrected silently with a note in the page source.</li>
                <li><strong>Significant errors:</strong> Factual inaccuracies that could affect a reader's understanding or decision-making — including incorrect pricing data, feature claims, or performance metrics. These are corrected with a visible correction note at the top of the content documenting the change.</li>
                <li><strong>Critical errors:</strong> Errors that invalidate a review's core conclusions, recommendations, or ratings. These prompt an immediate review of the entire piece, a visible correction notice, and notification to subscribers if the content was featured in our newsletter.</li>
              </ul>

              <h2>Correction Process</h2>
              <ol>
                <li><strong>Receipt:</strong> Errors may be identified by our team or reported by readers through our <a href="/contact">contact form</a>, email to corrections@stackpilot.ai, or direct messages on social media.</li>
                <li><strong>Investigation:</strong> We acknowledge receipt within two business days and begin investigation. The scope of investigation depends on the error classification.</li>
                <li><strong>Resolution:</strong> Once the error is confirmed, we make the correction and, for significant or critical errors, add a visible correction notice documenting what was changed, why, and when.</li>
                <li><strong>Communication:</strong> For significant and critical errors, we notify readers who have subscribed to correction notifications (when available). Critical errors are also noted in our newsletter.</li>
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
              <p>We maintain a log of all significant and critical corrections. Readers can request this log by emailing <strong>corrections@stackpilot.ai</strong>.</p>

              <h2>Appeals</h2>
              <p>If you believe a correction was made in error or insufficiently addressed, you may appeal by emailing <strong>editorial@stackpilot.ai</strong>. Appeals are reviewed by our editorial director, who is not involved in day-to-day correction decisions.</p>

              <h2>Preventing Future Errors</h2>
              <p>Errors are reviewed as part of our editorial process improvement. When patterns of errors emerge, we update our fact-checking checklists, reviewer training materials, and editorial workflows to prevent recurrence.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">Report an error: <strong>corrections@stackpilot.ai</strong></p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
