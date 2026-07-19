import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { Download } from "lucide-react"

export const metadata = createMetadata({
  title: "Brand Assets & Guidelines",
  description: "Download PilotStack brand assets including logos, color palette, typography specifications, and brand usage guidelines for partners and media.",
  path: "/brand-assets",
})

const brandColors = [
  { name: "Primary Blue", hex: "#5472E8", role: "Primary brand color — used for buttons, links, and key UI elements" },
  { name: "Primary Dark", hex: "#3B5BCC", role: "Hover state for primary elements" },
  { name: "Accent", hex: "#F59E0B", role: "Accent color — used for ratings, stars, and highlights" },
  { name: "Background", hex: "#FFFFFF", role: "Light mode page background" },
  { name: "Dark Background", hex: "#0C0E14", role: "Dark mode page background" },
  { name: "Surface", hex: "#F8F9FC", role: "Light mode card/section backgrounds" },
  { name: "Border", hex: "#E2E6F0", role: "Border color for cards, dividers, and inputs" },
  { name: "Foreground", hex: "#1A1D2E", role: "Primary text color (light mode)" },
  { name: "Muted", hex: "#6B7280", role: "Secondary/muted text" },
]

const assets = [
  { name: "Logo (SVG)", file: "logo.svg", desc: "Full color logo on transparent background", category: "Logos" },
  { name: "Logo Horizontal", file: "logo-horizontal.svg", desc: "Horizontal layout for wide formats", category: "Logos" },
  { name: "Logo Vertical", file: "logo-vertical.svg", desc: "Vertical layout for square formats", category: "Logos" },
  { name: "Logo Icon", file: "logo-icon.svg", desc: "Icon-only variant for avatars and favicons", category: "Logos" },
  { name: "Logo Monochrome", file: "logo-monochrome.svg", desc: "Single-color version for grayscale printing", category: "Logos" },
  { name: "OG Image", file: "og.png", desc: "Default social sharing image (1200x630)", category: "Social" },
  { name: "Favicon", file: "favicon.svg", desc: "Browser tab icon", category: "Web" },
  { name: "Apple Touch Icon", file: "apple-touch-icon.png", desc: "iOS home screen icon (180x180)", category: "Web" },
]

export default function BrandAssetsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Brand Assets", href: "/brand-assets" }]} />
      <WebPageSchema name="Brand Assets & Guidelines" description="PilotStack brand assets, color palette, and usage guidelines." url={`${site.url}/brand-assets`} />
      <Container className="pt-8 pb-20">
        <Breadcrumbs items={[{ name: "Brand Assets", href: "/brand-assets" }]} />
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Brand Assets &amp; Guidelines</h1>
          <p className="text-lg text-muted-foreground mb-10">Resources for partners, media, and contributors using the PilotStack brand.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Color Palette</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {brandColors.map((c) => (
                <div key={c.name} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg shrink-0 border border-border" style={{ backgroundColor: c.hex }} />
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.hex}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Typography</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border">
                <div className="text-sm text-muted-foreground mb-1">Primary Font</div>
                <div className="text-xl font-semibold" style={{ fontFamily: "Geist, Inter, system-ui, sans-serif" }}>Geist Sans</div>
                <div className="text-xs text-muted-foreground mt-1">Used for all headings, body text, and UI elements</div>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="text-sm text-muted-foreground mb-1">Mono Font</div>
                <div className="text-xl" style={{ fontFamily: "Geist Mono, JetBrains Mono, monospace" }}>Geist Mono</div>
                <div className="text-xs text-muted-foreground mt-1">Used for code blocks and technical content</div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Logo Usage Guidelines</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="p-4 rounded-xl border border-border">
                <div className="font-medium text-foreground mb-1">Clear Space</div>
                <p>Maintain clear space around the logo equal to the height of the logo mark on all sides. Do not place other elements within this space.</p>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="font-medium text-foreground mb-1">Minimum Size</div>
                <p>The logo should never be displayed smaller than 24px in height for digital use or 0.25 inches for print.</p>
              </div>
              <div className="p-4 rounded-xl border border-border">
                <div className="font-medium text-foreground mb-1">Do Not</div>
                <ul className="list-disc pl-4 space-y-1 mt-2">
                  <li>Stretch, skew, or rotate the logo</li>
                  <li>Change the logo colors</li>
                  <li>Add drop shadows or effects</li>
                  <li>Place on low-contrast backgrounds</li>
                  <li>Recreate or redraw the logo</li>
                  <li>Use the icon without the wordmark in header layouts</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Download Assets</h2>
            {["Logos", "Social", "Web"].map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">{category}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {assets.filter((a) => a.category === category).map((asset) => (
                    <a key={asset.name} href={`/${asset.file}`} download className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted-bg transition-colors group">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"><Download size={16} /></div>
                      <div>
                        <div className="font-medium text-sm">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="p-6 rounded-xl bg-muted-bg border border-border">
            <h2 className="text-lg font-bold mb-2">Brand Voice</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">PilotStack&apos;s brand voice is authoritative yet approachable. We write as expert peers — not marketers. Our tone is direct, evidence-based, and transparent. We avoid hype, jargon, and exaggerated claims.</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use plain language — explain technical concepts clearly</li>
              <li>• Lead with evidence — cite sources, data, and methodology</li>
              <li>• Be honest — acknowledge limitations and trade-offs</li>
              <li>• Stay objective — no superlatives without justification</li>
            </ul>
          </section>
        </div>
      </Container>
    </>
  )
}
