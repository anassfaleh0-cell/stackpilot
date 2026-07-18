import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllUseCases } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Software Use Cases & Buyer Guides 2026",
  description: "Find the best software for your specific use case. Expert-curated recommendations for startups, enterprises, agencies, and more across every software category.",
  path: "/use-cases",
})

export default async function UseCasesPage() {
  const allUseCases = getAllUseCases()
  const grouped: Record<string, typeof allUseCases> = {}
  allUseCases.forEach((uc) => {
    if (!grouped[uc.category]) grouped[uc.category] = []
    grouped[uc.category].push(uc)
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Use Cases", href: "/use-cases" }]} />
      <CollectionPageSchema name="Software Use Cases" description="Find the best software for your specific use case." url={`${site.url}/use-cases`} />
      <Container className="pt-8 pb-16">
        <Breadcrumbs items={[{ name: "Use Cases" }]} />
        <h1 className="text-3xl font-bold tracking-tight mt-4 mb-2">Software Use Cases</h1>
        <p className="text-muted-foreground mb-8">Expert-curated recommendations for every use case. Find the right software for your specific needs.</p>
        {Object.entries(grouped).map(([cat, useCases]) => (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-bold mb-4">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {useCases.map((uc) => (
                <Link key={uc.slug} href={`/use-cases/${uc.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted-bg transition-all group">
                  <span className="font-medium text-sm">{uc.title}</span>
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
