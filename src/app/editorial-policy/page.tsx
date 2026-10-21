import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Editorial Policy | Content Standards & Independence",
  description: "PilotStack's editorial policy governs how we produce, review, and maintain all content. Our commitment to accuracy, independence, and transparency in software research.",
  path: "/editorial-policy",
})

export default function EditorialPolicyPage() {
  return (
    <>
      <ArticleSchema title="Editorial Policy | Content Standards & Independence" description="PilotStack's editorial policy — accuracy, independence, and transparency standards for all software research and reviews." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/editorial-policy`} keywords={["editorial policy", "content standards", "editorial independence", "review guidelines", "fact-checking"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Editorial Policy", href: "/editorial-policy" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Editorial Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Editorial Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Editorial Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 14, 2026</p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack aims to separate editorial decisions from commercial relationships and disclose affiliate or advertising relationships where applicable. Our methodology explains the evidence standard, but some older numeric scores and review-count figures are still undergoing source-provenance review. A stored figure is not proof that it has been independently verified; consult the source context on each page and the methodology for current limitations.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Editorial criteria are kept separate from commercial disclosures</li>
                <li>New numeric claims should have a checkable source and context; older records are being audited</li>
                <li>Documented source records should be reused consistently, but consistency alone does not prove a claim is verified</li>
                <li>Both strengths and limitations addressed in every review</li>
                <li>Corrections published promptly and transparently</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Commercial relationships are disclosed separately from editorial criteria</li>
                <li>Ratings and coverage are based on published editorial criteria</li>
                <li>Content pages expose publication or update dates where those fields are maintained</li>
                <li>Older content is prioritized for review and improvement; age alone is not a reason to remove a useful page</li>
                <li>We distinguish factual reporting from analysis and opinion throughout</li>
                <li>Standardized methodology applied consistently across all reviews</li>
                <li>Third-party user reviews on G2, Capterra and TrustRadius are linked so readers can check independent feedback directly</li>
                <li>Diverse perspectives considered including accessibility, internationalization, and multi-currency pricing</li>
              </ul>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                PilotStack is committed to producing the highest quality software research. This editorial policy defines the standards, practices, and principles that govern everything we publish.
              </p>

              <h2>1. Editorial Independence</h2>
              <p>PilotStack's editorial guidance is developed according to its published methodology. Commercial relationships are disclosed where applicable and are not intended to determine editorial content, ratings, rankings, or recommendations.</p>
              <p>We keep commercial disclosures separate from the published editorial criteria. Revenue considerations are not intended to determine coverage decisions, rating determinations, or inclusion or exclusion decisions.</p>

              <h2>2. Content Standards</h2>
              <p>New and updated content is expected to meet the following standards. Some older pages remain under source-provenance review and may not yet meet every evidence requirement:</p>
              <ul>
                <li><strong>Accuracy:</strong> New numeric claims should be tied to a checkable source, date, and relevant context before being described as verified. Some older records remain under source audit; when a claim cannot be confirmed, we correct it, qualify it, or remove the unsupported claim rather than imply verification.</li>
                <li><strong>Originality:</strong> Our pages are developed from the sources described in our methodology. Vendor-provided material may inform research, but we aim to add editorial context, comparison, and decision guidance rather than republish it as-is.</li>
                <li><strong>Comprehensiveness:</strong> Reviews must address both strengths and limitations. We explicitly state who each product is best for and who should consider alternatives.</li>
                <li><strong>Currency:</strong> Content includes publication or update dates where those fields are maintained, and older material is reviewed as part of ongoing maintenance.</li>
                <li><strong>Clarity:</strong> We distinguish factual reporting from analysis and opinion. Our scoring methodology is public; older score records are being audited for consistent application and source provenance.</li>
              </ul>

              <h2>3. Review Standards</h2>
              <p>Our review framework sets a consistent standard for software research. Some older pages may not yet satisfy every evidence requirement while the source audit continues. The framework includes:</p>
              <ul>
                <li>Documented source records reused consistently where available; a stored value alone is not evidence of provenance</li>
                <li>Nine equally weighted category dimensions are the intended scoring framework; numeric scores are verified only when their source and calculation can be checked</li>
                <li>Unsupported facts should be corrected, qualified, or omitted as identified by ongoing audits</li>
                <li>Third-party user reviews on G2, Capterra and TrustRadius are linked for readers who want independent feedback</li>
                <li>Documentation of pricing, feature availability, and setup requirements at the time of review</li>
              </ul>
              <p>Full details are available on our <a href="/methodology">Review Methodology</a> page.</p>

              <h2>4. Corrections and Updates</h2>
              <p>When we discover an error in published content, we correct it promptly and transparently. Our <a href="/corrections-policy">Corrections Policy</a> details how errors are classified, corrected, and communicated to readers. We encourage readers to report potential errors via our <a href="/contact">contact form</a>.</p>

              <h2>5. Sources and Attribution</h2>
              <p>We attribute all sources used in our research. When we cite data from third-party studies, analyst reports, or user review platforms, we link to the original source whenever possible. Our published methodology and recorded sources are described on the relevant review and methodology pages.</p>

              <h2>6. Diversity and Inclusion</h2>
              <p>We are committed to representing diverse perspectives in our content. Our tool reviews consider accessibility features, internationalization support, and pricing in multiple currencies and regions. We strive to include products that serve organizations of different sizes, industries, and geographic locations.</p>

              <h2>7. Updates to This Policy</h2>
              <p>This editorial policy may be updated when our practices materially change. The last-updated date reflects the most recent revision. The "Last updated" date reflects the most recent revision.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about this editorial policy, contact us at <strong>editorial@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
