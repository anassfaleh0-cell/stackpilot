import Link from "next/link"
import { Container } from "@/components/ui/container"
import { site, navLinks, categories } from "@/lib/constants"
import { Compass, ArrowUpRight, ExternalLink } from "lucide-react"

const footerLinks = [
  {
    title: "Explore",
    links: navLinks,
  },
  {
    title: "Categories",
    links: categories.map((c) => ({
      href: `/category/${c.slug}`,
      label: c.name,
    })),
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/methodology", label: "Review Methodology" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-sm">
                <Compass size={18} />
              </div>
              <span>{site.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {site.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn more <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2024-2026 {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Independent reviews and comparisons. We may earn commissions from affiliate links. All reviews follow our <Link href="/methodology" className="underline underline-offset-2 hover:text-foreground">editorial methodology</Link>.
          </p>
        </div>
      </Container>
    </footer>
  )
}
