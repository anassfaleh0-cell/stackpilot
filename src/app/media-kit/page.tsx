import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { ExternalLink, Mail } from "lucide-react"
import sitemapRoute from "@/app/sitemap"

const sitemapEntries = sitemapRoute()
const countIn = (segment: string) => sitemapEntries.filter((e) => e.url.includes(segment)).length
const totalUrls = sitemapEntries.length

export const metadata = createMetadata({
  title: "Media Kit — PilotStack Brand Assets & Press Guidelines",
  description: "Comprehensive media kit for PilotStack — company fact sheet, editorial statistics, leadership information, and media resources for journalists and analysts.",
  path: "/media-kit",
})

const stats = [
  { value: String(totalUrls), label: "Published pages" },
  { value: "1.1M+", label: "Words of research" },
  { value: String(countIn("/reviews/")), label: "In-depth tool reviews" },
  { value: "12", label: "Software categories" },
  { value: String(countIn("/comparisons/")), label: "Published comparisons" },
  { value: "2024", label: "Founded" },
]

const milestones = [
  { year: "2024 Q1", event: "PilotStack founded" },
  { year: "2024 Q2", event: "First 25 software reviews published" },
  { year: "2024 Q3", event: "Expanded to 6 categories; launched comparisons" },
  { year: "2024 Q4", event: "Added AI/ML and developer tools categories" },
  { year: "2025 Q1", event: "100+ reviews; launched research reports" },
  { year: "2025 Q2", event: "Built entity knowledge graph for structured content" },
  { year: "2025 Q3", event: "Expanded to 12 categories; launched industry pages" },
  { year: "2025 Q4", event: "Published 500+ pages of software research" },
  { year: "2026 Q1", event: "Launched statistics and data pages" },
  { year: "2026 Q2", event: "Full category coverage across reviews, comparisons, and guides" },
]

export default function MediaKitPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Media Kit", href: "/media-kit" }]} />
      <WebPageSchema name="Media Kit" description="PilotStack media kit for journalists and analysts." url={`${site.url}/media-kit`} />
      <Container className="pt-8 pb-20">
        <Breadcrumbs items={[{ name: "Media Kit", href: "/media-kit" }]} />
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Media Kit</h1>
          <p className="text-lg text-muted-foreground mb-10">Fact sheet, statistics, and resources for journalists and industry analysts covering PilotStack.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Fact Sheet</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="p-4 rounded-xl border border-border text-center">
                  <div className="font-bold text-2xl text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">About PilotStack</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is an independent software review and research platform that helps businesses make informed software purchasing decisions. Founded in 2024, the platform publishes in-depth reviews of B2B SaaS tools across 12 major categories.</p>
            <p className="text-muted-foreground leading-relaxed mb-4">Unlike aggregate review sites, PilotStack records every figure once and reuses it everywhere a tool appears, so ratings and review counts agree across the site. The site is run by a small, independent team following a published methodology — editorial roles are listed on our <Link href="/authors" className="text-primary hover:underline">authors page</Link>, and the full scoring process is public on our <Link href="/methodology" className="text-primary hover:underline">methodology page</Link>.</p>
            <p className="text-muted-foreground leading-relaxed">Our editorial independence policy guarantees that no vendor can pay for placement, ratings, or positive coverage. Revenue comes from clearly disclosed affiliate commissions and sponsored newsletter placements.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Editorial Standards</h2>
            <div className="space-y-3">
              {[
                { title: "Independent Coverage", desc: "No vendor can pay for placement, ratings, or coverage. Scores are never adjusted for commercial relationship." },
                { title: "Standardized Methodology", desc: "Every page follows the same published scoring and sourcing rules, applied consistently across categories." },
                { title: "Transparent Criteria", desc: "Nine recorded category scores on a 1-5 scale, each equally weighted, with the overall rating as their mean." },
                { title: "Regular Updates", desc: "Pages are revisited when pricing, features, or product positioning change materially, and carry a last-reviewed date." },
              ].map((s) => (
                <div key={s.title} className="p-4 rounded-xl border border-border">
                  <div className="font-medium text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Team</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is run by a small, independent team. Every page follows our published methodology: nine recorded category scores on a 1-5 scale with the overall rating as their mean, one recorded source per figure, and no unsourced fact stated as confirmed. Editorial roles are listed on our <Link href="/authors" className="text-primary hover:underline">authors page</Link>.</p>
            <div className="mt-4 text-sm">
              <Link href="/methodology" className="text-primary hover:underline">Read our full methodology →</Link>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Timeline</h2>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.year} className="flex items-start gap-3 p-3 rounded-xl border border-border text-sm">
                  <span className="font-semibold text-primary shrink-0 w-20">{m.year}</span>
                  <span className="text-muted-foreground">{m.event}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Categories Covered</h2>
            <div className="flex flex-wrap gap-2">
              {["AI & ML", "Project Management", "CRM & Sales", "Analytics", "HR & People", "Marketing", "Developer Tools", "Design", "Finance & Accounting", "Customer Support", "Security", "Communication"].map((cat) => (
                <span key={cat} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium">{cat}</span>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-xl bg-muted-bg border border-border">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><Mail size={18} /> Media Contact</h2>
            <p className="text-sm text-muted-foreground mb-3">For press inquiries, interview requests, or partnership discussions:</p>
            <Link href="/contact" className="text-primary hover:underline font-medium text-sm">Contact our team →</Link>
            <div className="mt-4 flex gap-2">
              <Link href="/press" className="text-sm text-primary hover:underline flex items-center gap-1"><ExternalLink size={12} /> Brand Assets & Press Kit</Link>
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}
