import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { SocialLinkList } from "@/components/brand/social-icons"

export const metadata = createMetadata({
  title: "About PilotStack — Mission & Editorial Standards",
  description: "PilotStack helps businesses navigate the software landscape with detailed reviews, practical comparisons, and actionable buying guides.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <WebPageSchema name="About PilotStack" description="Learn about PilotStack's purpose, sourcing approach, editorial scores, and the limits readers should keep in mind." url={`${site.url}/about`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "About" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">About</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-6">Navigating software shouldn&apos;t be hard</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">PilotStack was created to make software research easier to navigate. The site brings reviews, comparisons, guides, and structured product information into one place so readers can evaluate options without having to piece together the basics from many sources.</p>
              <p className="text-muted-foreground mb-4">Software research can be difficult because pricing, features, positioning, and product capabilities change over time. PilotStack focuses on making those decision factors easier to compare, while clearly separating recorded information from editorial guidance.</p>
              <p className="text-muted-foreground mb-4">PilotStack is an independently maintained software research site. It uses structured product records and publicly available material to organize software information and buying considerations. The overall editorial score is calculated from nine recorded category scores, but a stored value is not proof of recent independent verification or hands-on product testing. Our methodology explains the calculation and the evidence limitations.</p>
              <p className="text-muted-foreground mb-4">PilotStack may earn revenue from affiliate relationships and other clearly disclosed commercial relationships. Commercial relationships do not determine editorial scores or conclusions. Where a page contains an affiliate relationship, the relationship is disclosed so readers can understand the commercial context.</p>
              <p className="text-muted-foreground mb-4">Structured records can help keep reused values consistent, but source coverage and freshness vary by product. We aim to qualify or omit claims that cannot be supported, and readers should verify current pricing, features, and contractual terms with vendors before making a decision.</p>
              <h2 className="text-2xl font-bold mt-12 mb-4">Our values</h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: "Independent", desc: "Commercial relationships are disclosed and are not intended to determine editorial scores or conclusions." },
                  { title: "Evidence-led", desc: "Where ratings are shown, the methodology explains the criteria and calculation used." },
                  { title: "Transparent", desc: "Our methodology explains the scoring calculation and its limits." },
                  { title: "Helpful", desc: "Content should help readers compare relevant trade-offs and identify what to verify." },
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
