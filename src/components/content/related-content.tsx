import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { isContentAvailable, getContentTitle } from "@/lib/content/registry"

interface RelatedItem {
  slug: string
  type: string
  title?: string
}

interface RelatedContentProps {
  items: RelatedItem[]
  title?: string
  maxItems?: number
}

const ROUTE_FOR_TYPE: Record<string, string> = {
  review: "reviews",
  blog: "blog",
  guide: "guides",
  comparison: "comparisons",
  alternative: "alternatives",
  best: "best",
  glossary: "glossary",
  research: "research",
  statistics: "statistics",
  "use-case": "use-cases",
  industry: "industries",
  hub: "hubs",
  category: "category",
}

const REVIEW_SLUG_ALIASES: Record<string, string> = {
  // This legacy product-name slug has no page of its own; use the existing canonical review.
  "acuity-scheduling": "acuity",
}

function resolveItem(item: RelatedItem): RelatedItem | null {
  if (!ROUTE_FOR_TYPE[item.type]) return null
  const slug = item.type === "review" ? (REVIEW_SLUG_ALIASES[item.slug] || item.slug) : item.slug
  // Category landing pages are a separate route family, not records in the content registry.
  if (item.type === "category") return { ...item, slug }
  const registryType = item.type === "statistics" ? "statistic" : item.type
  if (!isContentAvailable(registryType, slug)) return null
  return { ...item, slug, title: getContentTitle(registryType, slug) || item.title }
}

export function RelatedContent({ items, title = "Related Resources", maxItems = 3 }: RelatedContentProps) {
  const availableItems = items.map(resolveItem).filter((item): item is RelatedItem => item !== null).slice(0, maxItems)
  if (!availableItems.length) return null

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableItems.map((item) => (
          <RelatedCard key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ item }: { item: RelatedItem }) {
  const href = `/${ROUTE_FOR_TYPE[item.type] ?? `${item.type}s`}/${item.slug}`

  return (
    <Link href={href} className="group">
      <Card className="h-full hover:border-primary/30 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
        </div>
        <CardTitle className="text-sm group-hover:text-primary transition-colors capitalize">
          {item.title || item.slug.replace(/-/g, " ")}
        </CardTitle>
        <div className="mt-2 flex items-center text-xs text-primary gap-1">
          Read more <ArrowRight size={12} />
        </div>
      </Card>
    </Link>
  )
}
