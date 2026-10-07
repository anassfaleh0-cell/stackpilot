"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navConfig } from "@/lib/constants"
import { useState, useRef, useEffect, useId } from "react"
import { ChevronDown } from "lucide-react"

const CLOSE_DELAY_MS = 150

function Dropdown({ item, pathname }: { item: (typeof navConfig)[number]; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelId = useId()

  function cancelClose() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function scheduleClose() {
    cancelClose()
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      setOpen(false)
    }, CLOSE_DELAY_MS)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current)
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        ref.current?.querySelector("button")?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

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
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        type="button"
        onClick={() => {
          cancelClose()
          setOpen(true)
        }}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
          isActive(item.href)
            ? "text-primary bg-primary-subtle"
            : "text-muted-foreground hover:text-foreground hover:bg-muted-bg"
        )}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {item.label}
        <ChevronDown size={14} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute top-full left-0 mt-1 w-48 rounded-xl border border-border bg-popover shadow-lg backdrop-blur-xl z-50 py-1.5",
          // Hover bridge: fills the mt-1 gap between the trigger and the panel so
          // the pointer never leaves the <li> while travelling between them.
          "before:absolute before:inset-x-0 before:-top-1 before:h-1 before:content-['']"
        )}
      >
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
