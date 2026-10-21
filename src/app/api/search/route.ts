import generatedSearchIndex from "@/lib/search/generated-index.json"
import { categories } from "@/lib/constants"

interface SearchResult {
  title: string
  description: string
  url: string
  category: string
  type: "review" | "comparison" | "guide" | "glossary" | "blog" | "category"
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  if (!q || q.trim().length < 2) {
    return new Response(JSON.stringify({ results: [], query: q }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  const query = q.toLowerCase().trim()
  const match = (text: string) => text.toLowerCase().includes(query)

  const searchableContent: SearchResult[] = [
    ...generatedSearchIndex,
    ...categories.map((c) => ({
      title: `${c.name} Software`,
      description: `Browse the best ${c.name.toLowerCase()} tools and software`,
      url: `/category/${c.slug}`,
      category: c.name,
      type: "category" as const,
    })),
  ]

  const results = searchableContent
    .filter((item) => match(item.title) || match(item.description) || match(item.category))
    .slice(0, 20)

  return new Response(JSON.stringify({ results, query }), {
    headers: { "Content-Type": "application/json" },
  })
}
