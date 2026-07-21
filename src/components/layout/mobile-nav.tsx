"use client"

import Link from "next/link"
import { X, Menu } from "lucide-react"
import { navLinks, categories } from "@/lib/constants"
import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false)
      buttonRef.current?.focus()
      return
    }
    if (e.key === "Tab" && menuRef.current) {
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      const timer = setTimeout(() => {
        const first = menuRef.current?.querySelector<HTMLElement>('a[href]')
        first?.focus()
      }, 50)
      return () => {
        clearTimeout(timer)
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
      }
    }
  }, [open, handleKeyDown])

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-16 right-4 left-4 z-50 rounded-xl border border-border bg-card p-5 shadow-elevated",
          "transition-all duration-200",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <nav aria-label="Mobile navigation">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-muted-bg hover:text-foreground"
                  tabIndex={open ? 0 : -1}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <hr className="section-divider my-4" />
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
          <ul className="space-y-1">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm rounded-lg transition-colors hover:bg-muted-bg hover:text-foreground text-muted-foreground"
                  tabIndex={open ? 0 : -1}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
