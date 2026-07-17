import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Editorial Independence",
  description: "StackPilot operates with complete editorial independence. No vendor, advertiser, or affiliate partner influences our reviews, ratings, or recommendations.",
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
            <p className="text-muted mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted mb-6">
                Editorial independence is the cornerstone of StackPilot. Our readers must trust that our reviews, comparisons, and recommendations are based solely on rigorous research and testing — not commercial relationships.
              </p>

              <h2>Our Independence Principles</h2>

              <div className="space-y-6 mb-8">
                {[
                  { title: "No Paid Reviews", body: "We never accept payment for reviews or rankings. No vendor can pay to be included in our reviews, receive a higher rating, or be excluded from comparison tables." },
                  { title: "No Vendor Approval", body: "Vendors do not review or approve our content before publication. Our reviews are written for our readers, not for the companies we evaluate." },
                  { title: "No Editorial Influence", body: "No advertiser, sponsor, or affiliate partner has any influence over our editorial decisions, including which products we review, how we rate them, or what we write." },
                  { title: "No Review Copies", body: "We do not accept review copies, free trials, or premium access in exchange for coverage. Our reviewers evaluate tools under the same conditions as paying customers unless temporary access is the only available option (clearly noted in the review)." },
                  { title: "Transparent Disclosure", body: "We clearly disclose all affiliate relationships, sponsored content, and partnerships. Sponsored content is clearly labeled and never included in our comparison reviews." },
                  { title: "Reader First", body: "Every editorial decision is made with our readers' interests as the primary consideration. If we cannot recommend a product honestly, we say so plainly." },
                ].map((principle) => (
                  <div key={principle.title} className="p-4 rounded-xl bg-muted-bg">
                    <h3 className="font-semibold mb-1">{principle.title}</h3>
                    <p className="text-sm text-muted">{principle.body}</p>
                  </div>
                ))}
              </div>

              <h2>Commercial vs. Editorial Separation</h2>
              <p>StackPilot maintains a strict organizational separation between editorial and commercial operations:</p>
              <ul>
                <li>The editorial team operates independently from the commercial team</li>
                <li>Editorial staff do not participate in advertising sales, affiliate partnership negotiations, or commercial discussions</li>
                <li>Commercial team members do not participate in editorial decisions, content planning, or rating determinations</li>
                <li>The editorial team is not informed about which companies are affiliate partners or advertising customers when creating content</li>
              </ul>

              <h2>Revenue Sources</h2>
              <p>StackPilot generates revenue from the following sources, each with clear separation from editorial:</p>
              <ul>
                <li><strong>Affiliate commissions:</strong> We earn commissions when readers purchase products through our affiliate links. No editorial influence.</li>
                <li><strong>Display advertising:</strong> Banner advertisements in designated slots. No editorial influence.</li>
                <li><strong>Sponsored content:</strong> Clearly labeled content produced in partnership with sponsors. Never included in reviews or comparisons.</li>
                <li><strong>Newsletter sponsorships:</strong> Clearly marked sponsored placements in our email newsletter.</li>
              </ul>
              <p>No revenue source influences our editorial content. Our full <a href="/affiliate-disclosure">Affiliate Disclosure</a> and <a href="/advertising-disclosure">Advertising Disclosure</a> provide detailed information.</p>

              <h2>Accountability</h2>
              <p>We welcome scrutiny of our editorial independence. If you believe any content on StackPilot has been influenced by commercial relationships, please report it immediately to <strong>editorial@stackpilot.ai</strong>. We investigate all reports and take corrective action if warranted.</p>

              <h2>Governance</h2>
              <p>Editorial independence is reviewed quarterly by our editorial leadership team. Any concerns about editorial independence are escalated to the publisher, who has final authority to ensure separation between editorial and commercial operations.</p>

              <p className="text-sm text-muted-foreground mt-8">For questions about editorial independence, contact <strong>editorial@stackpilot.ai</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
