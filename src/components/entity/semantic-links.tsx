import Link from "next/link"
import { GlassCard } from "@/components/editorial/glass-card"
import { getAllReviews, getContentTitle } from "@/lib/content/registry"
import { BookOpen, GitCompare, FileText, BookMarked } from "lucide-react"

interface SemanticLinksProps {
  slug: string
  className?: string
}

export function SemanticLinks({ slug, className = "" }: SemanticLinksProps) {
  const allReviews = getAllReviews()
  const review = allReviews.find((r) => r.slug === slug)
  if (!review) return null

  const comparisons = (review.relatedComparisons || []).filter(Boolean)
  const guides = (review.relatedGuides || []).filter(Boolean)
  const posts = (review.relatedPosts || []).filter(Boolean)
  const alternatives = (review.alternatives || []).filter(Boolean)

  const sections: { label: string; icon: React.ReactNode; items: { slug: string; title: string; href: string }[] }[] = []

  const compItems = comparisons.map((c) => ({
    slug: c,
    title: getContentTitle("comparison", c) || c,
    href: `/comparisons/${c}`,
  }))

  const guideItems = guides.map((g) => ({
    slug: g,
    title: getContentTitle("guide", g) || g,
    href: `/guides/${g}`,
  }))

  const blogItems = posts.map((p) => ({
    slug: p,
    title: getContentTitle("blog", p) || p,
    href: `/blog/${p}`,
  }))

  const altItems = alternatives.map((a) => ({
    slug: a,
    title: allReviews.find((r) => r.slug === a)?.name || a,
    href: `/reviews/${a}`,
  }))

  if (compItems.length > 0) sections.push({ label: "Comparisons", icon: <GitCompare size={14} />, items: compItems })
  if (guideItems.length > 0) sections.push({ label: "Guides", icon: <BookOpen size={14} />, items: guideItems })
  if (blogItems.length > 0) sections.push({ label: "Research", icon: <FileText size={14} />, items: blogItems })
  if (altItems.length > 0) sections.push({ label: "Alternatives", icon: <BookMarked size={14} />, items: altItems })

  if (sections.length === 0) return null

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight">Related Content</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <GlassCard key={section.label}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary">{section.icon}</span>
                <h3 className="font-semibold text-sm">{section.label}</h3>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
