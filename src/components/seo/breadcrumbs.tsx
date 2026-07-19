import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home size={14} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight size={14} aria-hidden="true" />
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-foreground transition-colors truncate">
                  {item.name}
                </Link>
              ) : (
                <span className="text-foreground font-medium truncate" aria-current={isLast ? "page" : undefined}>
                  {item.name}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
