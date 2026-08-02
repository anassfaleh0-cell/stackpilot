import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { SocialLinkList } from "@/components/brand/social-icons"

export const metadata = createMetadata({
  title: "About",
  description: "PilotStack helps businesses navigate the complex software landscape with expert reviews, honest comparisons, and actionable guides.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <WebPageSchema name="About PilotStack" description="Learn about PilotStack's mission, team, values, and editorial approach." url={`${site.url}/about`} />
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
              <p className="text-muted-foreground mb-4">Founded in 2024, PilotStack is run by a small, independent team. Every review follows our published methodology: hands-on testing for a minimum of two weeks, scored against a five-dimension rubric, and cross-checked against public user feedback from G2, Capterra, and TrustRadius. We don&apos;t publish individual bios at this stage, but our full testing process is public.</p>
              <p className="text-muted-foreground mb-4">Our team of experienced researchers and industry experts rigorously evaluates every tool we review. We test features, benchmark performance, analyze pricing, and aggregate user feedback from G2, Capterra, and TrustRadius reviews, cross-checking it against our hands-on testing to deliver comprehensive, unbiased assessments. Every reviewer completes a standardized two-week testing protocol and their findings are independently verified by a second team member before publication.</p>
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
              <div className="mt-12 p-6 rounded-xl bg-muted-bg border border-border">
                <h2 className="text-lg font-bold mb-2">Official Community</h2>
                <p className="text-sm text-muted-foreground mb-4">Join the PilotStack community:</p>
                <SocialLinkList />
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
