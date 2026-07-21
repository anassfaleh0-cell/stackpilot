import Link from "next/link"
import { getRelatedByCategory, getHref, type RelatedItem } from "@/lib/content/internal-links"
import { Star, ArrowRight, BookOpen, Scale, Layers } from "lucide-react"

function SectionCard({ item }: { item: RelatedItem }) {
  return (
    <Link
      href={getHref(item)}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-muted-bg p-3 transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{item.title}</p>
        <p className="text-[11px] text-muted-foreground capitalize">{item.type.replace("-", " ")}</p>
      </div>
      {item.rating && (
        <div className="flex items-center gap-1 text-xs shrink-0">
          <Star size={11} className="fill-accent text-accent" />
          <span className="font-medium">{item.rating}</span>
        </div>
      )}
      <ArrowRight size={14} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  )
}

function SectionGroup({ title, icon, items }: { title: string; icon: React.ReactNode; items: RelatedItem[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-1.5">
        {items.map((item) => (
          <SectionCard key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export function InternalLinks({ category, excludeSlug }: { category: string; excludeSlug: string }) {
  const { reviews, comparisons, guides, bestPages, alternatives } = getRelatedByCategory(category, excludeSlug, 4)
  const all = [...reviews, ...comparisons, ...guides, ...bestPages, ...alternatives]
  if (all.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Related Software &amp; Resources</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-4">
          <SectionGroup title="Reviews" icon={<Star size={12} />} items={reviews} />
          <SectionGroup title="Best Software" icon={<Layers size={12} />} items={bestPages} />
        </div>
        <div className="space-y-4">
          <SectionGroup title="Comparisons" icon={<Scale size={12} />} items={comparisons} />
          <SectionGroup title="Alternatives" icon={<ArrowRight size={12} />} items={alternatives} />
        </div>
        <div className="space-y-4">
          <SectionGroup title="Guides" icon={<BookOpen size={12} />} items={guides} />
        </div>
      </div>
    </section>
  )
}
