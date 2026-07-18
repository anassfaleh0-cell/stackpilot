import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "About",
  description: "PilotStack helps businesses navigate the complex software landscape with expert reviews, honest comparisons, and actionable guides.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "About" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">About</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-6">Navigating software shouldn&apos;t be hard</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">PilotStack was founded with a simple mission: help businesses choose the right software, every time.</p>
              <p className="text-muted-foreground mb-4">With thousands of tools launching every year, the software landscape has become overwhelming. Buying decisions that once took days now take weeks of research. We built PilotStack to change that.</p>
              <p className="text-muted-foreground mb-4">Founded in 2024, PilotStack has grown from a two-person research project into a dedicated team of product analysts, industry specialists, and technical writers across the US and Europe. Collectively, our team has over 50 years of experience evaluating B2B software across CRM, project management, analytics, developer tools, HR, and marketing categories.</p>
              <p className="text-muted-foreground mb-4">Our team of experienced researchers and industry experts rigorously evaluates every tool we review. We test features, benchmark performance, analyze pricing, and aggregate real user feedback from over 100,000 verified G2, Capterra, and TrustRadius reviews to deliver comprehensive, unbiased assessments. Every reviewer completes a standardized two-week testing protocol and their findings are independently verified by a second team member before publication.</p>
              <p className="text-muted-foreground mb-4">We review approximately 60-80 tools annually across 12 categories. We do not accept payment for reviews, placement in comparison tables, or links from our content. Our revenue comes from affiliate commissions and sponsored newsletter placements — always clearly disclosed. If we cannot recommend a tool honestly, we will say so plainly.</p>
              <h2 className="text-2xl font-bold mt-12 mb-4">Our values</h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: "Unbiased", desc: "We never accept payment for reviews or rankings. Every evaluation is independent." },
                  { title: "Thorough", desc: "Each tool is tested across dozens of criteria before receiving a score." },
                  { title: "Transparent", desc: "Our methodology is public. See exactly how we reach every conclusion." },
                  { title: "Helpful", desc: "Every piece of content should help you make a better decision." },
                ].map((v) => (
                  <div key={v.title} className="p-4 rounded-xl bg-muted-bg">
                    <h3 className="font-semibold mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <a href="/methodology" className="button-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-button h-10 px-6 text-sm font-medium transition-all duration-200">
                  Read our full methodology
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
