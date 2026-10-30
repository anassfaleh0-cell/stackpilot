import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { ExternalLink, Mail } from "lucide-react"
export const metadata = createMetadata({
  title: "Media Kit — PilotStack Brand Assets & Press Guidelines",
  description: "PilotStack fact sheet, editorial scope, brand resources, and contact information for journalists and analysts.",
  path: "/media-kit",
})

const stats = [
  { value: String(categories.length), label: "Software categories" },
  { value: "Reviews", label: "Product profiles" },
  { value: "Comparisons", label: "Head-to-head buyer guides" },
  { value: "Guides", label: "Workflow resources" },
]

const milestones = [
  { year: "2026", event: "Expanded coverage across reviews, comparisons, guides, research, and software categories" },
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
          <p className="text-lg text-muted-foreground mb-10">Fact sheet, editorial scope, and resources for journalists and industry analysts covering PilotStack.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Fact Sheet</h2>
            <p className="text-sm text-muted-foreground mb-4">This fact sheet describes PilotStack's public coverage areas. Category totals are derived from navigation data; no claim is made about audited reviews, independently tested products, or audience size.</p>
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
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is a software review and research publication that helps businesses evaluate software purchasing options. The platform publishes reviews, comparisons, guides, and research across a broad set of software categories.</p>
            <p className="text-muted-foreground leading-relaxed mb-4">The site combines product information, recorded profile data, and editorial decision frameworks. These are different kinds of evidence: some stored prices, ratings, feature flags, and review counts have not been independently revalidated. Where data is provisional, pages should identify that status and readers should confirm current terms and capabilities with the vendor. Editorial roles are listed on our <Link href="/authors" className="text-primary hover:underline">authors page</Link>, and the scoring approach is described on our <Link href="/methodology" className="text-primary hover:underline">methodology page</Link>.</p>
            <p className="text-muted-foreground leading-relaxed">Commercial relationships are disclosed where applicable. Editorial conclusions should be assessed against the evidence and limitations stated on each page, not treated as third-party review aggregates.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Editorial Standards</h2>
            <div className="space-y-3">
              {[
                { title: "Editorial Independence", desc: "Commercial relationships should be disclosed and must not determine editorial conclusions or recorded scores." },
                { title: "Evidence Status", desc: "Vendor-confirmed information, stored data, and editorial interpretation should be distinguished. Unverified records should not be presented as confirmed facts." },
                { title: "Transparent Criteria", desc: "The methodology explains the intended evaluation dimensions and weighting. Individual page data may be incomplete or awaiting verification; check the page-level disclosure." },
                { title: "Corrections and Updates", desc: "Readers can report inaccuracies and request corrections through the contact page. A displayed update date does not by itself mean every underlying figure has been rechecked." },
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
            <p className="text-muted-foreground leading-relaxed mb-4">PilotStack is maintained by a small editorial team. Public author profiles describe editorial roles and the site’s stated standards. Readers should consult the methodology and the evidence-status notes on individual reviews and comparisons before relying on a score or product claim.</p>
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
            <p className="text-sm text-muted-foreground mb-3">For press inquiries, interview requests, corrections, or partnership discussions:</p>
            <Link href="/contact" className="text-primary hover:underline font-medium text-sm">Contact our team →</Link>
            <div className="mt-4 flex gap-2">
              <Link href="/press" className="text-sm text-primary hover:underline flex items-center gap-1"><ExternalLink size={12} /> Brand Assets & Press Resources</Link>
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}
