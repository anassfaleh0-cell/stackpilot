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
      <ArticleSchema title="Editorial Policy | Content Standards & Independence" description="PilotStack's editorial policy — accuracy, independence, and transparency standards for all software research and reviews." publishedAt="2026-01-15" updatedAt="2026-10-18" author="PilotStack" url={`${site.url}/editorial-policy`} keywords={["editorial policy", "content standards", "editorial independence", "review guidelines", "fact-checking"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Editorial Policy", href: "/editorial-policy" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Editorial Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Editorial Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Editorial Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 18, 2026</p>

            <div className="quick-answer mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack separates editorial decisions from commercial relationships. Affiliate and advertising relationships are disclosed where applicable and are not intended to determine ratings, rankings, or content decisions. Our documented scoring method uses nine recorded category scores, but a stored value is not proof of recent independent verification or direct use of a product in a live environment. We aim to distinguish source-backed facts from analysis, disclose commercial links, and correct errors when identified. Readers should check the methodology and the limitations shown on each page.
              </p>
            </div>

            <div className="tl-dr mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Editorial criteria are kept separate from commercial disclosures</li>
                <li>Important factual claims should be traceable to recorded sources; if evidence is missing, treat the claim as unverified and report it</li>
                <li>Reuse structured product records where available, while checking that a value's source and date remain relevant</li>
                <li>Reviews are intended to explain relevant strengths, limitations, and who may need an alternative</li>
                <li>Reported errors are reviewed and corrected transparently when a correction is warranted</li>
              </ul>
            </div>

            <div className="key-takeaways mb-8 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-lg font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Commercial relationships are disclosed separately from editorial criteria</li>
                <li>Ratings and coverage are based on published editorial criteria</li>
                <li>Content pages expose publication or update dates where those fields are maintained</li>
                <li>Older content should be prioritized for review and updating; age alone is not a reason to remove a useful page</li>
                <li>We distinguish factual reporting from analysis and opinion throughout</li>
                <li>The published methodology describes the scoring rules; evidence and freshness can vary by product record</li>
                <li>Links to third-party review profiles may be included where relevant and available; readers should distinguish external ratings from PilotStack's editorial score</li>
                <li>Accessibility, internationalization, and regional pricing are considered where relevant to the product and available evidence</li>
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
              <p>Every piece of content published on PilotStack must meet the following standards:</p>
              <ul>
                <li><strong>Accuracy:</strong> We aim to connect material factual claims to recorded sources. Where evidence is unavailable or has not been recently verified, the claim should be qualified or omitted; a populated content field alone is not independent confirmation.</li>
                <li><strong>Originality:</strong> Our pages combine structured product records with publicly available material such as vendor documentation and pricing pages. We aim to add decision context rather than reproduce vendor copy, but this does not mean every claim has been independently tested.</li>
                <li><strong>Comprehensiveness:</strong> Reviews should address material strengths, limitations, use cases, and situations where another product may be a better fit.</li>
                <li><strong>Currency:</strong> Content includes publication or update dates where those fields are maintained, and older material is reviewed as part of ongoing maintenance.</li>
                <li><strong>Clarity:</strong> We distinguish factual reporting from analysis and opinion. Our documented scoring method is described on the methodology page; readers should also consider the evidence and limitations recorded for each product.</li>
              </ul>

              <h2>3. Review Standards</h2>
              <p>Our published review methodology describes the intended scoring and sourcing approach. The existence of a score does not mean every product has been independently tested or every field recently verified:</p>
              <ul>
                <li>One recorded source per figure, reused everywhere a tool appears</li>
                <li>Nine equally weighted category scores on a 1-5 scale, with the overall rating as their mean</li>
                <li>Claims without adequate evidence should be omitted or identified as unverified</li>
                <li>Links to third-party feedback are included where relevant and available; external ratings are not the same as PilotStack's editorial score</li>
                <li>Pricing, feature availability, and setup requirements are described where information is available and should be rechecked with the vendor before purchase</li>
              </ul>
              <p>Full details are available on our <a href="/methodology">Review Methodology</a> page.</p>

              <h2>4. Corrections and Updates</h2>
              <p>When a reported error is confirmed, we aim to correct it transparently; timing depends on the issue and supporting evidence. Our <a href="/corrections-policy">Corrections Policy</a> details how errors are classified, corrected, and communicated to readers. We encourage readers to report potential errors via our <a href="/contact">contact form</a>.</p>

              <h2>5. Sources and Attribution</h2>
              <p>We aim to link to original sources for material claims where those sources are available. Some pages use structured product records and public vendor material; a populated field is not proof of recent independent verification. Readers should use the methodology and page-specific limitations to interpret the evidence.</p>

              <h2>6. Diversity and Inclusion</h2>
              <p>Where relevant and supported by available information, pages may discuss accessibility, internationalization, regional pricing, and differences in organizational needs. Coverage varies by product and by the evidence available.</p>

              <h2>7. Updates to This Policy</h2>
              <p>This editorial policy may be updated when our practices materially change. The date shown above reflects the latest revision of this policy, not a claim that every page or product record was rechecked on that date.</p>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about this editorial policy, please use our <a href="/contact">contact page</a>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
