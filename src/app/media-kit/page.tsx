import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { ExternalLink, Mail } from "lucide-react"

export const metadata = createMetadata({
  title: "Media Kit",
  description: "Comprehensive media kit for PilotStack — company fact sheet, editorial statistics, leadership information, and media resources for journalists and analysts.",
  path: "/media-kit",
})

const stats = [
  { value: "695+", label: "Published pages" },
  { value: "1.1M+", label: "Words of research" },
  { value: "100+", label: "Tools reviewed" },
  { value: "12", label: "Software categories" },
  { value: "5", label: "Expert analysts" },
  { value: "50+", label: "Years combined experience" },
  { value: "100,000+", label: "Aggregated user reviews analyzed" },
  { value: "2024", label: "Founded" },
]

const milestones = [
  { year: "2024 Q1", event: "PilotStack founded by industry analysts" },
  { year: "2024 Q2", event: "First 25 software reviews published" },
  { year: "2024 Q3", event: "Expanded to 6 categories; launched comparisons" },
  { year: "2024 Q4", event: "Added AI/ML and developer tools categories" },
  { year: "2025 Q1", event: "100+ reviews; launched research reports" },
  { year: "2025 Q2", event: "Built entity knowledge graph for structured content" },
  { year: "2025 Q3", event: "Expanded to 12 categories; launched industry pages" },
  { year: "2025 Q4", event: "Published 500+ pages of software research" },
  { year: "2026 Q1", event: "Launched statistics and data pages" },
  { year: "2026 Q2", event: "695+ pages, 1.1M+ words, full category coverage" },
]

const teamHighlights = [
  { name: "Alex Chen", role: "Senior Software Analyst", expertise: "Developer tools, AI platforms, productivity" },
  { name: "Sarah Mitchell", role: "CRM & Marketing Analyst", expertise: "CRM, marketing automation, sales tools" },
  { name: "Jordan Park", role: "Research Analyst", expertise: "Market research, data analysis, pricing" },
  { name: "Priya Sharma", role: "Editorial Director", expertise: "Content standards, fact-checking, quality" },
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
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is an independent software review and research platform that helps businesses make informed software purchasing decisions. Founded in 2024, the platform provides in-depth, hands-on reviews of B2B SaaS tools across 12 major categories.</p>
            <p className="text-muted-foreground leading-relaxed mb-4">Unlike aggregate review sites, PilotStack tests every product extensively before publishing verified ratings and comparisons. Our team of product analysts, industry specialists, and technical writers brings over 50 years of combined experience evaluating B2B software.</p>
            <p className="text-muted-foreground leading-relaxed">Our editorial independence policy guarantees that no vendor can pay for placement, ratings, or positive coverage. Revenue comes from clearly disclosed affiliate commissions and sponsored newsletter placements.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Editorial Standards</h2>
            <div className="space-y-3">
              {[
                { title: "Independent Testing", desc: "Every tool is tested hands-on by expert analysts before receiving a rating. No vendor can influence scores." },
                { title: "Standardized Methodology", desc: "All reviews follow a consistent two-week testing protocol with independently verified findings." },
                { title: "Transparent Criteria", desc: "Our scoring rubric evaluates features, pricing, usability, support, security, and performance on a 1-5 scale." },
                { title: "Regular Updates", desc: "Reviews are updated at least annually to reflect product changes, pricing updates, and market developments." },
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
            <div className="space-y-3">
              {teamHighlights.map((t) => (
                <div key={t.name} className="p-4 rounded-xl border border-border">
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.expertise}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">
              <Link href="/authors" className="text-primary hover:underline font-medium">View full team profiles →</Link>
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
