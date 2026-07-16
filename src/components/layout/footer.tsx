import Link from "next/link"
import { Container } from "@/components/ui/container"
import { site, navLinks, categories } from "@/lib/constants"
import { Compass } from "lucide-react"

const footerLinks = [
  {
    title: "Explore",
    links: navLinks,
  },
  {
    title: "Categories",
    links: categories.slice(0, 8).map((c) => ({
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
    <footer className="border-t border-border bg-muted-bg/50">
      <Container className="py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                <Compass size={18} />
              </div>
              <span>{site.name}</span>
            </Link>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              {site.description}
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; 2024-2026 {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Independent reviews and comparisons. We may earn commissions from affiliate links.
          </p>
        </div>
      </Container>
    </footer>
  )
}
