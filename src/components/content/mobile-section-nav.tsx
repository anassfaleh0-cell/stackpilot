"use client"

import Link from "next/link"
import { ListTree } from "lucide-react"

export type SectionNavItem = { href: string; label: string }

export function MobileSectionNav({ items, label = "On this page" }: { items: SectionNavItem[]; label?: string }) {
  if (items.length < 2) return null

  return (
    <nav aria-label={label} className="mb-6 rounded-xl border border-border bg-card p-3 sm:p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <ListTree size={16} className="text-primary" aria-hidden="true" />
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex min-h-10 items-center rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted-bg hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
