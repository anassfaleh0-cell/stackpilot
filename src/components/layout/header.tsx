import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Navigation } from "./navigation"
import { MobileNav } from "./mobile-nav"
import { site } from "@/lib/constants"
import { Search, Compass } from "lucide-react"

export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight"
            aria-label={`${site.name} - Home`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white" aria-hidden="true">
              <Compass size={18} />
            </div>
            <span>{site.name}</span>
          </Link>
          <Navigation />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-muted-bg transition-colors"
            aria-label="Search StackPilot"
          >
            <Search size={18} />
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
