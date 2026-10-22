import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Advertising Disclosure",
  description: "PilotStack's advertising disclosure explains our approach to sponsored content, native advertising, and the distinction between editorial and promotional content.",
  path: "/advertising-disclosure",
})

export default function AdvertisingDisclosurePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Advertising Disclosure", href: "/advertising-disclosure" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Advertising Disclosure" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Transparency</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Advertising Disclosure</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 14, 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                PilotStack believes in clear separation between editorial content and advertising. This disclosure explains our advertising practices.
              </p>

              <h2>Types of Advertising</h2>
              <p>PilotStack may display the following types of advertising:</p>
              <ul>
                <li><strong>Display advertising:</strong> Banner advertisements placed in designated ad slots. These are clearly marked as advertisements and are not related to editorial content.</li>
                <li><strong>Sponsored content:</strong> If we accept a paid content partnership in the future, the page will be clearly labeled as “Sponsored” or “Promoted” before readers engage with it. Paid placement will not be represented as an independent review or silently alter editorial conclusions.</li>
                <li><strong>Potential newsletter sponsorships:</strong> If introduced, sponsored placements in email will be clearly marked as sponsorships.</li>
              </ul>

              <h2>Separation of Editorial and Advertising</h2>
              <p>We apply the published editorial criteria independently of ad placements and disclose commercial relationships where applicable:</p>
              <ul>
                <li>Advertisers do not buy a favorable rating or control an editorial conclusion.</li>
                <li>PilotStack is independently operated; commercial relationships are disclosed and should not be treated as evidence that a product is the best choice.</li>
                <li>Any future sponsored material will be labeled clearly and kept distinct from independent reviews and comparisons.</li>
                <li>Display advertisements are third-party placements and may vary by visitor, consent choice, device, and available inventory.</li>
              </ul>

              <h2>Sponsored Content Standards</h2>
              <p>If sponsored content is introduced, it must meet the following standards:</p>
              <ul>
                <li>Clearly labeled as "Sponsored" or "Promoted" at the top of the page</li>
                <li>Reviewed against the site’s published editorial and disclosure standards before publication</li>
                <li>Factually accurate and compliant with our editorial standards</li>
                <li>Never misrepresented as independent editorial content</li>
              </ul>

              <h2>Native Advertising</h2>
              <p>We aim not to present paid placements as independent editorial recommendations. If a native advertising format is introduced, it must be clearly labeled and visually distinguishable from independent reviews, comparisons, and guides.</p>

              <h2>Adherence to Standards</h2>
              <p>PilotStack adheres to the Federal Trade Commission (FTC) guidelines on endorsements and advertising, as well as industry standards set by the Interactive Advertising Bureau (IAB).</p>

              <h2>Questions</h2>
              <p>For questions about our advertising practices, contact us at <strong>ads@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
