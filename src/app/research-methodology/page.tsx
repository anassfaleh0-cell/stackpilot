import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Research Methodology | Data Collection & Analysis",
  description: "How PilotStack conducts software market research. Our data-driven approach to pricing analysis, market trends, industry benchmarks, and original research reports.",
  path: "/research-methodology",
})

export default function ResearchMethodologyPage() {
  return (
    <>
      <ArticleSchema title="Research Methodology | Data Collection & Analysis" description="How PilotStack conducts software market research — data collection, analysis, validation, and publication standards for pricing analysis, benchmarks, and market trends." publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/research-methodology`} keywords={["research methodology", "market research", "data collection", "pricing analysis", "industry benchmarks"]} mentions={[{ name: "G2", url: "https://www.g2.com" }, { name: "Capterra", url: "https://www.capterra.com" }, { name: "TrustRadius", url: "https://www.trustradius.com" }, { name: "Gartner", url: "https://www.gartner.com" }, { name: "Forrester", url: "https://www.forrester.com" }]} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Research Methodology", href: "/research-methodology" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Research Methodology" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Research Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Research Methodology</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

            <div className="quick-answer mb-6 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-base font-semibold mb-2">Quick Answer</h2>
              <p className="text-sm text-muted-foreground">
                PilotStack produces original software market research using primary surveys, hands-on testing data, and secondary sources including G2, Capterra, and analyst reports. Every research project follows a 6-stage process: question definition, data collection, analysis, peer review, publication, and updates. A minimum 20% of all data points are independently validated.
              </p>
            </div>

            <div className="tl-dr mb-6 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-base font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                <li>Research draws from primary surveys, hands-on testing, and secondary sources (G2, Capterra, analyst reports)</li>
                <li>6-stage process: question definition, data collection, analysis, peer review, publication, updates</li>
                <li>Minimum 20% of data points independently validated by second researcher</li>
                <li>Pricing data verified against vendor websites at time of collection</li>
                <li>All limitations and methodology notes published transparently with each report</li>
              </ul>
            </div>

            <div className="key-takeaways mb-6 p-4 bg-muted-bg rounded-xl border border-border">
              <h2 className="text-base font-semibold mb-2">Key Takeaways</h2>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                <li>Each research project starts with a specific question or hypothesis before data collection begins</li>
                <li>Data collected systematically with documented collection dates and methods for every data point</li>
                <li>Pricing data includes multiple tiers and regions where available</li>
                <li>Outliers investigated and documented; 20% sample independently validated</li>
                <li>Peer review by researcher not involved in original collection</li>
                <li>Detailed methodology, sample sizes, and limitations published with every report</li>
                <li>Research updated annually or when significant market changes occur</li>
                <li>Data visualizations include source attribution, collection dates, and accessible text alternatives</li>
              </ul>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Beyond individual product reviews, PilotStack produces original research reports, market analyses, pricing benchmarks, and industry trend reports. This page documents how we conduct this research.
              </p>

              <h2>Data Collection</h2>
              <p>Our research draws from multiple data sources to ensure comprehensive and accurate findings:</p>
              <ul>
                <li><strong>Primary research:</strong> Original surveys of software buyers and vendors, pricing analysis from public sources and direct vendor quotes, and feature comparison data from our hands-on testing process.</li>
                <li><strong>Secondary research:</strong> Aggregated and anonymized data from G2, Capterra, and TrustRadius reviews; publicly available analyst reports from Gartner, Forrester, and IDC; vendor-published case studies, whitepapers, and documentation; industry benchmarks from published sources.</li>
                <li><strong>Market data:</strong> Pricing information collected from vendor websites, public pricing pages, and direct verification with sales teams. We collect pricing for multiple tiers and regions where available.</li>
              </ul>

              <h2>Research Process</h2>
              <div className="space-y-4 mb-8">
                {[
                  { title: "Research Question Definition", body: "Each research project begins with a specific research question or hypothesis aligned with our editorial mission. We define the scope, methodology, and data sources before data collection begins." },
                  { title: "Data Collection", body: "Data is collected systematically according to the project-specific methodology. For pricing research, we collect data from vendor websites, verify with sales teams where possible, and document the collection date and method for every data point." },
                  { title: "Analysis & Validation", body: "Data is analyzed using appropriate statistical methods. A second researcher independently validates a minimum 20% sample of the data to ensure accuracy. Outliers are investigated and documented." },
                  { title: "Peer Review", body: "Every research report undergoes internal peer review by at least one researcher not involved in the original data collection. The reviewer evaluates methodology, data accuracy, and interpretation." },
                  { title: "Publication & Transparency", body: "Published research includes detailed methodology notes, data collection dates, sample sizes, and limitations. We clearly distinguish between findings supported by our data and interpretive analysis." },
                  { title: "Updates", body: "Research reports include publication dates and are updated annually or when significant market changes warrant earlier revision. Updates are noted with the date and nature of changes." },
                ].map((step, i) => (
                  <Card key={step.title} className="p-4">
                    <h3 className="font-semibold text-sm mb-1"><span className="text-primary mr-2">{i + 1}.</span>{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </Card>
                ))}
              </div>

              <h2>Data Quality Standards</h2>
              <ul>
                <li>All data points include source attribution and collection date</li>
                <li>Pricing data is verified against vendor websites at the time of collection</li>
                <li>Survey data includes documented sample sizes, methodologies, and margin of error where applicable</li>
                <li>Secondary data sources are evaluated for recency, methodology quality, and potential bias</li>
                <li>Data visualizations accurately represent underlying data with clear axis labels and source notes</li>
              </ul>

              <h2>Original Charts and Visualizations</h2>
              <p>Charts and data visualizations in our research reports are created by our team using verified data. Each chart includes:</p>
              <ul>
                <li>Clear title and axis labels</li>
                <li>Data source attribution with collection date</li>
                <li>Methodology notes for complex visualizations</li>
                <li>Accessible text alternatives for screen readers</li>
              </ul>

              <h2>Limitations</h2>
              <p>We acknowledge the following limitations in our research:</p>
              <ul>
                <li>Pricing data reflects publicly available information and may not include enterprise discounts, negotiated pricing, or region-specific variations</li>
                <li>User review data is aggregated from third-party platforms and reflects the opinions of their user bases, which may not be representative of all users</li>
                <li>Market size and growth estimates are based on published analyst reports and may use different methodologies and definitions</li>
                <li>Our research focuses primarily on English-language tools and North American/European markets</li>
              </ul>

              <p className="text-sm text-muted-foreground-foreground mt-8">For questions about our research methodology, contact us at <strong>research@pilotstack.online</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
