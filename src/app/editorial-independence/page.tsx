import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Editorial Independence",
  description: "PilotStack separates editorial guidance from commercial relationships. Commercial relationships are disclosed where applicable and are not intended to determine reviews, ratings, or recommendations.",
  path: "/editorial-independence",
})

export default function EditorialIndependencePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Editorial Independence", href: "/editorial-independence" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Editorial Independence" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Our Commitment</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Editorial Independence</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 14, 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                PilotStack publishes its editorial methodology and commercial disclosures so readers can understand how reviews, comparisons, and recommendations are developed.
              </p>

              <h2>Our Independence Principles</h2>

              <div className="space-y-6 mb-8">
                {[
                  { title: "No Paid Reviews", body: "We do not sell editorial ratings or rankings. Commercial relationships are disclosed and are not intended to determine whether a tool is covered or how it is rated." },
                  { title: "No Vendor Approval", body: "Vendors do not review or approve our content before publication. Our reviews are written for our readers, not for the companies we evaluate." },
                  { title: "No Paid Editorial Outcomes", body: "Advertisers, sponsors, and affiliate partners do not purchase editorial ratings or rankings. Commercial relationships are disclosed where applicable." },
                  { title: "No Review Copies", body: "Access arrangements can vary by product. Where access, pricing, or promotional relationships could affect how a page is interpreted, relevant context is disclosed." },
                  { title: "Transparent Disclosure", body: "We disclose affiliate links where they appear. If sponsored content or other paid partnerships are introduced, they will be clearly labeled and kept distinct from independent reviews and comparisons." },
                  { title: "Reader First", body: "Every editorial decision is made with our readers' interests as the primary consideration. If we cannot recommend a product honestly, we say so plainly." },
                ].map((principle) => (
                  <div key={principle.title} className="p-4 rounded-xl bg-muted-bg">
                    <h3 className="font-semibold mb-1">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">{principle.body}</p>
                  </div>
                ))}
              </div>

              <h2>Commercial vs. Editorial Separation</h2>
              <p>PilotStack keeps editorial criteria separate from commercial disclosures:</p>
              <ul>
                <li>PilotStack is independently operated; editorial decisions follow the published methodology and commercial relationships are disclosed separately</li>
                <li>Editorial conclusions are based on the published criteria, not on whether a relationship is commercial</li>
                <li>No vendor or affiliate partner is entitled to approve a review or purchase a favorable rating or ranking</li>
                <li>Editorial decisions are documented against the published criteria rather than against commercial relationships</li>
              </ul>

              <h2>Revenue Sources</h2>
              <p>PilotStack may earn revenue from the following sources. The presence or availability of a commercial relationship does not mean every reviewed vendor is a partner:</p>
              <ul>
                <li><strong>Affiliate commissions:</strong> PilotStack may earn commissions when readers purchase products through disclosed affiliate links. These relationships do not entitle partners to favorable ratings or rankings.</li>
                <li><strong>Display advertising:</strong> Ads may appear in designated placements. Advertisers do not purchase editorial ratings or rankings.</li>
                <li><strong>Potential sponsored content:</strong> If introduced, paid content will be clearly labeled and kept distinct from independent reviews and comparisons.</li>
                <li><strong>Potential newsletter sponsorships:</strong> If introduced, sponsored placements will be clearly marked before readers engage with them.</li>
              </ul>
              <p>Commercial relationships are intended to remain separate from editorial scoring and conclusions. Our full <a href="/affiliate-disclosure">Affiliate Disclosure</a> and <a href="/advertising-disclosure">Advertising Disclosure</a> provide detailed information.</p>

              <h2>Accountability</h2>
              <p>We welcome scrutiny of our editorial independence. If you believe any content on PilotStack has been influenced by commercial relationships, please report it immediately to <strong>editorial@pilotstack.online</strong>. We review reported concerns and correct the record when warranted.</p>

              <p className="text-sm text-muted-foreground mt-8">For questions about editorial independence, contact <strong>editorial@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
