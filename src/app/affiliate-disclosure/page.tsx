import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Affiliate & Commercial Disclosure",
  description: "PilotStack explains how any affiliate links are disclosed and how commercial relationships are kept separate from editorial scoring.",
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
            <p className="text-muted-foreground mb-8">Last updated: October 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                PilotStack may use affiliate links on selected pages. Not every outbound vendor link is an affiliate link, and this page does not imply an active relationship with every vendor we review.
              </p>

              <h2>How Affiliate Links Work</h2>
              <p>If you click an affiliate link and complete a qualifying action, PilotStack may receive a commission at no additional cost to you. Any commissions support site hosting, maintenance, research, and editorial work.</p>

              <h2>Our Commitment to Independence</h2>
              <p>Affiliate relationships are not intended to determine our editorial content:</p>
              <ul>
                <li>We do not sell positive reviews, placement in comparison tables, or specific rankings</li>
                <li>Our ratings and recommendations are determined solely by our editorial process as described on our <a href="/methodology">Methodology page</a></li>
                <li>Affiliate relationships do not determine the ratings, rankings, or inclusion criteria described in our published methodology</li>
                <li>Affiliate and advertising relationships are disclosed separately from editorial guidance</li>
                <li>We identify affiliate links near the link or in the page disclosure so readers can understand the commercial context</li>
              </ul>

              <h2>Where Affiliate Links Appear</h2>
              <p>Placement varies by page. A regular vendor, documentation, or educational link is not automatically an affiliate link. Treat a link as commission-generating only when it is identified as an affiliate link.</p>

              <h2>Affiliate Programs</h2>
              <p>We name specific affiliate partners only when a relationship is active and used on the site. This disclosure does not imply that PilotStack has a partnership with every vendor reviewed, including examples that may appear in our software coverage.</p>

              <h2>No Impact on Pricing</h2>
              <p>Using our affiliate links does not affect the price you pay for any product or service. The commission is paid by the vendor from their marketing budget, not from any customer premium.</p>

              <h2>Questions</h2>
              <p>If you have questions about our affiliate relationships or how they operate, contact us at <strong>hello@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
