import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { SearchForm } from "@/components/pages/search-form"

export const metadata = createMetadata({ title: "Search", description: "Search PilotStack for software reviews, comparisons, guides and more.", path: "/search", noIndex: true })

export default function SearchPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Search", href: "/search" }]} />
    <Container className="pt-8">
      <Breadcrumbs items={[{ name: "Search" }]} />
      <div className="py-24">
        <SearchForm />
      </div>
    </Container>
    </>
  )
}
