import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Editorial Policy",
  description: "StackPilot's editorial policy governs how we produce, review, and maintain all content. Our commitment to accuracy, independence, and transparency in software research.",
  path: "/editorial-policy",
})

export default function EditorialPolicyPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Editorial Policy", href: "/editorial-policy" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Editorial Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Editorial Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Editorial Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                StackPilot is committed to producing the highest quality software research. This editorial policy defines the standards, practices, and principles that govern everything we publish.
              </p>

              <h2>1. Editorial Independence</h2>
              <p>StackPilot operates with complete editorial independence. No vendor, advertiser, sponsor, or affiliate partner can influence our editorial content, ratings, rankings, or recommendations. Our editorial team makes all content decisions based solely on our assessment of what serves our readers' interests.</p>
              <p>We maintain a strict separation between editorial and commercial operations. The editorial team is not informed about which companies are affiliate partners or advertisers when creating content. Revenue considerations never factor into coverage decisions, rating determinations, or the inclusion or exclusion of products from reviews and comparisons.</p>

              <h2>2. Content Standards</h2>
              <p>Every piece of content published on StackPilot must meet the following standards:</p>
              <ul>
                <li><strong>Accuracy:</strong> All factual claims, statistics, pricing data, and feature descriptions must be verified against primary sources before publication. When accuracy cannot be confirmed, we clearly state the limitation.</li>
                <li><strong>Originality:</strong> Our reviews are based on hands-on testing by our team. We do not republish vendor-provided content or use AI-generated content without significant human editorial oversight, fact-checking, and original analysis.</li>
                <li><strong>Comprehensiveness:</strong> Reviews must address both strengths and limitations. We explicitly state who each product is best for and who should consider alternatives.</li>
                <li><strong>Currency:</strong> All content includes publication dates and last-reviewed dates. Content that is more than 12 months old is flagged for review.</li>
                <li><strong>Clarity:</strong> We distinguish factual reporting from analysis and opinion. Our scoring methodology is transparent and applied consistently across all reviews.</li>
              </ul>

              <h2>3. Review Standards</h2>
              <p>All software reviews on StackPilot follow a standardized methodology that includes:</p>
              <ul>
                <li>Hands-on testing by at least two team members for a minimum of two weeks</li>
                <li>Evaluation across five dimensions: Features, Ease of Use, Support, Value, and Performance</li>
                <li>Independent verification of findings by a second team member</li>
                <li>Cross-referencing against aggregated user reviews from G2, Capterra, and TrustRadius</li>
                <li>Documentation of pricing, feature availability, and setup requirements at the time of review</li>
              </ul>
              <p>Full details are available on our <a href="/methodology">Review Methodology</a> page.</p>

              <h2>4. Corrections and Updates</h2>
              <p>When we discover an error in published content, we correct it promptly and transparently. Our <a href="/corrections-policy">Corrections Policy</a> details how errors are classified, corrected, and communicated to readers. We encourage readers to report potential errors via our <a href="/contact">contact form</a>.</p>

              <h2>5. Sources and Attribution</h2>
              <p>We attribute all sources used in our research. When we cite data from third-party studies, analyst reports, or user review platforms, we link to the original source whenever possible. Our internal testing data and methodology are documented in each review and on our methodology pages.</p>

              <h2>6. Diversity and Inclusion</h2>
              <p>We are committed to representing diverse perspectives in our content. Our tool reviews consider accessibility features, internationalization support, and pricing in multiple currencies and regions. We strive to include products that serve organizations of different sizes, industries, and geographic locations.</p>

              <h2>7. Updates to This Policy</h2>
              <p>This editorial policy is reviewed annually. Material changes are communicated to newsletter subscribers and noted on this page. The "Last updated" date reflects the most recent revision.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about this editorial policy, contact us at <strong>editorial@stackpilot.ai</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
