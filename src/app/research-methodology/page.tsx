import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Research Methodology | Data Collection & Analysis",
  description: "How PilotStack organizes software research, documents sources where available, explains evidence limits, and distinguishes verified facts from editorial analysis.",
  path: "/research-methodology",
})

export default function ResearchMethodologyPage() {
  return (
    <>
      <ArticleSchema title="Research Methodology | Data Collection & Analysis" description="How PilotStack organizes software research, documents available sources, evaluates evidence, and explains limitations in pricing analysis and market research." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/research-methodology`} keywords={["research methodology", "market research", "data collection", "pricing analysis", "industry benchmarks"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }, { name: "Gartner", url: "https://www.gartner.com" }, { name: "Forrester", url: "https://www.forrester.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Research Methodology", href: "/research-methodology" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Research Methodology" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Research Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Research Methodology</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 23, 2026</p>

            <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack organizes software research using vendor documentation, public sources, and recorded product data. The process covers question definition, source collection, analysis, editorial review, publication, and updates. Source links and collection dates are included where available; a stored figure alone is not proof that a claim has been independently verified.
              </p>
            </div>

            <div className="tl-dr mb-6 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-base font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Research draws from public pricing pages, our recorded dataset, vendor documentation, and public review and analyst sources</li>
                <li>Research process: question definition, source collection, analysis, editorial review, publication, and updates</li>
                <li>Source links and collection dates are included where available; unsupported figures are qualified or omitted</li>
                <li>Pricing information is time-sensitive and should be checked against the current vendor page before purchase</li>
                <li>Methods and limitations are documented for research reports where the underlying data supports them</li>
              </ul>
            </div>

            <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Each research project starts with a specific question before data collection begins</li>
                <li>Collection dates and methods are documented when available in the source record</li>
                <li>Pricing data includes multiple tiers and regions where available</li>
                <li>Outliers are investigated and documented rather than smoothed away</li>
                <li>Editorial review checks the stated question, available evidence, calculations, and limitations; it is not represented as independent peer review</li>
                <li>Methodology, sample sizes, and limitations are included when applicable and supported by the underlying research</li>
                <li>Research updated when significant market changes occur</li>
                <li>Data visualizations include source attribution, collection dates, and accessible text alternatives</li>
              </ul>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Beyond individual product reviews, PilotStack publishes research and practical analysis based on available sources and recorded data. The scope and evidence behind each report should be judged from that report's own source notes and limitations.
              </p>

              <h2>Data Collection</h2>
              <p>Research may draw on the following source types when relevant and available; inclusion in this list does not mean every source type is used in every report:</p>
              <ul>
                <li><strong>Primary research:</strong> Pricing analysis from public pricing pages, feature comparison data recorded for our own coverage, and questions we receive from readers.</li>
                <li><strong>Secondary research:</strong> Publicly available user reviews on G2, Capterra, and TrustRadius; publicly available analyst reports; vendor-published case studies, whitepapers, and documentation; industry benchmarks from published sources.</li>
                <li><strong>Market data:</strong> Public pricing information from vendor websites. The page, region, plan, and collection date are recorded where available, and current terms should be rechecked before a purchase.</li>
              </ul>

              <h2>Research Process</h2>
              <div className="space-y-4 mb-8">
                {[
                  { title: "Research Question Definition", body: "Each research project begins with a specific research question or hypothesis aligned with our editorial mission. We define the scope, methodology, and data sources before data collection begins." },
                  { title: "Data Collection", body: "Data is collected systematically according to the project-specific methodology. For pricing research, we collect data from vendor websites, record the collection date and method for each data point where available." },
                  { title: "Analysis & Validation", body: "Calculations are checked against the available source data where possible. Material assumptions, missing data, and limitations are described rather than hidden; statistical methods are used only when the dataset supports them." },
                  { title: "Editorial Review", body: "The publisher reviews the question, source trail, calculations, and limitations before publication. This editorial review is not described as independent peer review, and it does not imply that every product was tested hands-on." },
                  { title: "Publication & Transparency", body: "Reports explain their scope, available sources, calculation method, and important limitations. Findings supported by recorded data are distinguished from interpretation, and missing evidence is disclosed." },
                  { title: "Updates", body: "Research reports include publication dates and may be updated when significant changes or corrections warrant revision. Updates are noted with the date and nature of changes." },
                ].map((step, i) => (
                  <Card key={step.title} className="p-4">
                    <h3 className="font-semibold text-sm mb-1"><span className="text-primary mr-2">{i + 1}.</span>{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </Card>
                ))}
              </div>

              <h2>Data Quality Standards</h2>
              <ul>
                <li>Source attribution and collection dates are provided when available in the underlying record</li>
                <li>Pricing claims are treated as time-sensitive and verified only when a source and collection context are recorded</li>
                <li>Survey findings are included only when a source, sample size, and method can be identified; no survey statistic should be inferred from an unsupported figure</li>
                <li>Secondary data sources are evaluated for recency, methodology quality, and potential bias</li>
                <li>Data visualizations accurately represent underlying data with clear axis labels and source notes</li>
              </ul>

              <h2>Original Charts and Visualizations</h2>
              <p>Charts and data visualizations are used when an underlying dataset is available. Where applicable, charts should include:</p>
              <ul>
                <li>Clear title and axis labels</li>
                <li>Data source attribution and collection date, when available</li>
                <li>Methodology notes for complex visualizations</li>
                <li>Accessible text alternatives for screen readers</li>
              </ul>

              <h2>Limitations</h2>
              <p>We acknowledge the following limitations in our research:</p>
              <ul>
                <li>Pricing data reflects publicly available information and may not include enterprise discounts, negotiated pricing, or region-specific variations</li>
                <li>Third-party user reviews are not represented as an aggregate unless a specific source, sample, and calculation are documented</li>
                <li>Market size and growth estimates are based on published analyst reports and may use different methodologies and definitions</li>
                <li>Our research focuses primarily on English-language tools and North American/European markets</li>
              </ul>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about our research methodology, email <strong>contact@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
