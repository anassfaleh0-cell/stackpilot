import { Container } from "@/components/ui/container"
import { createMetadata } from "@/lib/metadata"
import { SearchForm } from "@/components/pages/search-form"

export const metadata = createMetadata({ title: "Search", description: "Search StackPilot for software reviews, comparisons, guides and more.", path: "/search", noIndex: true })

export default function SearchPage() {
  return (
    <Container className="py-32">
      <SearchForm />
    </Container>
  )
}
