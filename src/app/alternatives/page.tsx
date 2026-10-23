import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllAlternatives } from "@/lib/content/registry"
import { REDIRECTED_ALTERNATIVE_SLUGS } from "@/lib/sitemap/redirected-content"
import { getPagination } from "@/lib/pagination"
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
      </Container>
    </>
  )
}
