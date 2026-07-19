import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Navigation } from "./navigation"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"
import { site } from "@/lib/constants"
import { Search } from "lucide-react"
import { SocialHeaderIcons } from "@/components/brand/social-icons"

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
            aria-label={`${site.name} - Home`}
          >
            <img src="/favicon.svg" alt="" className="h-7 w-7" width={28} height={28} aria-hidden="true" fetchPriority="high" />
            <span>{site.name}</span>
          </Link>
          <Navigation />
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SocialHeaderIcons />
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-bg transition-all duration-200"
            aria-label="Search PilotStack"
          >
            <Search size={16} />
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
