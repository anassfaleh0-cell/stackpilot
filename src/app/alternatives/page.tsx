import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllAlternatives } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Software Alternatives & Competitors 2026",
  description: "Comprehensive comparisons of software alternatives across every major category. Find the best tools for your specific needs with expert analysis and side-by-side feature comparisons.",
  path: "/alternatives",
})

export default async function AlternativesPage() {
  const allAlternatives = getAllAlternatives()
  const grouped: Record<string, typeof allAlternatives> = {}
  allAlternatives.forEach((alt) => {
    if (!grouped[alt.category]) grouped[alt.category] = []
    grouped[alt.category].push(alt)
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Alternatives", href: "/alternatives" }]} />
      <CollectionPageSchema name="Software Alternatives" description="Find the best software alternatives with expert comparisons and feature analysis." url={`${site.url}/alternatives`} />
      <Container className="pt-8 pb-16">
        <Breadcrumbs items={[{ name: "Alternatives" }]} />
        <h1 className="text-3xl font-bold tracking-tight mt-4 mb-2">Software Alternatives & Competitors</h1>
        <p className="text-muted-foreground mb-8">Expert-curated alternatives for every major software category. Find the right tool for your needs.</p>
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
