import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Affiliate Disclosure",
  description: "StackPilot's affiliate disclosure explains how we earn commissions through affiliate links while maintaining editorial independence and unbiased reviews.",
  path: "/affiliate-disclosure",
})

export default function AffiliateDisclosurePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Affiliate Disclosure", href: "/affiliate-disclosure" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Affiliate Disclosure" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Transparency</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Affiliate Disclosure</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                StackPilot participates in affiliate marketing programs. This disclosure explains how affiliate relationships work and how we maintain editorial independence.
              </p>

              <h2>How Affiliate Links Work</h2>
              <p>When you click on an affiliate link on StackPilot and make a purchase, we may earn a commission at no additional cost to you. These commissions help us maintain and improve our content, pay our team of researchers and writers, and keep our reviews free for all readers.</p>

              <h2>Our Commitment to Independence</h2>
              <p>Affiliate relationships never influence our editorial content:</p>
              <ul>
                <li>We do not accept payment for positive reviews, placement in comparison tables, or specific rankings</li>
                <li>Our ratings and recommendations are determined solely by our editorial process as described on our <a href="/methodology">Methodology page</a></li>
                <li>We only participate in affiliate programs for products we have independently evaluated and would recommend regardless of compensation</li>
                <li>The editorial team is not informed about affiliate partnership status when creating or updating content</li>
                <li>We clearly mark affiliate links where they appear in our content</li>
              </ul>

              <h2>Where Affiliate Links Appear</h2>
              <p>Affiliate links may appear in the following contexts:</p>
              <ul>
                <li>"Visit Website" buttons on review pages</li>
                <li>Tool and service recommendations within comparison pages</li>
                <li>Links to vendor websites in guides and blog posts</li>
                <li>Product links in our newsletter (where clearly marked)</li>
              </ul>
              <p>Not all outbound links on StackPilot are affiliate links. Links to documentation, educational resources, and non-commercial sources are not monetized.</p>

              <h2>Affiliate Programs</h2>
              <p>StackPilot participates in affiliate programs including, but not limited to:</p>
              <ul>
                <li>Vendor-specific affiliate programs (HubSpot, Salesforce, Asana, and others we review)</li>
                <li>Aggregator affiliate networks</li>
                <li>Platform referral programs</li>
              </ul>
              <p>This list may change as we add or remove affiliate partnerships. Our editorial independence commitments apply to all affiliate relationships.</p>

              <h2>No Impact on Pricing</h2>
              <p>Using our affiliate links does not affect the price you pay for any product or service. The commission is paid by the vendor from their marketing budget, not from any customer premium.</p>

              <h2>Questions</h2>
              <p>If you have questions about our affiliate relationships or how they operate, contact us at <strong>disclosures@stackpilot.ai</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
