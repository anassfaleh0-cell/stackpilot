"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type SearchResult = {
  title: string
  description: string
  url: string
  category: string
  type: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

  if (loading) return <p className="text-muted text-sm text-center py-12" role="status">Searching...</p>

  if (searched && !loading && results.length === 0) {
    return (
      <div role="status" className="py-12 text-center">
        <p className="text-lg font-medium mb-2">No results found</p>
        <p className="text-muted text-sm">Try a different search term or browse our <Link href="/reviews" className="text-primary hover:underline">reviews</Link>.</p>
      </div>
    )
  }

  if (results.length > 0) {
    return (
      <div className="space-y-3 text-left" role="list">
        <p className="text-sm text-muted mb-4">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</p>
        {results.map((result) => (
          <Link key={result.url} href={result.url}>
            <Card className="hover:border-primary/30 transition-colors" role="listitem">
              <div className="text-xs text-muted mb-1">{result.type} · {result.category}</div>
              <div className="font-semibold mb-0.5">{result.title}</div>
              <div className="text-sm text-muted">{result.description}</div>
            </Card>
          </Link>
        ))}
      </div>
    )
  }

  return null
}

export function SearchForm() {
  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Search PilotStack</h1>
      <form action="/search" method="GET" className="flex gap-3 mb-8">
        <input
          type="search"
          name="q"
          placeholder="Search reviews, guides, tools..."
          aria-label="Search PilotStack"
          className="flex-1 h-12 px-4 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        <Button type="submit" size="lg">Search</Button>
      </form>
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
