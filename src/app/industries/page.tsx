import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllIndustries } from "@/lib/content/registry"
import { getPagination, parsePageParam } from "@/lib/pagination"
import { PaginationNav } from "@/components/ui/pagination-nav"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Industry Software Selection Guides",
  description: "Practical software selection guides for healthcare, construction, education, finance, retail, and other industries, with criteria for workflow fit, integrations, data protection, and total cost.",
  path: "/industries",
})

export default async function IndustriesPage({ searchParams }: { searchParams?: Promise<{ page?: string | string[] }> }) {
  const params = await searchParams
  const industries = getAllIndustries()
  const pagination = getPagination({ page: parsePageParam(params?.page), perPage: 24, total: industries.length })
  const pageIndustries = industries.slice(pagination.start, pagination.end)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }]} />
      <CollectionPageSchema name="Software by Industry" description="Practical software selection guides by industry" url={`${site.url}/industries`} />
      <Container className="pt-8 pb-16">
        <Breadcrumbs items={[{ name: "Industries" }]} />
        <h1 className="text-3xl font-bold tracking-tight mt-4 mb-2">Software by Industry</h1>
        <p className="text-muted-foreground mb-8">Explore industry-specific workflows, software needs, implementation considerations, and questions to verify with current vendor documentation.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pageIndustries.map((ind) => (
            <Link key={ind.slug} href={`/industries/${ind.slug}`}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted-bg transition-all group">
              <span className="font-medium text-sm">{ind.title}</span>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
          <PaginationNav basePath="/industries" pagination={pagination} />
          <section className="mt-14 max-w-4xl mx-auto border-t border-border pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Evaluate software against industry workflows</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Industry labels can help build a shortlist, but they do not prove that a product meets a particular organization's operational or regulatory requirements. Start with the process the team needs to support, the data it handles, and the systems it already uses.</p>
            <h3 className="text-lg font-semibold mb-2">A practical selection checklist</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-5">
              <li>Map the end-to-end workflow, including approvals, exceptions and handoffs between teams.</li>
              <li>Verify integrations, import/export options and ownership of records when a contract ends.</li>
              <li>Review permissions, audit trails, retention, data location and vendor security documentation.</li>
              <li>Test the product with representative tasks and users instead of relying only on a sales demonstration.</li>
              <li>Estimate implementation, migration, training, support and ongoing administration alongside subscription cost.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">Requirements differ by country, organization and use case. Treat the guides as a starting point, verify current product capabilities with primary vendor sources, and obtain appropriate professional advice when legal or regulatory obligations apply.</p>
          </section>
      </Container>
    </>
  )
}
