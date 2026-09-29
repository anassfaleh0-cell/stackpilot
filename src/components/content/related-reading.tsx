import Link from "next/link"
import { getContentTitle, isContentAvailable } from "@/lib/content/registry"
import { BookOpen, GitCompare, FileText, Star, ArrowRight } from "lucide-react"

export interface RelatedReadingProps {
  /** Related tool review slugs */
  reviews?: string[]
  /** Related comparison slugs */
  comparisons?: string[]
  /** Related guide slugs */
  guides?: string[]
  /** Related research/article slugs */
  posts?: string[]
  /** Slugs that must never link to themselves (the current page) */
  excludeSlug?: string
  title?: string
}

interface Group {
  label: string
  icon: React.ReactNode
  items: { href: string; title: string }[]
}

function resolve(type: string, slugs: string[], route: string, excludeSlug?: string) {
  return (slugs || [])
    .filter((slug) => slug && slug !== excludeSlug && isContentAvailable(type, slug))
    .map((slug) => ({ href: `/${route}/${slug}`, title: getContentTitle(type, slug) || slug }))
    .slice(0, 6)
}

/**
 * Contextual internal links derived from the related* fields already declared in content files.
 * Unpublished / suppressed slugs are dropped so we never emit a link to unreachable content.
 */
export function RelatedReading({
  reviews,
  comparisons,
  guides,
  posts,
  excludeSlug,
  title = "Related Reading",
}: RelatedReadingProps) {
  const groups: Group[] = [
    { label: "Reviews", icon: <Star size={12} />, items: resolve("review", reviews || [], "reviews", excludeSlug) },
    { label: "Comparisons", icon: <GitCompare size={12} />, items: resolve("comparison", comparisons || [], "comparisons", excludeSlug) },
    { label: "Guides", icon: <BookOpen size={12} />, items: resolve("guide", guides || [], "guides", excludeSlug) },
    { label: "Research", icon: <FileText size={12} />, items: resolve("blog", posts || [], "blog", excludeSlug) },
  ].filter((g) => g.items.length > 0)

  if (groups.length === 0) return null

  return (
    <section className="mt-14 pt-8 border-t border-border" aria-label={title}>
      <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {group.icon}
              {group.label}
            </h3>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="truncate">{item.title}</span>
                    <ArrowRight size={12} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
