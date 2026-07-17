"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navLinks } from "@/lib/constants"

export function Navigation() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav aria-label="Main navigation" className="hidden md:flex md:items-center md:gap-0.5">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={cn(
            "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
            isActive(link.href)
              ? "text-primary bg-primary-subtle"
              : "text-muted-foreground hover:text-foreground hover:bg-muted-bg"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
