import Link from "next/link"
import {
  getRelatedByCategory,
  getHref,
  type RelatedItem,
  type RelatedResult,
  type RelatedType,
} from "@/lib/content/internal-links"
import {
  Star,
  ArrowRight,
  BookOpen,
  Scale,
  Layers,
  Target,
  LayoutGrid,
  Building2,
  FlaskConical,
  BarChart3,
  Newspaper,
  BookMarked,
} from "lucide-react"

export const LEGACY_RELATED_TYPES: RelatedType[] = ["review", "comparison", "guide", "best", "alternative"]

export const EXTENDED_RELATED_TYPES: RelatedType[] = [
  "use-case",
  "hub",
  "industry",
  "research",
  "statistic",
  "blog",
  "glossary",
]

export function extendedRelatedItems(result: RelatedResult): RelatedItem[] {
  return result.related.filter((item) => EXTENDED_RELATED_TYPES.includes(item.type))
}

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

interface SectionDef {
  family: RelatedType
  title: string
  icon: React.ReactNode
  bucket: keyof RelatedResult
}

const SECTION_DEFS: SectionDef[] = [
  { family: "review", title: "Reviews", icon: <Star size={12} />, bucket: "reviews" },
  { family: "best", title: "Best Software", icon: <Layers size={12} />, bucket: "bestPages" },
  { family: "use-case", title: "Use Cases", icon: <Target size={12} />, bucket: "useCases" },
  { family: "statistic", title: "Statistics", icon: <BarChart3 size={12} />, bucket: "statistics" },
  { family: "comparison", title: "Comparisons", icon: <Scale size={12} />, bucket: "comparisons" },
  { family: "alternative", title: "Alternatives", icon: <ArrowRight size={12} />, bucket: "alternatives" },
  { family: "industry", title: "Industries", icon: <Building2 size={12} />, bucket: "industries" },
  { family: "research", title: "Research", icon: <FlaskConical size={12} />, bucket: "research" },
  { family: "guide", title: "Guides", icon: <BookOpen size={12} />, bucket: "guides" },
  { family: "hub", title: "Hubs", icon: <LayoutGrid size={12} />, bucket: "hubs" },
  { family: "blog", title: "Blog Posts", icon: <Newspaper size={12} />, bucket: "blogPosts" },
  { family: "glossary", title: "Glossary Terms", icon: <BookMarked size={12} />, bucket: "glossaryTerms" },
]

const COLUMN_COUNT = 3
const DEFS_PER_COLUMN = SECTION_DEFS.length / COLUMN_COUNT

export function InternalLinks({
  category,
  excludeSlug,
  families,
}: {
  category: string
  excludeSlug: string
  families?: RelatedType[]
}) {
  const result = getRelatedByCategory(category, excludeSlug, 4)
  const allowed = families ?? SECTION_DEFS.map((def) => def.family)

  const columns: SectionDef[][] = Array.from({ length: COLUMN_COUNT }, (_, column) =>
    SECTION_DEFS.slice(column * DEFS_PER_COLUMN, (column + 1) * DEFS_PER_COLUMN).filter((def) =>
      allowed.includes(def.family)
    )
  )

  const rendered = columns
    .flat()
    .map((def) => result[def.bucket])
    .filter((items) => items.length > 0)
  if (rendered.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Related Software &amp; Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((defs, index) => (
          <div key={index} className="space-y-4 min-w-0">
            {defs.map((def) => (
              <SectionGroup key={def.family} title={def.title} icon={def.icon} items={result[def.bucket]} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
