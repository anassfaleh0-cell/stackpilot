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

export function ReviewCardGrid({ items }: { items: ReviewCardItem[] }) {
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((tool) => (
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
    </>
  )
}
