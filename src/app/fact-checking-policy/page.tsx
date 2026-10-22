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
            <p className="text-muted-foreground mb-8">Last updated: October 22, 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Accuracy is essential to trust. PilotStack aims to check important product and pricing claims against available sources, but coverage is not yet complete across the entire archive. Older records are being audited for source provenance, and this policy describes the standard we are working to apply consistently.
              </p>

              <h2>Pre-Publication Fact-Checking</h2>
              <p>Where source records are available, our review process considers:</p>
              <ul>
                <li><strong>Pricing verification:</strong> Pricing data is recorded from the vendor&apos;s official pricing page, together with the date it was read.</li>
                <li><strong>Feature claims:</strong> Feature availability is recorded from vendor documentation. Where we cannot confirm availability, the claim is left off the page.</li>
                <li><strong>Statistical claims:</strong> Statistics and numerical claims should have a checkable source and context. Some older numeric scores and review counts remain under source-provenance audit.</li>
                <li><strong>Quotes and attributions:</strong> Quotes from individuals, publications, or studies are verified against the original source.</li>
                <li><strong>Links and references:</strong> Links are checked through automated and manual audits where feasible; availability can change, and not every existing link has been individually reverified.</li>
              </ul>

              <h2>Source Discipline</h2>
              <p>For claims marked as verified, the standard is a recorded source and context. Some older pages do not yet meet that standard:</p>
              <ol>
                <li><strong>Recording:</strong> The figure and its source are recorded together — our dataset, vendor documentation, or a published pricing page.</li>
                <li><strong>Conflict handling:</strong> If sources disagree, explain the uncertainty or omit the claim until it can be resolved.</li>
                <li><strong>Unsourced facts:</strong> A fact with no source is omitted or marked unverified rather than stated as confirmed.</li>
                <li><strong>Editorial review:</strong> Pages should be reviewed for accuracy, clarity, and completeness; older content is still being brought into line with this standard.</li>
              </ol>
              <p>Where a reader or a later source shows a recorded figure to be wrong, the page is corrected and its last-reviewed date updated.</p>

              <h2>Post-Publication Fact-Checking</h2>
              <p>Our commitment to accuracy continues after publication:</p>
              <ul>
                <li>We review vendor announcements, pricing changes, and major product updates when identified; we do not claim continuous monitoring of every tool.</li>
                <li>Reader-reported errors are reviewed as capacity allows; we do not promise a fixed response time.</li>
                <li>Older reviews may be prioritized for re-verification, but a displayed date alone does not mean every claim was rechecked.</li>
                <li>Significant corrections are documented with the date and nature of the change</li>
              </ul>

              <h2>Transparency and Accountability</h2>
              <p>When errors are found, we correct them promptly and transparently. Our <a href="/corrections-policy">Corrections Policy</a> details our approach. We believe that transparent error correction is a core component of editorial integrity.</p>
              <p>Readers can report potential errors by emailing contact@pilotstack.online or using the channels listed on our Contact page. The on-site contact form is not configured yet.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about our fact-checking process, email contact@pilotstack.online or use the official channels listed on our Contact page.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
