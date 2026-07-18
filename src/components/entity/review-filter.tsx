"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react"

interface ReviewFilterProps {
  reviews: Array<{
    slug: string
    name: string
    tagline: string
    category: string
    rating: number
    priceRange?: string
    pricing?: string
  }>
  category: string
}

export function ReviewFilter({ reviews, category }: ReviewFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.tagline.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (minRating > 0 && r.rating < minRating) return false
      if (priceFilter === "free" && r.pricing !== "Free" && r.pricing !== "Freemium") return false
      if (priceFilter === "paid" && (r.pricing === "Free" || r.pricing === "Freemium")) return false
      return true
    })
  }, [reviews, searchQuery, minRating, priceFilter])

  const hasActiveFilters = searchQuery || minRating > 0 || priceFilter !== "all"

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm transition-colors ${showFilters || hasActiveFilters ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={() => { setSearchQuery(""); setMinRating(0); setPriceFilter("all") }}
            className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-xl border border-border bg-muted-bg/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Min rating:</span>
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${minRating === r ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Pricing:</span>
            {[
              { value: "all", label: "All" },
              { value: "free", label: "Free" },
              { value: "paid", label: "Paid" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceFilter(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${priceFilter === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool) => (
            <Link key={tool.slug} href={`/reviews/${tool.slug}`} className="group card-hover">
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary">{tool.category}</Badge>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent">
                    <Star size={14} className="fill-accent text-accent" />
                    {tool.rating}
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                <CardDescription className="mt-1.5">{tool.tagline}</CardDescription>
                {tool.priceRange && <p className="text-xs text-muted-foreground mt-2">{tool.priceRange}</p>}
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                  Read review <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tools match your filters. Try adjusting your search.</p>
        </div>
      )}

      {filtered.length > 0 && filtered.length !== reviews.length && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Showing {filtered.length} of {reviews.length} tools
        </p>
      )}
    </div>
  )
}
