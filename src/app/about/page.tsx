import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { SocialLinkList } from "@/components/brand/social-icons"

export const metadata = createMetadata({
  title: "About PilotStack — Our Mission & Editorial Standards",
  description: "PilotStack helps people research software with practical comparisons, buyer-focused guides, and transparent notes about evidence and limitations.",
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
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">PilotStack is an independently operated software research publication built to make software research easier to navigate. It brings reviews, comparisons, guides, and structured product information into one place so readers can compare options and identify what they still need to verify with the vendor.</p>
              <p className="text-muted-foreground mb-4">Software research can be difficult because pricing, features, positioning, and product capabilities change over time. PilotStack focuses on making those decision factors easier to compare, while clearly separating recorded information from editorial guidance.</p>
              <p className="text-muted-foreground mb-4">I built PilotStack to make those decisions clearer. Our published methodology sets out the criteria we use and the evidence a claim needs before it should be treated as verified. Some older numeric scores and review-count figures are still undergoing a source audit, so a displayed number should not be assumed to represent independently verified user sentiment unless its source and calculation are documented. We are correcting, qualifying, or removing unsupported claims as the audit identifies them.</p>
              <p className="text-muted-foreground mb-4">PilotStack may earn revenue from affiliate relationships and other clearly disclosed commercial relationships. Commercial relationships do not determine editorial scores or conclusions. Where a page contains an affiliate relationship, the relationship is disclosed so readers can understand the commercial context.</p>
              <p className="text-muted-foreground mb-4">Our goal is to make the evidence behind software decisions easier to inspect. We publish our methodology, distinguish editorial judgment from verified facts where possible, and invite readers to report errors through our contact page. The site is being reviewed to bring older content into line with those standards.</p>
              <h2 className="text-2xl font-bold mt-12 mb-4">Our values</h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: "Independent", desc: "Commercial relationships are disclosed and are not intended to determine editorial scores or conclusions." },
                  { title: "Evidence-led", desc: "Where ratings are shown, the methodology explains the criteria and calculation used." },
                  { title: "Transparent", desc: "Our methodology explains the criteria and evidence standards behind our conclusions, including current verification limits." },
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
