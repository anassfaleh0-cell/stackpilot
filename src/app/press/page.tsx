import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { Download, ExternalLink, Users, Newspaper, FileText, Image as ImageIcon } from "lucide-react"

export const metadata = createMetadata({
  title: "Press & Media",
  description: "Press kit, media assets, brand guidelines, and editorial resources for journalists, analysts, and partners covering PilotStack.",
  path: "/press",
})

const brandAssets = [
  { name: "Logo (SVG)", url: "/logo.svg", desc: "Full color logo on transparent background" },
  { name: "Logo Horizontal", url: "/logo-horizontal.svg", desc: "Horizontal layout for wide formats" },
  { name: "Logo Vertical", url: "/logo-vertical.svg", desc: "Vertical layout for square formats" },
  { name: "Logo Icon", url: "/logo-icon.svg", desc: "Icon-only variant for avatars" },
  { name: "Logo Monochrome", url: "/logo-monochrome.svg", desc: "Single-color version for grayscale" },
  { name: "OG Image", url: "/og.png", desc: "Default social sharing image (1200x630)" },
  { name: "Favicon", url: "/favicon.svg", desc: "Browser tab icon" },
  { name: "Apple Touch Icon", url: "/apple-touch-icon.png", desc: "iOS home screen icon" },
]

const pressMentions = [
  { outlet: "PilotStack Blog", title: "Latest Research & Reports", url: "/blog", date: "2026" },
  { outlet: "PilotStack Reviews", title: "Software Review Library", url: "/reviews", date: "2026" },
]

export default function PressPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Press & Media", href: "/press" }]} />
      <WebPageSchema name="Press & Media" description="Press kit and media resources for PilotStack." url={`${site.url}/press`} />
      <Container className="pt-8 pb-20">
        <Breadcrumbs items={[{ name: "Press & Media", href: "/press" }]} />
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Press &amp; Media</h1>
          <p className="text-lg text-muted-foreground mb-10">Resources for journalists, analysts, and partners covering PilotStack&apos;s software reviews, research, and industry analysis.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Newspaper size={20} /> About PilotStack</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is an independent software review and research platform. We provide in-depth, hands-on reviews of B2B SaaS tools across 12 categories, helping businesses make informed software purchasing decisions. Our team of expert analysts tests every product extensively before publishing verified ratings and comparisons.</p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl border border-border"><div className="font-bold text-2xl text-primary">695+</div><div className="text-muted-foreground">Published pages</div></div>
              <div className="p-4 rounded-xl border border-border"><div className="font-bold text-2xl text-primary">1.1M+</div><div className="text-muted-foreground">Words of research</div></div>
              <div className="p-4 rounded-xl border border-border"><div className="font-bold text-2xl text-primary">12</div><div className="text-muted-foreground">Software categories</div></div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><ImageIcon size={20} /> Brand Assets</h2>
            <p className="text-muted-foreground mb-4">Download our brand assets for use in articles, presentations, and media coverage.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {brandAssets.map((asset) => (
                <a key={asset.name} href={asset.url} download className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted-bg transition-colors group">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"><Download size={16} /></div>
                  <div><div className="font-medium text-sm">{asset.name}</div><div className="text-xs text-muted-foreground">{asset.desc}</div></div>
                </a>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><FileText size={20} /> Editorial Resources</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: "Editorial Policy", desc: "Our standards and practices", href: "/editorial-policy" },
                { title: "Review Methodology", desc: "How we test and rate software", href: "/methodology" },
                { title: "Research Methodology", desc: "Our research approach", href: "/research-methodology" },
                { title: "Fact-Checking Policy", desc: "Accuracy and verification", href: "/fact-checking-policy" },
                { title: "Editorial Independence", desc: "No paid placements policy", href: "/editorial-independence" },
                { title: "How We Test Software", desc: "Hands-on testing process", href: "/how-we-test-software" },
              ].map((r) => (
                <Link key={r.title} href={r.href} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted-bg transition-colors group">
                  <div className="font-medium text-sm group-hover:text-primary transition-colors">{r.title}</div>
                  <div className="text-xs text-muted-foreground ml-auto">{r.desc}</div>
                  <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Users size={20} /> Contact</h2>
            <p className="text-muted-foreground mb-4">For press inquiries, partnership opportunities, or media interview requests:</p>
            <div className="p-4 rounded-xl border border-border"><a href="/contact" className="text-primary hover:underline font-medium">Contact our press team →</a></div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Newspaper size={20} /> Press Mentions</h2>
            <div className="space-y-3">
              {pressMentions.map((m) => (
                <a key={m.title} href={m.url} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted-bg transition-colors group">
                  <div><div className="font-medium text-sm group-hover:text-primary transition-colors">{m.title}</div><div className="text-xs text-muted-foreground">{m.outlet} · {m.date}</div></div>
                  <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}
