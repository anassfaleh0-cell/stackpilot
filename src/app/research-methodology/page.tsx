import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Research Methodology",
  description: "How StackPilot conducts software market research. Our data-driven approach to pricing analysis, market trends, industry benchmarks, and original research reports.",
  path: "/research-methodology",
})

export default function ResearchMethodologyPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Research Methodology", href: "/research-methodology" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Research Methodology" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Research Standards</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Research Methodology</h1>
            <p className="text-muted mb-8">Last updated: July 2026</p>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted mb-6">
                Beyond individual product reviews, StackPilot produces original research reports, market analyses, pricing benchmarks, and industry trend reports. This page documents how we conduct this research.
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
                    <p className="text-sm text-muted">{step.body}</p>
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

              <p className="text-sm text-muted-foreground mt-8">For questions about our research methodology, contact us at <strong>research@stackpilot.ai</strong>.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
