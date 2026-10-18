import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Affiliate Disclosure",
  description: "PilotStack's affiliate disclosure explains how we earn commissions through affiliate links while keeping commercial disclosures separate from the published editorial methodology.",
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
            <p className="text-muted-foreground mb-8">Last updated: October 18, 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                PilotStack participates in affiliate marketing programs. This disclosure explains how affiliate relationships work and how we maintain editorial independence.
              </p>

              <h2>How Affiliate Links Work</h2>
              <p>When you click on an affiliate link on PilotStack and make a purchase, we may earn a commission. In many cases this does not add a separate fee, but the vendor controls pricing, discounts, and transaction terms. A commission may help fund site hosting, maintenance, and editorial work.</p>

              <h2>Our Commitment to Independence</h2>
              <p>Affiliate relationships are not intended to determine our editorial content:</p>
              <ul>
                <li>We do not sell positive reviews, placement in comparison tables, or specific rankings</li>
                <li>Our ratings and recommendations are determined solely by our editorial process as described on our <a href="/methodology">Methodology page</a></li>
                <li>Affiliate relationships do not determine the ratings, rankings, or inclusion criteria described in our published methodology</li>
                <li>Affiliate and advertising relationships are disclosed separately from editorial guidance</li>
                <li>We aim to identify monetized links close to where they appear. If you believe a link is not clearly disclosed, please contact us so we can review it</li>
              </ul>

              <h2>Where Affiliate Links Appear</h2>
              <p>Affiliate links may appear in the following contexts:</p>
              <ul>
                <li>"Visit Website" buttons on review pages</li>
                <li>Tool and service recommendations within comparison pages</li>
                <li>Links to vendor websites in guides and blog posts</li>
                <li>Other distribution channels, if used, where links are clearly marked</li>
              </ul>
              <p>Not all outbound links on PilotStack are affiliate links. Links to documentation, educational resources, and non-commercial sources are not monetized.</p>

              <h2>Affiliate Programs</h2>
              <p>Partner and referral arrangements can change over time. This page is not a complete, live register of every current partner. Treat a link as an affiliate link where it is identified as such, and contact us if the disclosure near a link is unclear. We will review reports and correct the page where needed.</p>

              <h2>Pricing and Vendor Terms</h2>
              <p>An affiliate link usually does not add a separate fee, but prices, discounts, and transaction terms are controlled by the vendor and may vary. Check the vendor's checkout and terms before purchasing; we do not guarantee that every promotion or price is identical for every visitor.</p>

              <h2>Questions</h2>
              <p>If you have questions about our affiliate relationships or how they operate, please use our <a href="/contact">contact page</a> and include the page URL and link you are asking about.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
