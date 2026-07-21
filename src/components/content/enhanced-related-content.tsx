// Sprint 20 Phase 2: Enhanced Related Content Engine — category/audience aware
import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Scale, BookOpen, Layers, GitCompare } from "lucide-react"

interface RelatedItem {
  slug: string
  type: string
  title?: string
  rating?: number
  category?: string
}

interface EnhancedRelatedContentProps {
  items?: RelatedItem[]
  title?: string
  maxItems?: number
  category?: string
  showTypeIcons?: boolean
}

const typeIcons: Record<string, React.ReactNode> = {
  review: <Star size={12} className="text-primary" />,
  comparison: <Scale size={12} className="text-primary" />,
  guide: <BookOpen size={12} className="text-primary" />,
  best: <Layers size={12} className="text-primary" />,
  alternative: <GitCompare size={12} className="text-primary" />,
}

const typeLabels: Record<string, string> = {
  review: "Review",
  comparison: "Comparison",
  guide: "Guide",
  best: "Best Of",
  alternative: "Alternatives",
  blog: "Article",
  research: "Research",
  statistics: "Statistics",
}

export function EnhancedRelatedContent({
  items,
  title = "Related Resources",
  maxItems = 6,
  category,
  showTypeIcons = true,
}: EnhancedRelatedContentProps) {
  if (!items || !items.length) return null

  return (
    <section className="mt-16 pt-8 border-t border-border" aria-label={`Related ${category || "resources"}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {category && (
        <p className="text-sm text-muted-foreground mb-4">
          More {category.toLowerCase()} resources to help you make informed decisions.
        </p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, maxItems).map((item) => (
          <RelatedCard key={`${item.type}-${item.slug}`} item={item} showIcon={showTypeIcons} />
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ item, showIcon }: { item: RelatedItem; showIcon: boolean }) {
  const href = `/${item.type === "review" ? "reviews" : item.type === "blog" ? "blog" : `${item.type}s`}/${item.slug}`

  return (
    <Link href={href} className="group">
      <Card className="h-full hover:border-primary/30 transition-all">
        <div className="flex items-center gap-2 mb-2">
          {showIcon && typeIcons[item.type]}
          <Badge variant="secondary" className="text-xs capitalize">
            {typeLabels[item.type] || item.type}
          </Badge>
        </div>
        <CardTitle className="text-sm group-hover:text-primary transition-colors capitalize">
          {item.title || item.slug.replace(/-/g, " ")}
        </CardTitle>
        {item.rating && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={11} className="fill-accent text-accent" />
            {item.rating}/5
          </div>
        )}
        <div className="mt-2 flex items-center text-xs text-primary gap-1">
          Read more <ArrowRight size={12} />
        </div>
      </Card>
    </Link>
  )
}
