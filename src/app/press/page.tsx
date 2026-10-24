import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { Download, ExternalLink, Users, Newspaper, FileText, Image as ImageIcon } from "lucide-react"
import sitemapRoute from "@/app/sitemap"

const publishedPages = sitemapRoute().length

export const metadata = createMetadata({
  title: "Press & Media — PilotStack News, Logos & Interviews",
  description: "Press resources, brand assets, editorial policies, and contact information for journalists, analysts, and partners covering PilotStack.",
  path: "/press",
})

const brandAssets = [
  { name: "Logo (SVG)", url: "/logo.svg", desc: "Full color logo on transparent background" },
  { name: "Logo Horizontal", url: "/logo-horizontal.svg", desc: "Horizontal layout for wide formats" },
  { name: "Logo Vertical", url: "/logo-vertical.svg", desc: "Vertical layout for square formats" },
  { name: "Logo Dark", url: "/logo-dark.svg", desc: "Light-on-dark variant for navy backgrounds" },
  { name: "Logo Icon", url: "/logo-icon.svg", desc: "Icon-only variant for avatars" },
  { name: "Logo Monochrome", url: "/logo-monochrome.svg", desc: "Single-color version for grayscale" },
  { name: "OG Image", url: "/og.png", desc: "Default social sharing image (1200x630)" },
  { name: "Favicon", url: "/favicon.svg", desc: "Browser tab icon" },
  { name: "Apple Touch Icon", url: "/apple-touch-icon.png", desc: "iOS home screen icon" },
]

const siteResources = [
  { outlet: "PilotStack", title: "Research & Reports", url: "/blog" },
  { outlet: "PilotStack", title: "Software Review Library", url: "/reviews" },
  { outlet: "PilotStack", title: "Editorial Methodology", url: "/methodology" },
]

export default function PressPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Press & Media", href: "/press" }]} />
      <WebPageSchema name="Press & Media" description="Press resources and brand assets for PilotStack." url={`${site.url}/press`} />
      <Container className="pt-8 pb-20">
        <Breadcrumbs items={[{ name: "Press & Media", href: "/press" }]} />
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Press &amp; Media</h1>
          <p className="text-lg text-muted-foreground mb-10">Resources for journalists, analysts, and partners covering PilotStack’s software reviews, research, and editorial standards.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Newspaper size={20} /> About PilotStack</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is an independently operated software research publication. We publish reviews, comparisons, and buying resources across 12 software categories. Some product fields in the underlying dataset are provisional or unverified; each page’s evidence-status notes should be read before relying on a recorded rating, review count, feature, or price.</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl border border-border"><div className="font-bold text-2xl text-primary">{publishedPages}</div><div className="text-muted-foreground">URLs listed in sitemap</div></div>
              <div className="p-4 rounded-xl border border-border"><div className="font-bold text-2xl text-primary">12</div><div className="text-muted-foreground">Software categories</div></div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">The URL count is generated from the sitemap and is not a measure of readership, independent validation, or editorial depth.</p>
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
                { title: "Review Methodology", desc: "How we score and rate software", href: "/methodology" },
                { title: "Research Methodology", desc: "Our research approach", href: "/research-methodology" },
                { title: "Fact-Checking Policy", desc: "Accuracy and verification", href: "/fact-checking-policy" },
                { title: "Editorial Independence", desc: "Commercial independence policy", href: "/editorial-independence" },
                { title: "How We Evaluate Software", desc: "Our evaluation process", href: "/how-we-test-software" },
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
            <p className="text-muted-foreground mb-4">For press inquiries, corrections, partnership opportunities, or media interview requests:</p>
            <div className="p-4 rounded-xl border border-border"><Link href="/contact" className="text-primary hover:underline font-medium">Contact PilotStack →</Link></div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2"><Newspaper size={20} /> PilotStack Resources</h2>
            <div className="space-y-3">
              {siteResources.map((resource) => (
                <Link key={resource.title} href={resource.url} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted-bg transition-colors group">
                  <div><div className="font-medium text-sm group-hover:text-primary transition-colors">{resource.title}</div><div className="text-xs text-muted-foreground">{resource.outlet}</div></div>
                  <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                </Link>
              ))}
          </div>
          </section>
        </div>
      </Container>
    </>
  )
}
