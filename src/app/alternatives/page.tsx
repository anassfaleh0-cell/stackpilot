import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllAlternatives } from "@/lib/content/registry"
import { REDIRECTED_ALTERNATIVE_SLUGS } from "@/lib/sitemap/redirected-content"
import { getPagination } from "@/lib/pagination"
import { PaginationNav } from "@/components/ui/pagination-nav"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Software Alternatives & Competitors 2026",
  description: "Compare software alternatives across categories using recorded product details, feature notes, and practical trade-offs for your needs.",
  path: "/alternatives",
})

export const dynamic = "force-static"

export default function AlternativesPage() {
  const allAlternatives = getAllAlternatives().filter((item) => !REDIRECTED_ALTERNATIVE_SLUGS.has(item.slug))
  const pagination = getPagination({ page: 1, perPage: 24, total: allAlternatives.length })
  const pageAlternatives = allAlternatives.slice(pagination.start, pagination.end)
  const grouped: Record<string, typeof allAlternatives> = {}
  pageAlternatives.forEach((alt) => {
    if (!grouped[alt.category]) grouped[alt.category] = []
    grouped[alt.category].push(alt)
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Alternatives", href: "/alternatives" }]} />
      <CollectionPageSchema name="Software Alternatives" description="Software alternatives with recorded product details, feature notes, and practical trade-offs" url={`${site.url}/alternatives`} />
      <Container className="pt-8 pb-16">
        <Breadcrumbs items={[{ name: "Alternatives" }]} />
        <h1 className="text-3xl font-bold tracking-tight mt-4 mb-2">Software Alternatives & Competitors</h1>
        <p className="text-muted-foreground mb-8">Compare alternatives by category and evaluate features, workflow fit, pricing, and trade-offs before choosing.</p>
        {Object.entries(grouped).map(([cat, alts]) => (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-bold mb-4">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alts.map((alt) => (
                <Link key={alt.slug} href={`/alternatives/${alt.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted-bg transition-all group">
                  <span className="font-medium text-sm">{alt.title}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        ))}
        <PaginationNav basePath="/alternatives" pagination={pagination} />

        <section className="mt-14 max-w-4xl border-t border-border pt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-3">How to compare software alternatives</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Start with the job the current product performs and the reason you are considering a change. A lower subscription price may not reduce total cost if migration, retraining, integration work, or lost functionality creates additional effort. Compare alternatives against the same requirements rather than relying on a universal ranking.</p>
          <h3 className="text-lg font-semibold mb-2">Use a consistent evaluation checklist</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-5">
            <li>List must-have workflows, users, permissions and integrations before shortlisting products.</li>
            <li>Verify current plan limits, data export, support terms and security documentation with the vendor.</li>
            <li>Run representative tasks in a trial or demo and record gaps, workarounds and administration effort.</li>
            <li>Estimate total cost, including implementation, migration, training, add-ons and contract renewal.</li>
            <li>Keep an exit plan: test whether records, attachments and audit history can be exported before switching.</li>
          </ul>
          <h3 className="text-lg font-semibold mb-2">Read product claims carefully</h3>
          <p className="text-muted-foreground leading-relaxed">Pricing, features and availability can change by plan, region and contract. Treat third-party ratings as one input, not proof that a product fits your workflow. Where a page identifies an evidence limitation, confirm the relevant detail using current primary documentation before making a purchase decision.</p>
        </section>
      </Container>
    </>
  )
}
