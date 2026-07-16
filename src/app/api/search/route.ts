import { getAllReviews, getAllComparisons, getAllGuides, getAllGlossaryTerms, getAllBlogPosts } from "@/lib/content/registry"
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
    ...getAllReviews().map((r) => ({
      title: r.name, description: r.tagline, url: `/reviews/${r.slug}`, category: r.category, type: "review" as const,
    })),
    ...getAllComparisons().map((c) => ({
      title: c.title, description: c.description, url: `/comparisons/${c.slug}`, category: c.category, type: "comparison" as const,
    })),
    ...getAllGuides().map((g) => ({
      title: g.title, description: g.description, url: `/guides/${g.slug}`, category: g.category, type: "guide" as const,
    })),
    ...getAllGlossaryTerms().map((t) => ({
      title: t.term, description: t.definition, url: `/glossary/${t.slug}`, category: t.category, type: "glossary" as const,
    })),
    ...getAllBlogPosts().map((p) => ({
      title: p.title, description: p.description, url: `/blog/${p.slug}`, category: p.category, type: "blog" as const,
    })),
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
