import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllIndustries } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Best Software by Industry 2026",
  description: "Find the best software for your industry. Expert-curated recommendations for healthcare, construction, education, finance, legal, retail, and more.",
  path: "/industries",
})

export default async function IndustriesPage() {
  const industries = getAllIndustries()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }]} />
      <CollectionPageSchema name="Software by Industry" description="Find the best software for your industry." url={`${site.url}/industries`} />
      <Container className="pt-8 pb-16">
        <Breadcrumbs items={[{ name: "Industries" }]} />
        <h1 className="text-3xl font-bold tracking-tight mt-4 mb-2">Software by Industry</h1>
        <p className="text-muted-foreground mb-8">Expert-curated software recommendations tailored to your industry's unique requirements.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {industries.map((ind) => (
            <Link key={ind.slug} href={`/industries/${ind.slug}`}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted-bg transition-all group">
              <span className="font-medium text-sm">{ind.title}</span>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
