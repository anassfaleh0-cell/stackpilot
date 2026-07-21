"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navConfig } from "@/lib/constants"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

function Dropdown({ item, pathname }: { item: (typeof navConfig)[number]; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  if (item.children.length === 0) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
            isActive(item.href)
              ? "text-primary bg-primary-subtle"
              : "text-muted-foreground hover:text-foreground hover:bg-muted-bg"
          )}
        >
          {item.label}
        </Link>
      </li>
    )
  }

  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
          isActive(item.href)
            ? "text-primary bg-primary-subtle"
            : "text-muted-foreground hover:text-foreground hover:bg-muted-bg"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {item.label}
        <ChevronDown size={14} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-border bg-popover shadow-lg backdrop-blur-xl z-50 py-1.5">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2 text-sm transition-colors",
                isActive(child.href)
                  ? "text-primary bg-primary-subtle font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted-bg"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation" className="hidden md:block">
      <ul className="flex items-center gap-0.5">
        {navConfig.map((item) => (
          <Dropdown key={item.label} item={item} pathname={pathname} />
        ))}
      </ul>
    </nav>
  )
}
