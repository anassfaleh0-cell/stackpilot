"use client"

import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Navigation } from "./navigation"
import { MobileNav } from "./mobile-nav"
import { site } from "@/lib/constants"
import { Search, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function Header() {
  const { resolved, toggle } = useTheme()

  return (
    <header role="banner" className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
            aria-label={`${site.name} - Home`}
          >
            <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="30" height="30" rx="8" className="fill-primary" />
              <path d="M11 13l5-5 5 5M11 21l5-5 5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span>{site.name}</span>
          </Link>
          <Navigation />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200"
            aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
          >
            {resolved === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200"
            aria-label="Search StackPilot"
          >
            <Search size={16} />
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
