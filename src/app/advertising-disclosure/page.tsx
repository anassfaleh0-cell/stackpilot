import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Advertising Disclosure",
  description: "StackPilot's advertising disclosure explains our approach to sponsored content, native advertising, and the distinction between editorial and promotional content.",
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
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                StackPilot believes in clear separation between editorial content and advertising. This disclosure explains our advertising practices.
              </p>

              <h2>Types of Advertising</h2>
              <p>StackPilot may display the following types of advertising:</p>
              <ul>
                <li><strong>Display advertising:</strong> Banner advertisements placed in designated ad slots. These are clearly marked as advertisements and are not related to editorial content.</li>
                <li><strong>Sponsored content:</strong> Content produced in partnership with a sponsor. Sponsored content is clearly labeled as "Sponsored" or "Promoted" at the top of the page and is never included in our comparison reviews, rankings, or editorial content sections.</li>
                <li><strong>Newsletter sponsorships:</strong> Sponsored placements in our email newsletter are clearly marked as sponsorships.</li>
              </ul>

              <h2>Separation of Editorial and Advertising</h2>
              <p>We maintain strict separation between editorial and advertising operations:</p>
              <ul>
                <li>Advertisers and sponsors have no influence over editorial content, ratings, rankings, or product coverage decisions</li>
                <li>The editorial team does not participate in advertising sales or know which companies are advertising partners when creating content</li>
                <li>Sponsored content is never presented as editorial content or included in our review, comparison, or guide sections</li>
                <li>Advertisements are placed in designated slots and are clearly distinguishable from editorial content</li>
              </ul>

              <h2>Sponsored Content Standards</h2>
              <p>Sponsored content on StackPilot must meet the following standards:</p>
              <ul>
                <li>Clearly labeled as "Sponsored" or "Promoted" at the top of the page</li>
                <li>Produced or reviewed by our editorial team to ensure accuracy</li>
                <li>Factually accurate and compliant with our editorial standards</li>
                <li>Never misrepresented as independent editorial content</li>
              </ul>

              <h2>Native Advertising</h2>
              <p>We do not currently use native advertising that mimics the appearance of editorial content. If we introduce native advertising in the future, it will be clearly labeled and distinguishable from editorial content.</p>

              <h2>Adherence to Standards</h2>
              <p>StackPilot adheres to the Federal Trade Commission (FTC) guidelines on endorsements and advertising, as well as industry standards set by the Interactive Advertising Bureau (IAB).</p>

              <h2>Questions</h2>
              <p>For questions about our advertising practices, contact us at <strong>ads@stackpilot.ai</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
