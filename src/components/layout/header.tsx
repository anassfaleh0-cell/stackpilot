import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Navigation } from "./navigation"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"
import { site } from "@/lib/constants"
import { Search } from "lucide-react"
import { SocialHeaderIcons } from "@/components/brand/social-icons"
import { Logo } from "@/components/brand/logo"

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-85"
            aria-label={`${site.name} - Home`}
          >
            <Logo />
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
