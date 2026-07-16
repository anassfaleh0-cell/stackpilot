import Link from "next/link"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"
import type { ReviewContent, ComparisonContent, GuideContent, GlossaryContent, BlogContent } from "@/types/content"

type ContentItem = ReviewContent | ComparisonContent | GuideContent | GlossaryContent | BlogContent

interface RelatedContentProps {
  items: { slug: string; type: string }[]
  title?: string
  maxItems?: number
}

export function RelatedContent({ items, title = "Related Resources", maxItems = 3 }: RelatedContentProps) {
  if (!items.length) return null

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, maxItems).map((item) => (
          <RelatedCard key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ item }: { item: { slug: string; type: string } }) {
  const href = `/${item.type === "review" ? "reviews" : item.type === "blog" ? "blog" : `${item.type}s`}/${item.slug}`

  return (
    <Link href={href} className="group">
      <Card className="h-full hover:border-primary/30 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
        </div>
        <CardTitle className="text-sm group-hover:text-primary transition-colors capitalize">
          {item.slug.replace(/-/g, " ")}
        </CardTitle>
        <div className="mt-2 flex items-center text-xs text-primary gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Read more <ArrowRight size={12} />
        </div>
      </Card>
    </Link>
  )
}
