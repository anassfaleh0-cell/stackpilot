"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"

export interface ReviewCardItem {
  slug: string
  name: string
  category: string
  rating: number
  tagline: string
  priceRange?: string
}

const INITIAL_COUNT = 96
const LOAD_MORE = 48

export function ReviewCardGrid({ items }: { items: ReviewCardItem[] }) {
  const [visible, setVisible] = useState(INITIAL_COUNT)
  const shown = items.slice(0, visible)

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((tool) => (
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
      {visible < items.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisible((v) => v + LOAD_MORE)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-muted-bg px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Show more reviews ({items.length - visible} remaining)
          </button>
        </div>
      )}
    </>
  )
}
